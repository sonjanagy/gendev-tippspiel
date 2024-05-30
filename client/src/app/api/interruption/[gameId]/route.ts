import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";

const Game = z.object({
    gameId: z.number().or(z.string()).transform(Number)
})

type Game = z.infer<typeof Game>;

export async function POST(request: NextRequest, {params}: { params: { gameId: string } }) {

    const game_to_update: Game = Game.parse(params);

    const updateGame = await prisma.game.update({
        where: {
            gameId: game_to_update.gameId,
        },
        data: {
            beginStop: new Date(),
            state: "INTERRUPT"
        },
    })

    if(updateGame === null){
        return APIErrorResponse.return_error("Something went wrong", StatusCodes.BAD_REQUEST);
    }
    else{
        return NextResponse.json("interruption was executed successfully.");
    }
}