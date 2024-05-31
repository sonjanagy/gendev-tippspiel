import prisma from "@/utils/client";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {

    const communities = await prisma.community.findMany();



    if (communities === null) {
        return NextResponse.json([]);
    }

    return NextResponse.json(communities);
}
