'use client'
import * as React from 'react';
import {useEffect, useState} from "react";
import {GameBoxAdmin} from "@/components/GameBoxAdmin/GameBoxAdmin";
import {RegisterGame} from "@/components/RegisterGame";
import {GameWithDates, GameQueried, TeamQueried} from "@/types/game";
import {sort} from "next/dist/build/webpack/loaders/css-loader/src/utils";


export default function Page() {

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
                })));
            }
        }
        getGames();

    }, []);

    useEffect(() => {
        const getTodaysGames = async () => {
            const response = await fetch('/api/gamesToday');

            if (response !== null && response.body !== null) {
                const games_as_json: GameQueried[] = await response.json();

                const lastUpdated = games_as_json.map(prev => ( {
                    "gameId": prev.gameId,
                    "updatedAt": new Date(prev.updatedAt)
                }))

                const id = setInterval(async () => {
                    const newFetch = await fetch('/api/gamesToday');
                    const new_games_as_json: GameQueried[] = await newFetch.json();
                    const new_lastUpdated = new_games_as_json.map(prev => ( {
                        "gameId": prev.gameId,
                        "updatedAt": new Date(prev.updatedAt)
                    }))

                    if(JSON.stringify(new_lastUpdated) !== JSON.stringify(lastUpdated)){
                        window.location.reload();
                    }


                }, 5000);

                return () => clearInterval(id);
            }



        }
        getTodaysGames()
    }, []);

    useEffect(() => {
        let resulttemp = [];
        const result = [];

        const sorted = games.sort((a,b) => a.date.getMonth() - b.date.getMonth() || a.date.getDate() - b.date.getDate() || a.startTime.getTime() - b.startTime.getTime() );

        console.log(sorted)

            for (let i = 0; i < sorted.length; i++) {

                if (i === 0 && sorted.length>1) {
                    resulttemp.push(sorted[i]);
                }
                else if(i === sorted.length-1){
                    resulttemp.push(sorted[i]);
                    result.push(resulttemp);
                }
                else {
                    const prev = sorted[i - 1];
                    const akt = sorted[i];
                    if (prev.date.getDate() === akt.date.getDate() && prev.date.getMonth() === akt.date.getMonth() && prev.date.getFullYear() === akt.date.getFullYear()) {
                        resulttemp.push(akt);
                    } else {
                        result.push(resulttemp);
                        resulttemp = [];
                        resulttemp.push(akt);
                    }
                }
            }

            console.log(result)

        setEndResult(result);

    }, [games])


    return (
        <>
            <RegisterGame></RegisterGame>
            <div style={{display: 'flex', alignContent: 'center', flexDirection: 'column'}}>
                {endResult.filter((a) =>  a[0].date > new Date() || a[0].date.getDate() === new Date().getDate()).map(resultlist =>
                        <div key={resultlist[0].date.toLocaleTimeString()}
                            style={{ backgroundColor: "#E9E9E9", padding: "10px", margin: "10px" , justifyContent: 'center'}}>
                            <b style={{color: "#0171C2", width: "100%"}}> {resultlist[0].date.toDateString()} </b>
                            <div style={{display: 'flex', flexDirection: 'row', flexFlow: 'row wrap',
                                justifyContent: "space-between"}}>
                                {resultlist.map(game => <GameBoxAdmin key={game.gameId} {...game} />)}
                            </div>
                        </div>
                )}
            </div>
        </>
    );
}
