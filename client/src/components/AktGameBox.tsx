import * as React from 'react';
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

interface GameQueried {
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
}

interface BettQueried {
    userId: number
    gameId: number,
    scoreHometeam: number,
    scoreAwayteam: number,
}

interface TeamQueried {
    teamId: number,
    country: string,
    flag: string
}



export const AktGameBox = (props: GameQueried) => {


    const {gameId, scoreHometeam, scoreAwayteam, date, startTime, phase, state, hometeamId, awayteamId, beginStart} = props;
    const [homeTeam, setHomeTeam] = useState<TeamQueried|null>(null);
    const [awayTeam, setAwayTeam] = useState<TeamQueried|null>(null);
    const [scoreHometeamBet, setScoreHometeamBet] = useState<String | null>(null);
    const [scoreAwayteamBet, setScoreAwayteamBet] = useState<String | null>(null);
    const [error, setError] = useState<string | null>();
    const [succcess, setSuccsess] = useState<string | null>();
    const [displayedTime, setDisplayedTime] = useState<string>("start");

    useEffect(() => {
        const getTeam = async () => {
            const homeTeam = await fetch(`/api/team/${hometeamId}`)

            if (homeTeam !== null) {
                const team_as_json: TeamQueried = await homeTeam.json();
                setHomeTeam(team_as_json);
            }

            const awayTeam = await fetch(`/api/team/${awayteamId}`)

            if (awayTeam !== null) {
                const team_as_json: TeamQueried = await awayTeam.json();
                setAwayTeam(team_as_json);
            }

            if(state==="STOP" && phase === null){
                setDisplayedTime(startTime.toLocaleTimeString())
            }
            else{
                switch(state) {
                    case "HALFTIME": {
                        setDisplayedTime("HALFTIME")
                        break;
                    }
                    case "INTERRUPT": {
                        setDisplayedTime("INTERRUPT")
                        break;
                    }
                    case "END": {
                        setDisplayedTime("END")
                        break;
                    }
                    default: {

                        switch(phase) {
                            case "FIRST": {

                                const time = new Date().getTime() - beginStart.getTime();
                                const totalSeconds = Math.floor(time / 1000);
                                const totalMinutes = Math.floor(totalSeconds / 60);
                                const totalHours = Math.floor(totalMinutes / 60);
                                console.log(Math.round((time / 1000) / 60))

                                const res = totalHours * 60 + totalMinutes;
                                setDisplayedTime(res.toString())
                                break;
                            }
                            case "SECOND": {
                                const time = new Date().getTime() - beginStart.getTime();
                                const totalSeconds = Math.floor(time / 1000);
                                const totalMinutes = Math.floor(totalSeconds / 60);
                                const totalHours = Math.floor(totalMinutes / 60);
                                console.log(Math.round((time / 1000) / 60))

                                const res = 45 + totalHours * 60 + totalMinutes;
                                setDisplayedTime(res.toString())
                                break;
                            }
                            case "OVERTIMEFIRST": {
                                const time = new Date().getTime() - beginStart.getTime();
                                const totalSeconds = Math.floor(time / 1000);
                                const totalMinutes = Math.floor(totalSeconds / 60);
                                const totalHours = Math.floor(totalMinutes / 60);
                                console.log(Math.round((time / 1000) / 60))

                                const res = 90 + totalHours * 60 + totalMinutes;
                                setDisplayedTime(res.toString())
                                break;
                            }
                            case "OVERTIMESECOND": {
                                const time = new Date().getTime() - beginStart.getTime();
                                const totalSeconds = Math.floor(time / 1000);
                                const totalMinutes = Math.floor(totalSeconds / 60);
                                const totalHours = Math.floor(totalMinutes / 60);
                                console.log(Math.round((time / 1000) / 60))

                                const res = 105 + totalHours * 60 + totalMinutes;
                                setDisplayedTime(res.toString())
                                break;
                            }
                            case "PENALTY": {
                                console.log(
                                    "hier"
                                )
                                setDisplayedTime("Penalty")
                                break;
                            }
                            default: {
                                console.log("_________")
                                setDisplayedTime("errorrrr")
                                break;
                            }
                        }

                        break;
                    }
                }
            }

        }
        getTeam();
        console.log(displayedTime);
    },[])

    useEffect(() => {
        const getInitial = async () => {
            const score = await fetch(`/api/betScore/${gameId}`)
            const bet: BettQueried = await score.json();

            if (bet === null) {
                setScoreHometeamBet(null)
                setScoreAwayteamBet(null)
            } else {
                setScoreHometeamBet(String(bet.scoreHometeam))
                setScoreAwayteamBet(String(bet.scoreAwayteam))
            }
        }
        getInitial()

    }, [])



    return <div style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#D9D9D9",
        gap: "10px",
        margin: "10px",
        padding: "12px",
        width: "31%"
    }}>
        <div style={{display: "flex", gap: "0", flexDirection: "column", alignItems: "center"}}>
            <p style={{color: "#0171C2", fontSize: '10px'}}> {displayedTime} </p>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}>{homeTeam?.flag}</Avatar>
                <p>{scoreHometeam || 0} : {scoreAwayteam||0}</p>
                <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}>{awayTeam?.flag}</Avatar>
            </Box>
            <p style={{color: "#0171C2", fontSize: '10px'}}> ( {scoreHometeamBet || "-"} : {scoreAwayteamBet||"-"} )</p>
        </div>


    </div>
}
