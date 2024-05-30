
import prisma from "@/utils/client";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {

    const updateUser = await prisma.user.updateMany({
        data: {
            totalPoints: 0
        },
    })

    return NextResponse.json("updated")
}