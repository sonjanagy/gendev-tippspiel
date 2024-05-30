import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {NextResponse} from "next/server";


export async function GET(request: Request) {

    const games = await prisma.game.findMany({
        relationLoadStrategy: 'join',
        include: {
            hometeam: true,
            awayteam: true
        },
    });

    if (games === null) {
        return APIErrorResponse.return_error("No games found", StatusCodes.BAD_REQUEST);
    }

    return NextResponse.json(games);
}