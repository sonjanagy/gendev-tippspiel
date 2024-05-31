import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {NextRequest, NextResponse} from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

    const games = await prisma.game.findMany({
        where: {
            date: new Date(),
        }

    });

    if (games === null) {
        return APIErrorResponse.return_error("No games found", StatusCodes.BAD_REQUEST);
    }

    return NextResponse.json(games);
}
