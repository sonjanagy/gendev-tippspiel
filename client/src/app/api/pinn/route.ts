import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {z} from "zod";
import {verifyJwtToken} from "@/utils/authHelper";
import {NextRequest, NextResponse} from "next/server";
import { Prisma } from "@prisma/client";

const Friend = z.object({
    friendId: z.number()
})

type Friend = z.infer<typeof Friend>;

export const dynamic = 'force-dynamic'
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
    const friend_to_add: Friend = Friend.parse(body);

    const pin = await prisma.isFriendOf.findFirst(
        {
            where: {
                AND: [
                    {userId: payload.userId as number},
                    {friendOfUserId: friend_to_add.friendId}
                ]
            }
        }
    )

    if(pin === null){
        await prisma.isFriendOf.create(
            {
                data: {
                    userId: payload.userId as number,
                    friendOfUserId: friend_to_add.friendId,
                    updatedAt: new Date(),
                }
            }
        )

        const updateComFr = Prisma.sql`
    REFRESH MATERIALIZED VIEW rank_communities_friends`
        const res4 = await prisma.$queryRaw(updateComFr)

        return NextResponse.json("Friendship was inserted successfully.");

    }
    else{
        return NextResponse.json("Friendship already exists.");
    }
}

