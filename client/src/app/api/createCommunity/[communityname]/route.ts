import prisma from "@/utils/client";
import {NextResponse, NextRequest} from "next/server";
import {z} from "zod";

const Community = z.object({
    communityname: z.string()
})

type Community = z.infer<typeof Community>;



export async function POST(request: NextRequest,{ params } : { params : {communityname: string } }){

    const community_to_create: Community = Community.parse(params);

    await prisma.community.create({
        data: {
            communityname: community_to_create.communityname,
            updatedAt: new Date()
        },
    })

return NextResponse.json("community was created");
}
