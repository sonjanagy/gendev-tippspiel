import {Team} from "@prisma/client";

export interface GameQueried {
    gameId: number,
    scoreHometeam: number,
    scoreAwayteam: number,
    startTime: string,
    date: string,
    beginStart: string,
    beginStop: string,
    state: string,
    phase: string,
    updatedAt: string,
    createdAt: string,
    hometeamId: number,
    awayteamId: number,
    hometeam: Team,
    awayteam: Team
}

export interface GameWithDates {
    gameId: number,
    scoreHometeam: number,
    scoreAwayteam: number,
    startTime: Date,
    date: Date,
    beginStart: Date,
    beginStop: Date,
    state: string,
    phase: string,
    updatedAt: Date,
    createdAt: Date,
    hometeamId: number,
    awayteamId: number,
    hometeam: Team,
    awayteam: Team
}

export interface TeamQueried {
    teamId: number,
    country: string,
    flag: string
}