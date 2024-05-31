import prisma from "@/utils/client";
import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";

const aktUser = z.object({
    userId: z.number().or(z.string()).transform(Number)
})

type aktUser = z.infer<typeof aktUser>;

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest,{ params } : { params : {userId: string } }) {

    const user_to_load: aktUser = aktUser.parse(params);

    const communities = await prisma.has.findMany(
        {
            where: {
                userId: user_to_load.userId
            },

            relationLoadStrategy: 'join',
            include: {
                community: true
            },
        }
    )


    if(communities === null){
        return NextResponse.json(null);
    }
    else{
        return NextResponse.json(communities);
    }
}

