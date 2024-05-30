import * as React from 'react';
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {Team} from "@prisma/client";

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
    hometeam: Team,
    awayteam: Team
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



export const TippBox = (props: GameQueried) => {


    const {gameId, scoreHometeam, scoreAwayteam, date, startTime, phase, state, hometeamId, awayteamId, hometeam, awayteam} = props;
    const [scoreHometeamBet, setScoreHometeamBet] = useState<String | null>(null);
    const [scoreAwayteamBet, setScoreAwayteamBet] = useState<String | null>(null);
    const [error, setError] = useState<string | null>();
    const [succcess, setSuccsess] = useState<string | null>();
    

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


    const changeHometeamScore = async (score: string) => {
        if (score === "" || isNaN(Number(score))) {
            setScoreHometeamBet(null);
        } else {
            setScoreHometeamBet(score);
        }
    }

    const changeAwayteamScore = (score: string) => {
        if (score === "" || isNaN(Number(score))) {
            setScoreAwayteamBet(null);
        } else {
            setScoreAwayteamBet(score);
        }
    }

    const updateBet = async () => {
        if (scoreHometeamBet === null || scoreAwayteamBet === null) {
            setError("Please enter a valid score");
            return
        }
        if(Number.isNaN(Number(scoreHometeamBet)) || Number.isNaN(Number(scoreAwayteamBet))) {
            setError("Please enter a valid score");
            return
        }

        if(date.getDate() <= new Date().getDate() && date.getMonth() <= new Date().getMonth()  && startTime.getHours() <= new Date().getHours() && startTime.getMinutes() <= new Date().getMinutes() && date.getFullYear() <= new Date().getFullYear()) {
            setError("Sorry, you can't change your bet. The game already started")
            return
        }

        setError(null);
        const response = await fetch('/api/bet',
            {
                method: "POST",
                body: JSON.stringify({
                    gameId: gameId,
                    scoreHometeam: Number(scoreHometeamBet),
                    scoreAwayTeam: Number(scoreAwayteamBet),
                }),
            })
        if (!response.ok) {
            setError("Something went wrong. Please try again later");
            return
        }
        setSuccsess("bet was saved successfully!")
    }


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
        <p style={{color: "#0171C2", fontSize: 'small'}}> {startTime.toLocaleTimeString()} </p>
        <Box display={"flex"} alignItems="center" justifyContent="center" flexDirection="column" gap={1}>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}>{hometeam.flag}</Avatar>
                <TextField style={{color: "white"}} fullWidth size="small" label={hometeam.country} variant="outlined"
                           value={scoreHometeamBet || ""}
                           onChange={(e => {
                               changeHometeamScore(e.target.value)
                           })}>{hometeam.country}</TextField>
                <b style={{color: "#0171C2"}}>:</b>
                <TextField fullWidth size="small" label={awayteam.country} variant="outlined" value={scoreAwayteamBet || ""}
                           onChange={(e => {
                               changeAwayteamScore(e.target.value)
                           })}>{awayteam.country}</TextField>
                <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}>{awayteam.flag}</Avatar>

            </Box>
            <p style={{color: "#f44336", fontSize: "12px"}}>{error}</p>
            <p style={{color: "#376e37", fontSize: "12px"}}>{succcess}</p>
            <Button color="secondary" size={"small"} variant="contained" onClick={() => updateBet()}>Save Bet</Button>
        </Box>

    </div>
}
