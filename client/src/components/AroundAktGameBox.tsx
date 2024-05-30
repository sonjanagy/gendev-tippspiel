'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import {GameBoxAdmin} from "@/components/GameBoxAdmin/GameBoxAdmin";
import {RegisterGame} from "@/components/RegisterGame";
import {GameWithDates, GameQueried, TeamQueried} from "@/types/game";
import {TippBox} from "@/components/TippBox";
import {AktGameBox} from "@/components/AktGameBox";


export default function AroundAktGameBox() {

    const [games, setGames] = useState<GameWithDates[]>([]);
    const [endResult, setEndResult] = useState<GameWithDates[][]>([]);

    useEffect(() => {
        const getGames = async () => {
            const response = await fetch('/api/games');

            if (response !== null && response.body !== null) {
                const games_as_json: GameQueried[] = await response.json();

                setGames(games_as_json.map(prev => ( {
                    ...prev,
                    "startTime": new Date(prev.startTime),
                    "date": new Date(prev.date),
                    "updatedAt": new Date(prev.updatedAt),
                    "createdAt": new Date(prev.createdAt),
                    "beginStart":  new Date(prev.beginStart),
                    "beginStop":  new Date(prev.beginStop),
                })).filter((a) =>  a.date.getDate() === new Date().getDate() && a.date.getMonth() === new Date().getMonth() && a.date.getFullYear() === new Date().getFullYear() ));


            }
        }
        getGames();

    }, []);



    return (
        <>
            <div style={{display: 'flex', alignContent: 'center', flexDirection: 'column'}}>
                    <div style={{ backgroundColor: "#E9E9E9", padding: "10px", margin: "10px"}}>
                        <b style={{color: "#0171C2"}}> {(new Date()).toDateString()} </b>
                        <div style={{display: 'flex', flexDirection: 'row', flexFlow: 'row wrap'}}>
                            {games.map(results =><AktGameBox key={results.gameId} {...results} />)}
                        </div>
                    </div>
            </div>

        </>
    );
}
