import prisma from "@/utils/client";
import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";
import {json} from "node:stream/consumers";

const aktCommunity = z.object({
    communityId: z.number().or(z.string()).transform(Number)
})

type aktCommunity = z.infer<typeof aktCommunity>;

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest,{ params } : { params : {communityId: string } }) {

    const community_to_load: aktCommunity = aktCommunity.parse(params);

    const users = await prisma.has.findMany(
        {
            where: {
                communityId: community_to_load.communityId
            },

            relationLoadStrategy: 'join',
            include: {
                user: true
            },
        }
    )

    if(users === null){
        return NextResponse.json([]);
    }
    else{
        return NextResponse.json(users);
    }
}

