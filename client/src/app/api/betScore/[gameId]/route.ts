import {z} from "zod";
import prisma from "@/utils/client";
import {NextRequest, NextResponse} from "next/server";
import {verifyJwtToken} from "@/utils/authHelper";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";

const BetToInsert = z.object({
    gameId: z.number().or(z.string()).transform(Number)
})



type Bet = z.infer<typeof BetToInsert>;

export async function GET(request: NextRequest,{ params } : { params : {gameId: string } }) {

    const token = request.cookies.get('token');

    if(token === null || token === undefined) {
        return APIErrorResponse.return_error("token does not exist", StatusCodes.BAD_REQUEST);
    }
    const payload = await verifyJwtToken(token.value);

    if(payload === null) {
        return APIErrorResponse.return_error("payload does not exist", StatusCodes.BAD_REQUEST);
    }

    const bet_to_get: Bet = BetToInsert.parse(params);

    const bet = await prisma.betting.findFirst(
        {
            where: {
                AND: [
                    {userId:  payload.userId as number },
                    {gameId: bet_to_get.gameId}
                ]
            }
        }
    )

    if(bet === null){
        return NextResponse.json(null);
    }


    else{
        return NextResponse.json(bet);
    }


}