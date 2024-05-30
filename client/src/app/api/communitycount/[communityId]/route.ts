import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

import {Prisma} from '@prisma/client'
import prisma from "@/utils/client";

const Community = z.object({
    communityId: z.number().or(z.string()).transform(Number)
})

type Community = z.infer<typeof Community>;

export async function GET(request: NextRequest, {params}: { params: { gameId: string } }) {

    const community_to_load: Community = Community.parse(params);

    const userCount = await prisma.has.count({
        where: {
            communityId: community_to_load.communityId
        },
    })

    return NextResponse.json(userCount);
}