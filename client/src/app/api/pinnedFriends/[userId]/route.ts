import prisma from "@/utils/client";
import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";

const aktUser = z.object({
    userId: z.number().or(z.string()).transform(Number)
})

type aktUser = z.infer<typeof aktUser>;

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest,{ params } : { params : {gameId: string } }) {

    const user_to_load: aktUser = aktUser.parse(params);

    const friends = await prisma.isFriendOf.findMany(
        {
            where: {
                userId: user_to_load.userId
            }
        }
    )

    if(friends === null){
        return NextResponse.json([]);
    }
    else{

        return NextResponse.json(friends);
    }
}

