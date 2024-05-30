import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {z} from "zod";
import {verifyJwtToken} from "@/utils/authHelper";
import {NextRequest, NextResponse} from "next/server";

const Friend = z.object({
    friendId: z.number()
})

type Friend = z.infer<typeof Friend>;


export async function POST(request: NextRequest) {

    const token = request.cookies.get('token');

    if (token === null || token === undefined) {
        return APIErrorResponse.return_error("token does not exist", StatusCodes.BAD_REQUEST);
    }
    const payload = await verifyJwtToken(token.value);

    if (payload === null) {
        return APIErrorResponse.return_error("payload does not exist", StatusCodes.BAD_REQUEST);
    }

    const body = await request.json();
    const friend_to_delete: Friend = Friend.parse(body);

    const pin = await prisma.isFriendOf.findFirst(
        {
            where: {
                AND: [
                    {userId: payload.userId as number},
                    {friendOfUserId: friend_to_delete.friendId}
                ]
            }
        }
    )

    if(pin === null){

        return NextResponse.json("Friendship doesn't exist");
    }
    else{

        await prisma.isFriendOf.deleteMany({
            where: {
                AND: [
                    {userId: payload.userId as number},
                    {friendOfUserId: friend_to_delete.friendId}
                ]
            },
        })
        return NextResponse.json("Friendship is deleted.");
    }
}

