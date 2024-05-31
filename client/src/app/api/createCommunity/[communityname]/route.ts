import prisma from "@/utils/client";
import {NextResponse, NextRequest} from "next/server";
import {z} from "zod";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import {verifyJwtToken} from "@/utils/authHelper";
import {Prisma} from "@prisma/client";

const Community = z.object({
    communityname: z.string()
})

type Community = z.infer<typeof Community>;

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest,{ params } : { params : {communityname: string } }){

    const community_to_create: Community = Community.parse(params);

    const created_community = await prisma.community.createManyAndReturn({
        data: {
            communityname: community_to_create.communityname,
            updatedAt: new Date()
        },
    })

    const token = request.cookies.get('token');

    if (token === null || token === undefined) {
        return APIErrorResponse.return_error("token does not exist", StatusCodes.BAD_REQUEST);
    }
    const payload = await verifyJwtToken(token.value);

    if (payload === null) {
        return APIErrorResponse.return_error("payload does not exist", StatusCodes.BAD_REQUEST);
    }

    await prisma.has.create(
        {
            data: {
                userId: payload.userId as number,
                communityId: created_community[0].communityId,
                updatedAt: new Date(),
            }
        }
    )

    const updateCom = Prisma.sql`
    REFRESH MATERIALIZED VIEW rank_communities;`
    const res3 = prisma.$queryRaw(updateCom)

    const updateComFr = Prisma.sql`
    REFRESH MATERIALIZED VIEW rank_communities_friends`
    const res4 = prisma.$queryRaw(updateComFr)

    const awaitPromises = []
    awaitPromises.push(res3)
    awaitPromises.push(res4)

    const done = await Promise.all(awaitPromises)

    return NextResponse.json("community was created");
}
