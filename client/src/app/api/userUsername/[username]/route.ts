import prisma from "@/utils/client";
import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";

const User = z.object({
    username: z.string()
})

type User = z.infer<typeof User>;


export async function GET(request: NextRequest,{ params } : { params : {username: string } }) {

    const user_to_load: User = User.parse(params);

    const user = await prisma.user.findFirst(
        {
            where: {
                username: user_to_load.username
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

