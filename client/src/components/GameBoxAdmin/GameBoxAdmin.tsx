import * as React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "./gameBoxAdmin.module.css"
import Avatar from "@mui/material/Avatar";
import {useEffect, useState} from "react";
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

interface TeamQueried {
    teamId: number,
    country: string,
    flag: string
}

export const GameBoxAdmin = (props: GameQueried) => {


    const{gameId, scoreHometeam, scoreAwayteam, date, startTime, hometeam, awayteam, state, beginStart, beginStop, phase} = props;
    const[error, setError] = useState<string>("");
    const [displayedTime, setDisplayedTime] = useState<string>("");

    useEffect(() => {
        const getInitial = () => {
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
                            default: {
                                setDisplayedTime("error")
                                break;
                            }
                        }

                        break;
                    }
                }
            }
        }
        getInitial()
    }, []);

    const handleClickStart = async () => {
        if(state === "HALFTIME" || state === "STOP" || state === "INTERRUPT"){
            const response = await fetch(`/api/start/${gameId}`, {method: "POST"});
            console.log("start executed")
        }
        else{
            setError("sorry start can't be executed at this time")
        }
    }
    const handleClickInterruption = async () => {
        if(state === "RUNNING"){
            const response = await fetch(`/api/interruption/${gameId}`, {method: "POST"});
        }
        else{
            setError("sorry the game must be running to interrupt it")
        }
    }
    const handleClickEndHalf = async () => {
        if(state === "RUNNING"){
            const response = await fetch(`/api/endHalf/${gameId}`, {method: "POST"});
        }
        else{
            setError("sorry the game must be running to end the half")
        }
    }
    const handleClickGoalHome = async () => {
        const response = await fetch(`/api/homeTeamScoreGoal/${gameId}`, {method: "POST"});
    }
    const handleClickGoalAway = async () => {
        const response = await fetch(`/api/awayTeamScoreGoal/${gameId}`, {method: "POST"});
    }
    const handleClickEnd = async () => {
        const response = await fetch(`/api/end/${gameId}`, {method: "POST"});
    }



    return <div className={styles.gameBox}>
        <p style={{color: "#0171C2", fontSize: 'small'}}> {displayedTime}</p>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
            <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}>{hometeam.flag}</Avatar>
            <b style={{color: "#0171C2"}} >{hometeam.country}</b><b style={{color: "#0171C2"}}>{scoreHometeam}</b> <b
            style={{color: "#0171C2"}}>:</b> <b style={{color: "#0171C2"}}>{scoreAwayteam}</b><b
            style={{color: "#0171C2"}}>{awayteam.country}</b>
            <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}>{awayteam.flag}</Avatar>
        </Box>
        <Box padding={2} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}
             gap={2}>
            <Box display="flex" gap={2}>
                <Button onClick={() => handleClickStart()} color="primary" variant="contained">Start</Button>
                <Button onClick={() => handleClickInterruption()} color="primary"
                        variant="contained">Interruption</Button>
                <Button onClick={() => handleClickEndHalf()} color="primary" variant="contained">end of half</Button>
            </Box>
            <Box display="flex" gap={2}>
                <Button onClick={() => handleClickGoalHome()} color="primary"
                        variant="contained">goal {hometeam.country}</Button>
                <Button onClick={() => handleClickGoalAway()} color="primary"
                        variant="contained">goal {awayteam.country}</Button>
                <Button onClick={() => handleClickEnd()} color="primary" variant="contained">end</Button>
            </Box>
            <p style={{color: "red"}}>{error}</p>
        </Box>

    </div>
}


