import prisma from "@/utils/client";
import {z} from "zod";
import * as argon2 from "argon2";
import {APIErrorResponse} from '@/utils/APIErrorResponse';
import {StatusCodes} from "http-status-codes";
import {NextRequest, NextResponse} from "next/server";


const Team = z.object({
    teamId: z.number().or(z.string()).transform(Number)
})

type Team = z.infer<typeof Team>;

export async function GET(request: NextRequest,{ params } : { params : {teamId: string } }) {

    const team_to_get: Team = Team.parse(params);

    const team = await prisma.team.findFirst(
        {
            where: {
                teamId: team_to_get.teamId
            }
        }
    )

    if (team === null) {
        return APIErrorResponse.return_error("no such team", StatusCodes.BAD_REQUEST);
    }

    return NextResponse.json(team);
}