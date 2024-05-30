"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import {useRouter} from "next/navigation";



interface Users {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
}



export const RankingDashboardAll = ({users}: {users: Users[]}) => {

    const router = useRouter()

    const handleClickUser = async (id: number) => {
        router.push("/user/" + id);
    }

    return(
        <TableContainer component={Paper} style={{width: '100%'/*, margin: "20px"*/ }}>
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
                            <TableCell align="right"> <Button onClick={() => handleClickUser(user.userId)} sx={{color:"black", textTransform: 'none'}} variant="text">{user.username}</Button></TableCell>
                            <TableCell align="right">{user.totalPoints}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}