import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";

const Game = z.object({
    gameId: z.number().or(z.string()).transform(Number)
})

type Game = z.infer<typeof Game>;

export const dynamic = 'force-dynamic'
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


    const updateGame = await prisma.game.update({
        where: {
            gameId: game_to_update.gameId,
        },
        data: {
            beginStart: null,
            beginStop: new Date(),
            state: "HALFTIME",
            updatedAt: new Date(),
        },
    })



    if(updateGame === null){
        return APIErrorResponse.return_error("Something went wrong", StatusCodes.BAD_REQUEST);
    }
    else{
        return NextResponse.json("endHalf was executed successfully.");
    }
}
