import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {useState} from "react";
import {Prisma} from '@prisma/client'
import { Phase as PHASE }  from '@prisma/client'


const Game = z.object({
    gameId: z.number().or(z.string()).transform(Number)
})

type Game = z.infer<typeof Game>;

export async function POST(request: NextRequest, {params}: { params: { gameId: string } }) {

    const game_to_update: Game = Game.parse(params);

    const getGame = await prisma.game.findFirst({
        where:{
            gameId: game_to_update.gameId
        }
    })

    if(getGame === null){
        return APIErrorResponse.return_error("Something went wrong", StatusCodes.BAD_REQUEST);
    }

    let beginStart = null

    if(getGame.beginStart === null || getGame.beginStop === null){
        beginStart = new Date()
    }
    else{
        getGame.beginStart.setHours(getGame.beginStart.getHours() + (new Date().getHours() - getGame.beginStop.getHours()));
        getGame.beginStart.setMinutes(getGame.beginStart.getMinutes() + (new Date().getMinutes() - getGame.beginStop.getMinutes()))
        beginStart = getGame.beginStart
    }


    let phase_to_set = null

    console.log(getGame.phase)

    if(getGame.phase === null){
        phase_to_set = PHASE.FIRST
    }
    if(getGame.phase === PHASE.FIRST){
        phase_to_set = PHASE.SECOND
    }
    if(getGame.phase === PHASE.SECOND){
        phase_to_set = PHASE.OVERTIMEFIRST
    }
    if(getGame.phase === PHASE.OVERTIMEFIRST){
        phase_to_set = PHASE.OVERTIMESECOND
    }
    if(getGame.phase === PHASE.OVERTIMESECOND){
        phase_to_set = PHASE.PENALTY
    }
    if(getGame.phase === PHASE.PENALTY){
        phase_to_set = PHASE.PENALTY
    }

    const updateGame = await prisma.game.update({
        where: {
            gameId: game_to_update.gameId,
        },
        data: {
            beginStart: beginStart,
            beginStop: null,
            state: "RUNNING",
            phase: phase_to_set,
        },
    })

    /*const update = Prisma.sql `UPDATE "Game" g
        SET phase =
            CASE
            WHEN g.phase = ${PHASE.FIRST} THEN ${PHASE.FIRST}
            WHEN g.phase = 'SECOND' THEN 'OVERTIMEFIRST'
            WHEN g.phase = 'OVERTIMEFIRST' THEN 'OVERTIMESECOND'
            WHEN g.phase = 'OVERTIMESECOND' THEN 'PENALTY'
            WHEN g.phase = 'PENALTY' THEN 'PENALTY'
            WHEN g.phase IS NULL THEN 'FIRST'
            ELSE NULL
            END

            
            WHERE g."gameId" = ${game_to_update.gameId}`

    const updatequerry = await prisma.$queryRaw(update)*/


    const query = Prisma.sql`
        WITH user_with_bet AS (
            SELECT
                u."userId",
                u."totalPoints",
                b."scoreAwayteam",
                b."scoreHometeam"
            FROM
                "User" u
                    JOIN
                "Betting" b
                USING ("userId")
            WHERE
                b."gameId" = ${getGame.gameId}
              AND b."scoreAwayteam" = b."scoreHometeam"
        )
        UPDATE "User" u
        SET "totalPoints" = CASE
            -- 0:0
            WHEN user_with_bet."scoreHometeam" = 0 AND user_with_bet."scoreAwayteam" = 0 THEN u."totalPoints" + 8
            -- unentschieden
            WHEN user_with_bet."scoreHometeam" = user_with_bet."scoreAwayteam" AND user_with_bet."scoreHometeam" <> 0 THEN u."totalPoints" + 4
            ELSE u."totalPoints"
            END
        FROM user_with_bet
        WHERE u."userId" = user_with_bet."userId"

         AND u."userId" IN (
        SELECT uwb."userId"
        FROM user_with_bet uwb)`


    const updateAll = Prisma.sql`
        REFRESH MATERIALIZED VIEW rank_all`

    const updateCom = Prisma.sql`
        REFRESH MATERIALIZED VIEW rank_communities;`

    const updateComFr = Prisma.sql`
        REFRESH MATERIALIZED VIEW rank_communities_friends`

    if(getGame.state == "STOP"){
        const res = await prisma.$queryRaw(query)
        const res2 = await prisma.$queryRaw(updateAll)
        const res3 = await prisma.$queryRaw(updateCom)
        const res4 = await prisma.$queryRaw(updateComFr)
    }



    if(updateGame === null){
        return APIErrorResponse.return_error("Something went wrong", StatusCodes.BAD_REQUEST);
    }
    else{
        return NextResponse.json("start was executed successfully.");
    }
}