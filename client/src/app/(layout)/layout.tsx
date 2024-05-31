'use client'
import {ReactNode, useEffect, useState} from "react";
import styles from "./layout.module.css"
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import {color} from "@mui/system";
import {Button, TextField} from "@mui/material";
import Avatar from '@mui/material/Avatar';
import {CommunitiesNavigation} from "@/components/CommunitiesNavigation";
import {getCookie} from "cookies-next";
import {useRouter} from 'next/navigation'
import {CreateCommunity} from "@/components/createCommunityBox";

interface UserQueried {
    userId: number
    username: string,
    email: string,
}

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {

    const [user, setUser] = useState<UserQueried>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter()
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {

        const getLoggedinUser = async () => {
            const token = getCookie('userData');
            if (token === null || token === undefined) {
                return
            }
            const id = token.split(":")[2].split("}")[0]


            const userRes = await fetch(`/api/user/${Number(id)}`)


            const user: UserQueried = await userRes.json();

            setUser(user)

            if(user.username === "admin"){
                setIsAdmin(true)
            }
        }
        getLoggedinUser();
    },[])

    const getUsername = () => {
        if(user === null || user === undefined) {
            return "loading..."
        }
        else{
            return user.username
        }
    }

    const handleClickBets = () => {
        router.push("/bets");
    }

    const handleClickAdmin = () => {
        router.push("/admin");
    }

    const handleClickDashboard = () => {
        router.push("/dashboard");
    }

    const handleClickSearch = async () => {

        const userRes = await fetch(`/api/userUsername/${searchInput}`)

        const user: UserQueried = await userRes.json();

        if(user === null || user === undefined) {
            router.push("/noUser");
        }
        else{
            router.push("/user/" + user.userId);
        }



    }

    return (
        <>
            <header className={styles.headerbar}>
                <div className={styles.headersearchbar}>
                    <div className={styles.searchbar}>
                        <Paper
                            sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 400}}
                            className={styles.searchinput}>
                            <InputBase
                                sx={{ml: 1, flex: 1}}
                                placeholder="Search User... "
                                style={{color: "#053773"}}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <IconButton onClick={() => handleClickSearch()} sx={{p: '10px'}} className={styles.searchbutton}>
                                <SearchIcon className={styles.searchicon}/>
                            </IconButton>
                        </Paper>
                    </div>
                    <div className={styles.profilebar}>
                        <p style={{color: "#ffffff"}}> {getUsername()} </p>
                            <Avatar src="/broken-image.jpg" style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}/>
                    </div>
                </div>
                <div className={styles.headerspacingbar} >
                    <Button onClick={() => handleClickBets()} sx={{color: "white"}}>to my bets</Button>
                    <Button onClick={() => handleClickDashboard()} sx={{color: "white"}}> to dashboard</Button>
                    {isAdmin && <Button onClick={() => handleClickAdmin()} sx={{color: "white"}}>to admin Page</Button>}
                </div>
            </header>
            <nav className={styles.navbar}  style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <CommunitiesNavigation></CommunitiesNavigation>
                <CreateCommunity></CreateCommunity>
            </nav>

            <div className={styles.mainbar}>
                {children}
            </div>
        </>
    );
}
