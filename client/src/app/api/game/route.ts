import {NextResponse} from 'next/server';
import {z} from "zod";
import * as argon2 from "argon2";
import prisma from "@/utils/client";
import {APIErrorResponse} from "@/utils/APIErrorResponse";
import {StatusCodes} from "http-status-codes";

export const dynamic = 'force-dynamic'

const Game = z.object({
    hometeam: z.string(),
    awayteam: z.string(),
    starttime: z.string(),
    date: z.string()
})

type Game = z.infer<typeof Game>;

export async function POST(request: Request) {
    const body = await request.json();
    const game_to_insert: Game = Game.parse(body);

    const awayt = await prisma.team.findFirst(
        {
            where: {
                country: game_to_insert.awayteam,
            }
        }
    )
    if (awayt === null) {
        return APIErrorResponse.return_error("AwayTeam doesn't exist", StatusCodes.BAD_REQUEST);
    }

    const homet = await prisma.team.findFirst(
        {
            where: {
                country: game_to_insert.hometeam,
            }
        }
    )
    if (homet === null) {
        return APIErrorResponse.return_error("HomeTeam doesn't exist", StatusCodes.BAD_REQUEST);
    }

    await prisma.game.create(
        {
            data: {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: game_to_insert.starttime,
                date: game_to_insert.date,
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteam: {
                    connect: {
                        teamId: awayt.teamId,
                    }
                },
                hometeam: {
                    connect: {
                        teamId: homet.teamId,
                    }
                },
            }
        }
    )
    return NextResponse.json("Game was inserted successfully.");
}
