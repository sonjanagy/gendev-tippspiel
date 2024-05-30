import {z} from "zod";
import prisma from "@/utils/client";
import {NextRequest, NextResponse} from "next/server";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {Prisma} from '@prisma/client'

const aktGame = z.object({
    gameId: z.number().or(z.string()).transform(Number)
})

type aktGame = z.infer<typeof aktGame>;

export async function POST(request: NextRequest,{ params } : { params : {gameId: string } }) {

    const game_to_load: aktGame = aktGame.parse(params);

    const game = await prisma.game.findFirst({
        where:{
            gameId: game_to_load.gameId
        }})

    if(game == null){
        return APIErrorResponse.return_error("Something went wrong", StatusCodes.BAD_REQUEST);
    }


    const query = Prisma.sql`
        WITH user_with_bet AS (
            SELECT
                u."userId",
                u."totalPoints",
                b."scoreAwayteam" AS "scoreHometeam",
                b."scoreHometeam" AS "scoreAwayteam"
            FROM
                "User" u
                    JOIN
                "Betting" b
                USING ("userId")
            WHERE
                b."gameId" = ${game.gameId}
        )
        UPDATE "User" u

        SET     "totalPoints" =  CASE
        -- genaues ergebnis -> tendancy (nicht unentscheiden)
        WHEN user_with_bet."scoreAwayteam" =  ${game.scoreHometeam} AND user_with_bet."scoreHometeam" = ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND ((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" > 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam}+1) > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" < 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam}+1) < 0))
        THEN u."totalPoints"-4
            
        -- genaues ergebnis -> falsch (nicht unentschieden)
        WHEN user_with_bet."scoreAwayteam" =  ${game.scoreHometeam} AND user_with_bet."scoreHometeam" = ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam}+1) = 0  AND user_with_bet."scoreAwayteam" = ${game.scoreHometeam}
            THEN u."totalPoints"-8 
            
        -- difference -> tendancy (nicht unentschieden)
        WHEN user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" = ${game.scoreHometeam} - ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" < 0 
            THEN u."totalPoints"-2

        -- difference -> falsch (nicht unentschieden)
        WHEN user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" = ${game.scoreHometeam} - ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" != ${game.scoreHometeam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam} +1) = 0
            THEN u."totalPoints"-6

        -- tendancy -> genau (nicht unentschieden)
        WHEN ((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" > 0 AND ${game.scoreHometeam} - ${game.scoreAwayteam} > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" < 0 AND ${game.scoreHometeam} - ${game.scoreAwayteam} < 0)) AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" + 1 = ${game.scoreHometeam} - ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND user_with_bet."scoreAwayteam" = ${game.scoreHometeam}
            THEN u."totalPoints"+4

        -- tendancy -> difference (nicht unentschieden)
        WHEN ((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" > 0 AND ${game.scoreHometeam} - ${game.scoreAwayteam} > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" < 0 AND ${game.scoreHometeam} - ${game.scoreAwayteam} < 0)) AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" + 1 = ${game.scoreHometeam} - ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND user_with_bet."scoreAwayteam" != ${game.scoreHometeam}
            THEN u."totalPoints"+2
            
        -- !!tendancy -> falsch (nicht unentschieden)
        WHEN ((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" > 0 AND ${game.scoreHometeam} - ${game.scoreAwayteam} > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" < 0 AND ${game.scoreHometeam} - ${game.scoreAwayteam} < 0)) AND ${game.scoreHometeam} - ${game.scoreAwayteam} != user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam} +1) = 0
            THEN u."totalPoints"-4
        
        -- falsch -> tendancy (nicht unentschieden)
        WHEN  ${game.scoreHometeam} = ${game.scoreAwayteam} AND ((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" > 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam}+1) > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" < 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam} + 1) < 0)) AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != ${game.scoreHometeam} - (${game.scoreAwayteam} +1)
            THEN u."totalPoints" + 4
        
         -- falsch -> richtig (nicht unentschieden)
        WHEN  ${game.scoreHometeam} = ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND user_with_bet."scoreHometeam" = ${game.scoreAwayteam} +1 AND user_with_bet."scoreAwayteam" = ${game.scoreHometeam}--((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" +1 > 0 AND ${game.scoreAwayteam} - ${game.scoreHometeam} > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" +1 < 0 AND ${game.scoreAwayteam} - ${game.scoreHometeam} < 0)) AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND user_with_bet."scoreAwayteam" = ${game.scoreAwayteam} AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" +1 = ${game.scoreAwayteam} - ${game.scoreHometeam}
            THEN u."totalPoints" + 8

         -- falsch -> difference (nicht unentschieden)
        WHEN  ${game.scoreHometeam} = ${game.scoreAwayteam} AND ((user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" > 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam} +1)  > 0) OR (user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam"  < 0 AND ${game.scoreHometeam} - (${game.scoreAwayteam} +1 )< 0)) AND user_with_bet."scoreAwayteam" - user_with_bet."scoreHometeam" != 0 AND ${game.scoreHometeam} != user_with_bet."scoreAwayteam"
              THEN u."totalPoints" + 6
    
        -- richtig -> falsch ( unentschieden)
        WHEN  ${game.scoreAwayteam} = user_with_bet."scoreHometeam" AND  ${game.scoreHometeam} = user_with_bet."scoreAwayteam" AND user_with_bet."scoreAwayteam"-user_with_bet."scoreHometeam" = 0
            THEN u."totalPoints" - 8

        -- tendancy -> falsch ( unentschieden)
        WHEN  ${game.scoreAwayteam} - ${game.scoreHometeam} = user_with_bet."scoreHometeam" - user_with_bet."scoreAwayteam" AND user_with_bet."scoreAwayteam"-user_with_bet."scoreHometeam" = 0
            THEN u."totalPoints" - 4

        -- falsch -> genau ( unentschieden)
        WHEN  ${game.scoreAwayteam} + 1 - ${game.scoreHometeam} = user_with_bet."scoreHometeam" - user_with_bet."scoreAwayteam" AND user_with_bet."scoreAwayteam"-user_with_bet."scoreHometeam" = 0 AND ${game.scoreHometeam} = user_with_bet."scoreAwayteam"
            THEN u."totalPoints" + 8

        -- falsch -> tendancy ( unentschieden)
        WHEN  ${game.scoreAwayteam} + 1 - ${game.scoreHometeam} = user_with_bet."scoreHometeam" - user_with_bet."scoreAwayteam" AND user_with_bet."scoreAwayteam"-user_with_bet."scoreHometeam" = 0 AND ${game.scoreHometeam} != user_with_bet."scoreAwayteam"
            THEN u."totalPoints" + 4
    ELSE u."totalPoints"

    END

    FROM user_with_bet

        WHERE u."userId" = user_with_bet."userId" AND u."userId" IN (
            SELECT uwb."userId"
            FROM user_with_bet uwb)`

    const updateAll = Prisma.sql`
        REFRESH MATERIALIZED VIEW rank_all;`

    const updateCom = Prisma.sql`
        REFRESH MATERIALIZED VIEW rank_communities;`

    const updateComFr = Prisma.sql`
        REFRESH MATERIALIZED VIEW rank_communities_friends`

    const res = await prisma.$queryRaw(query)
    //const res2 = await prisma.$queryRaw(updateAll)
    //const res3 = await prisma.$queryRaw(updateCom)
    //const res4 = await prisma.$queryRaw(updateComFr)


    const updateScore = await prisma.game.update({
        where: {
            gameId: game_to_load.gameId,
        },
        data: {
            scoreAwayteam: { increment: 1 }
        },
    })

    return NextResponse.json("score inserted")
}