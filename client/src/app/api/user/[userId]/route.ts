import prisma from "@/utils/client";
import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";

const User = z.object({
    userId: z.number().or(z.string()).transform(Number)
})

type User = z.infer<typeof User>;

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest,{ params } : { params : {userId: string } }) {

    const user_to_load: User = User.parse(params);

    const user = await prisma.user.findFirst(
        {
            where: {
                userId: user_to_load.userId
            }
        }
    )

    if(user === null){
        return NextResponse.json(null);
    }
    else{
        return NextResponse.json(user);
    }
}

