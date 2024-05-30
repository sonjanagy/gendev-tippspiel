'use client';
import styles from "./login.module.css"
import HttpsIcon from '@mui/icons-material/Https';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {YellowTextfield} from "@/components/YellowTextfield";
import prisma from "@/utils/client";
import Link from "next/link";
import {useRef, useState} from "react";
import {set} from "zod";
import * as argon2 from "argon2";
import {StatusCodes} from "http-status-codes";
import {useRouter} from 'next/navigation'




export default function Page ()  {

    const [error, setError] = useState<string | null>();
    const [username, setUsername] = useState<String>("");
    const [password, setPassword] = useState<String>("");
    const router = useRouter()

    const handleClick = async () => {
        if (username === "" && password === "") {
            setError("Username and Password is required");
            return;
        }

        if (username === "") {
            setError("Username is required");
            return;
        }
        if (password === "") {
            setError("Password is required");
            return;
        }

        const response = await fetch('/api/login',
            {
                method: "POST",
                body: JSON.stringify({
                        username: username,
                        password: password,
                }),
            })
        if (!response.ok) {
            if (response.status === StatusCodes.BAD_REQUEST) {
                setError("Username or Password worng");
            }
            if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
                setError("Something went wrong. Please try again later");
            }
            return;
        }
        router.push("/dashboard");

    }

    return (
        <Box display="flex" flexDirection="row">
            <div className={styles.hell}/>
            <div className={styles.dunkel}>
                <HttpsIcon style={{color: "#FFBB1B", fontSize: "40px"}}></HttpsIcon>
                <p style={{color: "white", fontSize: "30px"}}>Log in</p>
                <YellowTextfield label="Username" name="usernmae" variant="outlined" size="small" defaultValue=""
                                 onChange={(e => {setUsername(e.target.value)})} />
                <YellowTextfield type="password" label="Password" name="password" variant="outlined" size="small"
                                 defaultValue="" onChange={(e => {setPassword(e.target.value)})}/>
                <p style={{color: "red"}}>{error}</p>
                <Box display="flex" gap={2}>
                    <Button autoFocus color="secondary" variant="contained" onClick={() => handleClick()}>Log in</Button>
                    <Link href={"/register"}><Button color="secondary" variant="outlined">Register</Button></Link>
                </Box>
            </div>
        </Box>
    );
}