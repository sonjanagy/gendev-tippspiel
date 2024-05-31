import prisma from "@/utils/client";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request){
    const results = await prisma.user.findFirst({
        orderBy: {
            totalPoints: 'asc',
        },
    })
    console.log(results);

    return NextResponse.json("worst user :(")

}
