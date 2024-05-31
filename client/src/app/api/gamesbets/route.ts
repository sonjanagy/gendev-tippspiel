import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {NextRequest, NextResponse} from "next/server";
import {verifyJwtToken} from "@/utils/authHelper";

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {

    const token = request.cookies.get('token');

    if (token === null || token === undefined) {
        return APIErrorResponse.return_error("token does not exist", StatusCodes.BAD_REQUEST);
    }
    const payload = await verifyJwtToken(token.value);

    if (payload === null) {
        return APIErrorResponse.return_error("payload does not exist", StatusCodes.BAD_REQUEST);
    }

    const games = await prisma.game.findMany({
        relationLoadStrategy: 'join',
        include: {
            hometeam: true,
            awayteam: true,
            userbets: {
                where:{
                    userId: payload.userId as number
                }
            }
        },
    });

    if (games === null) {
        return APIErrorResponse.return_error("No games found", StatusCodes.BAD_REQUEST);
    }

    return NextResponse.json(games);
}
