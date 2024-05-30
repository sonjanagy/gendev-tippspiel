"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {color} from "@mui/system";
import {Button} from "@mui/material";



interface Users {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
}



export const RankingDashboardCommunity = ({communityId}: {communityId: number}) => {

    const [users, setUsers] = useState<Users[]>([]);
    const router = useRouter()

    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch(`/api/previewCommunity/${communityId}`);

            if (response !== null && response.body !== null) {
                const users_as_json: Users[] = await response.json();
                setUsers(users_as_json);


            }
        }
        getUsers()

    }, []);

    const handleClickUser = async (id: number) => {
        router.push("/user/" + id);
    }


    return(
        <TableContainer component={Paper} style={{width: '100%'}}>
            <Table sx={{ minWidth: 40 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>rank</TableCell>
                        <TableCell align="right">username</TableCell>
                        <TableCell align="right">total Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.userId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {user.rank}
                            </TableCell>
                            <TableCell align="right"><Button onClick={() => handleClickUser(user.userId)} sx={{color:"black", textTransform: 'none'}} variant="text">{user.username}</Button></TableCell>
                            <TableCell align="right">{user.totalPoints}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}