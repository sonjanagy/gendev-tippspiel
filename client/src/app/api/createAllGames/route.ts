import prisma from "@/utils/client";
import {NextResponse} from "next/server";

export async function POST(request: Request){

    await prisma.game.createMany({
        data: [
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-14T19:00:00"),
                date: new Date("2024-06-14T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Schottland"),
                hometeamId: teamId("Deutschland")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-15T13:00:00"),
                date: new Date("2024-06-15T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Schweiz"),
                hometeamId: teamId("Ungarn")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-15T16:00:00"),
                date: new Date("2024-06-15T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Kroatien"),
                hometeamId: teamId("Spanien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-15T19:00:00"),
                date: new Date("2024-06-15T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Albanien"),
                hometeamId: teamId("Italien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-16T13:00:00"),
                date: new Date("2024-06-16T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Niederlande"),
                hometeamId: teamId("Polen")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-16T16:00:00"),
                date: new Date("2024-06-16T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Dänemark"),
                hometeamId: teamId("Slowenien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-16T19:00:00"),
                date: new Date("2024-06-16T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("England"),
                hometeamId: teamId("Serbien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-17T13:00:00"),
                date: new Date("2024-06-17T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Ukraine"),
                hometeamId: teamId("Rumänien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-17T16:00:00"),
                date: new Date("2024-06-17T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Slowakei"),
                hometeamId: teamId("Belgien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-17T19:00:00"),
                date: new Date("2024-06-17T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Frankreich"),
                hometeamId: teamId("Österreich")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-18T16:00:00"),
                date: new Date("2024-06-18T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Georgien"),
                hometeamId: teamId("Türkei")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-18T19:00:00"),
                date: new Date("2024-06-18T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Tschechische Republik"),
                hometeamId: teamId("Portugal")
            },

            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-19T13:00:00"),
                date: new Date("2024-06-19T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Albanien"),
                hometeamId: teamId("Kroatien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-19T16:00:00"),
                date: new Date("2024-06-19T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Ungarn"),
                hometeamId: teamId("Deutschland")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-19T19:00:00"),
                date: new Date("2024-06-19T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Schweiz"),
                hometeamId: teamId("Schottland")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-20T13:00:00"),
                date: new Date("2024-06-20T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Serbien"),
                hometeamId: teamId("Slowenien")
            },

            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-20T16:00:00"),
                date: new Date("2024-06-20T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("England"),
                hometeamId: teamId("Dänemark")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-20T19:00:00"),
                date: new Date("2024-06-20T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Italien"),
                hometeamId: teamId("Spanien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-21T13:00:00"),
                date: new Date("2024-06-21T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Ukraine"),
                hometeamId: teamId("Slowakei")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-21T16:00:00"),
                date: new Date("2024-06-21T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Österreich"),
                hometeamId: teamId("Polen")
            },

            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-21T19:00:00"),
                date: new Date("2024-06-21T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Frankreich"),
                hometeamId: teamId("Niederlande")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-22T13:00:00"),
                date: new Date("2024-06-22T13:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Tschechische Republik"),
                hometeamId: teamId("Georgien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-22T16:00:00"),
                date: new Date("2024-06-22T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Portugal"),
                hometeamId: teamId("Türkei")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-22T19:00:00"),
                date: new Date("2024-06-22T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Rumänien"),
                hometeamId: teamId("Belgien")
            },

            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-23T19:00:00"),
                date: new Date("2024-06-23T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Ungarn"),
                hometeamId: teamId("Schottland")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-23T19:00:00"),
                date: new Date("2024-06-23T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Deutschland"),
                hometeamId: teamId("Schweiz")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-24T19:00:00"),
                date: new Date("2024-06-24T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Spanien"),
                hometeamId: teamId("Albanien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-24T19:00:00"),
                date: new Date("2024-06-24T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Italien"),
                hometeamId: teamId("Kroatien")
            },

            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-25T16:00:00"),
                date: new Date("2024-06-25T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Österreich"),
                hometeamId: teamId("Niederlande")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-25T16:00:00"),
                date: new Date("2024-06-25T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Polen"),
                hometeamId: teamId("Frankreich")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-25T19:00:00"),
                date: new Date("2024-06-25T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Slowenien"),
                hometeamId: teamId("England")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-25T19:00:00"),
                date: new Date("2024-06-25T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Serbien"),
                hometeamId: teamId("Dänemark")
            },

            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-26T16:00:00"),
                date: new Date("2024-06-26T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Rumänien"),
                hometeamId: teamId("Slowakei")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-26T16:00:00"),
                date: new Date("2024-06-26T16:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Belgien"),
                hometeamId: teamId("Ukraine")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-26T19:00:00"),
                date: new Date("2024-06-26T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Portugal"),
                hometeamId: teamId("Georgien")
            },
            {
                scoreHometeam: 0,
                scoreAwayteam: 0,
                startTime: new Date("2024-06-26T19:00:00"),
                date: new Date("2024-06-26T19:00:00"),
                beginStart: null,
                beginStop: null,
                state: "STOP",
                phase: null,
                updatedAt: new Date(),
                awayteamId: teamId("Türkei"),
                hometeamId: teamId("Tschechische Republik")
            }
        ]
    });
    return NextResponse.json("Games were inserted successfully.");
    }


function teamId(country:string) {
    switch (country) {
        case "Deutschland": return 1;
        case "Belgien": return 2;
        case "Frankreich": return 3;
        case "Portugal": return 4;
        case "Schottland": return 5;
        case "Spanien": return 6;
        case "Türkei": return 7;
        case "Österreich": return 8;
        case "England": return 9;
        case "Ungarn": return 10;
        case "Slowakei": return 11;
        case "Albanien": return 12;
        case "Dänemark": return 13;
        case "Niederlande": return 14;
        case "Schweiz": return 15;
        case "Rumänien": return 16;
        case "Serbien": return 17;
        case "Italien": return 18;
        case "Tschechische Republik": return 19;
        case "Slowenien": return 20;
        case "Kroatien": return 21;
        case "Georgien": return 22;
        case "Ukraine": return 23;
        case "Polen": return 24;
        default: return -1;
    }
}
