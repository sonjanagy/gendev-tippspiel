import prisma from "@/utils/client";
import {NextResponse} from "next/server";

export async function POST(request: Request) {

    await prisma.team.createMany({
        data: [
            { country: "Germany", flag: "not yet there", updatedAt: new Date() },
            { country: "Belgium", flag: "not yet there", updatedAt: new Date() },
            { country: "France", flag: "not yet there", updatedAt: new Date() },
            { country: "Portugal", flag: "not yet there", updatedAt: new Date() },
            { country: "Scotland", flag: "not yet there", updatedAt: new Date() },
            { country: "Spain", flag: "not yet there", updatedAt: new Date() },
            { country: "Turkey", flag: "not yet there", updatedAt: new Date() },
            { country: "Austria", flag: "not yet there", updatedAt: new Date() },
            { country: "England", flag: "not yet there", updatedAt: new Date() },
            { country: "Hungary", flag: "not yet there", updatedAt: new Date() },
            { country: "Slovakia", flag: "not yet there", updatedAt: new Date() },
            { country: "Albania", flag: "not yet there", updatedAt: new Date() },
            { country: "Denmark", flag: "not yet there", updatedAt: new Date() },
            { country: "Netherlands", flag: "not yet there", updatedAt: new Date() },
            { country: "Switzerland", flag: "not yet there", updatedAt: new Date() },
            { country: "Romania", flag: "not yet there", updatedAt: new Date() },
            { country: "Serbia", flag: "not yet there", updatedAt: new Date() },
            { country: "Italy", flag: "not yet there", updatedAt: new Date() },
            { country: "Czech Republic", flag: "not yet there", updatedAt: new Date() },
            { country: "Slovenia", flag: "not yet there", updatedAt: new Date() },
            { country: "Croatia", flag: "not yet there", updatedAt: new Date() },
            { country: "Georgia", flag: "not yet there", updatedAt: new Date() },
            { country: "Ukraine", flag: "not yet there", updatedAt: new Date() },
            { country: "Poland", flag: "not yet there", updatedAt: new Date() }
        ]
    });

    return NextResponse.json("Teams were inserted successfully.");
}