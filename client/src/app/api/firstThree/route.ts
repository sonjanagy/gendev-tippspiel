import prisma from "@/utils/client";
import {NextResponse} from "next/server";

export async function GET(request: Request){
    const results = await prisma.user.findMany({
        take: 3,
        orderBy: {
            totalPoints: 'desc',
        },
    })
    console.log(results);

    return NextResponse.json("best 3 users :)")

}