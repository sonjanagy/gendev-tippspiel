import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {z} from "zod";
import {verifyJwtToken} from "@/utils/authHelper";
import {NextRequest, NextResponse} from "next/server";

const Community = z.object({
    communityId: z.number()
})

type Community = z.infer<typeof Community>;


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
    const community_to_join: Community = Community.parse(body);

    const join = await prisma.has.findFirst(
        {
            where: {
                AND: [
                    {userId: payload.userId as number},
                    {communityId: community_to_join.communityId}
                ]
            }
        }
    )

    if(join === null){
        await prisma.has.create(
            {
                data: {
                    userId: payload.userId as number,
                    communityId: community_to_join.communityId,
                    updatedAt: new Date(),
                }
            }
        )
        return NextResponse.json("Joining the community was successful.");
    }
    else{
        return NextResponse.json("yoi already joined the community.");
    }
}

