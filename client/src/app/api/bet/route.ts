import {z} from "zod";
import prisma from "@/utils/client";
import {NextRequest, NextResponse} from "next/server";
import {verifyJwtToken} from "@/utils/authHelper";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";

const BetToInsert = z.object({
    gameId: z.number(),
    scoreHometeam: z.number(),
    scoreAwayTeam: z.number(),
})

type Bet = z.infer<typeof BetToInsert>;

export async function POST(request: NextRequest) {

    const token = request.cookies.get('token');

    if(token === null || token === undefined) {
        return APIErrorResponse.return_error("token does not exist", StatusCodes.BAD_REQUEST);
    }
    const payload = await verifyJwtToken(token.value);

    if(payload === null) {
        return APIErrorResponse.return_error("payload does not exist", StatusCodes.BAD_REQUEST);
    }

    const body = await request.json();
    const bet_To_Insert: Bet = BetToInsert.parse(body);

    const bet = await prisma.betting.findFirst(
        {
            where: {
                AND: [
                    {userId:  payload.userId as number },
                    {gameId: bet_To_Insert.gameId}
                ]
            }
        }
    )

    if(bet === null){
        await prisma.betting.create(
            {
                data: {
                    gameId: bet_To_Insert.gameId,
                    userId: payload.userId as number,
                    scoreHometeam: bet_To_Insert.scoreHometeam,
                    scoreAwayteam: bet_To_Insert.scoreAwayTeam,
                    updatedAt: new Date(),
                }
            }
        )
    }
    else{
        await prisma.betting.updateMany(
            {
                where: {
                    AND: [
                        {userId:  payload.userId as number },
                        {gameId: bet_To_Insert.gameId}
                    ]
                },
                data: {
                    scoreHometeam: bet_To_Insert.scoreHometeam,
                    scoreAwayteam: bet_To_Insert.scoreAwayTeam,
                    updatedAt: new Date(),
                },
            }
        )
    }

    return NextResponse.json("Bet was inserted successfully.");
}