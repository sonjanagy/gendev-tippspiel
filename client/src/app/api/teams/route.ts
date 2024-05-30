import prisma from "@/utils/client";
import {z} from "zod";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";
import * as argon2 from "argon2";
import {NextResponse} from "next/server";


export async function GET(request: Request) {

    const teams = await prisma.team.findMany();

    if (teams === null) {
        return APIErrorResponse.return_error("No teams found", StatusCodes.BAD_REQUEST);
    }

    return NextResponse.json(teams);
}