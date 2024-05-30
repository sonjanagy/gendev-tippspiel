'use client';
import styles from "./register.module.css"
import HttpsIcon from '@mui/icons-material/Https';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {YellowTextfield} from "@/components/YellowTextfield";
import Link from "next/link";
import {useState} from "react";
import {StatusCodes} from "http-status-codes";
import {useRouter} from 'next/navigation'


export default function Page() {
    const [error, setError] = useState<string | null>();
    const [username, setUsername] = useState<String>("");
    const [password, setPassword] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [passwordConfirm, setPasswordConfirm] = useState<String>("");
    const router = useRouter()

    const handleClick = async () => {

        if (username === "") {
            setError("Username is required");
            return;
        }
        if (email === "") {
            setError("Email is required");
            return;
        }
        if (password === "") {
            setError("Password is required");
            return;
        }
        if (passwordConfirm === "") {
            setError("Password to confirm is required");
            return;
        }
        if (password !== passwordConfirm) {
            setError("Passwords have to match");
            return;
        }

        const response = await fetch('/api/register',
            {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                }),
            })

        if (!response.ok) {
            if (response.status === StatusCodes.BAD_REQUEST) {
                setError("Username or Email already exists");
            }
            if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
                setError("Something went wrong. Please try again later");
            }
            return; //TODO: is this ok?
        }
        router.push("/login");
    }


    return (
        <Box display="flex" flexDirection="row">
            <div className={styles.hell}/>
            <div className={styles.dunkel}>
                <HttpsIcon style={{color: "#FFBB1B", fontSize: "40px"}}></HttpsIcon>
                <p style={{color: "white", fontSize: "30px"}}>Register</p>
                <p></p>
                <YellowTextfield label="Username" name="usernmame" variant="outlined" size="small" onChange={(e => {
                    setUsername(e.target.value)
                })}/>
                <YellowTextfield label="Email" name="email" variant="outlined" size="small" onChange={(e => {
                    setEmail(e.target.value)
                })}/>
                <YellowTextfield label="Password" type="password" name="password" variant="outlined" size="small"
                                 onChange={(e => {
                                     setPassword(e.target.value)
                                 })}/>
                <YellowTextfield label="Confirm Password" type="password" name="password" variant="outlined"
                                 size="small" onChange={(e => {
                    setPasswordConfirm(e.target.value)
                })}/>
                <p style={{color: "red"}}>{error}</p>
                <Box display="flex" gap={2}>
                    <Button color="secondary" variant="contained" onClick={() => handleClick()}>Register</Button>
                    <Link href={"/login"}><Button color="secondary" variant="outlined">Log in</Button></Link>
                </Box>
            </div>
            <div className={styles.hell}/>
        </Box>
    );
}