import prisma from "@/utils/client";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {

    await prisma.team.createMany({
        data: [
            { country: "Germany", flag: "DE", updatedAt: new Date() },
            { country: "Belgium", flag: "BE", updatedAt: new Date() },
            { country: "France", flag: "FR", updatedAt: new Date() },
            { country: "Portugal", flag: "PT", updatedAt: new Date() },
            { country: "Scotland", flag: "SCO", updatedAt: new Date() },
            { country: "Spain", flag: "ES", updatedAt: new Date() },
            { country: "Turkey", flag: "TR", updatedAt: new Date() },
            { country: "Austria", flag: "AT", updatedAt: new Date() },
            { country: "England", flag: "ENG", updatedAt: new Date() },
            { country: "Hungary", flag: "HU", updatedAt: new Date() },
            { country: "Slovakia", flag: "SK", updatedAt: new Date() },
            { country: "Albania", flag: "AL", updatedAt: new Date() },
            { country: "Denmark", flag: "DK", updatedAt: new Date() },
            { country: "Netherlands", flag: "NL", updatedAt: new Date() },
            { country: "Switzerland", flag: "CH", updatedAt: new Date() },
            { country: "Romania", flag: "RO", updatedAt: new Date() },
            { country: "Serbia", flag: "RS", updatedAt: new Date() },
            { country: "Italy", flag: "IT", updatedAt: new Date() },
            { country: "Czech Republic", flag: "CZ", updatedAt: new Date() },
            { country: "Slovenia", flag: "SL", updatedAt: new Date() },
            { country: "Croatia", flag: "HR", updatedAt: new Date() },
            { country: "Georgia", flag: "GE", updatedAt: new Date() },
            { country: "Ukraine", flag: "UA", updatedAt: new Date() },
            { country: "Poland", flag: "PL", updatedAt: new Date() }
        ]
    });

    return NextResponse.json("Teams were inserted successfully.");
}
