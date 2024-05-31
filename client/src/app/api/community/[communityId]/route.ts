import prisma from "@/utils/client";
import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";

const Community = z.object({
    communityId: z.number().or(z.string()).transform(Number)
})

type Community = z.infer<typeof Community>;

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest,{ params } : { params : {communityId: string } }) {


    const community_to_load: Community = Community.parse(params);

    const community = await prisma.community.findFirst(
        {
            where: {
                communityId: community_to_load.communityId
            }
        }
    )

    if(community === null){
        return NextResponse.json(null);
    }
    else{
        return NextResponse.json(community);
    }
}

