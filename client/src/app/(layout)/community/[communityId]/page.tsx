'use client'
import * as React from "react";
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import {Community as CommunityType} from "@prisma/client";
import {User} from "@prisma/client";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {useRouter} from "next/navigation";
import styles from "@/app/(layout)/layout.module.css";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import {GameQueried} from "@/types/game";

interface Users {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
    communtiyId: number
}

interface AktCommunityQueried {
    communityId: number
    communityname: string,
}


interface CommunityQuerried {
    communityId: number
    community: CommunityType,
}


interface UserQuerried {
    userId: number
    user: User
}


export default function Community({params}: { params: { communityId: string } }) {

    const [error, setError] = useState<string | null>(null);
    const [isPartOfCommunity, setIsPartOfCommunity] = useState<boolean>(false);
    const [communityName, setCommunityName] = useState<string>("loading");
    const [joinedUser, setJoinedUser] = useState<UserQuerried[]>([]);
    const [usersCommunities, setUsersCommunities] = useState<CommunityQuerried[]>([]);
    const [users, setUsers] = useState<Users[]>([]);
    const[fromTop, setFromTop] = useState<Users[]>([]);
    const[fromBottom, setFromBottom] = useState<Users[]>([]);
    const[middleFriends, setmiddleFriends] = useState<Users[]>([]);
    const[aktLength, setAktLength] = useState<number>(0);
    const[countFromTop, setCountFromTop] = useState<number>(0);
    const[countFromBottom, setCountFromBottom] = useState<number>(0);
    const router = useRouter()
    const[searchInput, setSearchInput] = useState<string>("");
    const[showOne, setShowOne] = useState<boolean>(false);

    useEffect(() => {
        const getInitial = async () => {
            const communityRes = await fetch(`/api/community/${Number(params.communityId)}`)


            const community: AktCommunityQueried = await communityRes.json();

            if (community === null) {
                router.push("/noCommunity")
                return
            } else {
                setCommunityName(community.communityname)
            }


            const joinedUsers = await fetch(`/api/joinedUsers/${Number(params.communityId)}`)
            const userList: UserQuerried[] = await joinedUsers.json()

            setJoinedUser(userList)

            const token = getCookie('userData');
            if (token === null || token === undefined) {
                setError("token is null")
                return
            }
            const id = token.split(":")[2].split("}")[0]

            if (userList.some(el => el.userId === Number(id))) {
                setIsPartOfCommunity(true);
            }

            const userComms = await fetch(`/api/joinedCommunities/${Number(id)}`)

            const userCommsList: CommunityQuerried[] = await userComms.json();
            if(userCommsList !== null){
                setUsersCommunities(userCommsList)
            }

            const tableUsers = await fetch(`/api/initialCommunityTable/${community.communityId}`);

            if (tableUsers !== null && tableUsers.body !== null) {
                const users_as_json: Users[] = await tableUsers.json();
                setUsers(users_as_json)
                setAktLength(users_as_json.length)

                if(users_as_json.length < userList.length){
                    setFromTop(users_as_json.slice(0,3))
                    setmiddleFriends(users_as_json.slice(3, users_as_json.length - 1))
                    setFromBottom(users_as_json.slice(users_as_json.length - 1, users_as_json.length))
                }
                else{
                    setFromTop(users_as_json)
                }
            }


        }
        getInitial()

    }, [])

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
        const getJoinedUsers = async () => {
            const userRes = await fetch(`/api/communitycount/${Number(params.communityId)}`)

            const count_users_before = await userRes.json();


                const id = setInterval(async () => {
                    const newFetch = await fetch(`/api/communitycount/${Number(params.communityId)}`)
                    const count_users_after = await newFetch.json();

                    if(count_users_after !== count_users_before){
                        window.location.reload();
                    }


                }, 5000);

                return () => clearInterval(id);
        }
        getJoinedUsers()
    }, []);

    const getRows = async () => {
        const tableUsers = await fetch(`/api/initialCommunityTable/${Number(params.communityId)}`);

        if (tableUsers !== null && tableUsers.body !== null) {
            const users_as_json: Users[] = await tableUsers.json();
            setUsers(users_as_json)
            setAktLength(users_as_json.length)

            if(users_as_json.length < joinedUser.length){
                setFromTop(users_as_json.slice(0,3))
                setmiddleFriends(users_as_json.slice(3, users_as_json.length - 1))
                setFromBottom(users_as_json.slice(users_as_json.length - 1, users_as_json.length))
            }
            else{
                setFromTop(users_as_json)
            }
        }

        setShowOne(false)
    }

    const joinCommunity = async () => {
        if(usersCommunities !== null && usersCommunities !== undefined && usersCommunities.length >=5) {
            setError("sorry you cant join this Community. You have reached the maximal number if communities (5)")
            return
        }
        const response = await fetch('/api/join',
            {
                method: "POST",
                body: JSON.stringify({
                    communityId: Number(params.communityId)
                }),
            })

        if (!response.ok) {
            setError("Something went wrong. Please try again later");
            return
        }
        setError(null)
        setIsPartOfCommunity(true);

    }

    const unjoinCommunity = async () => {
        const response = await fetch('/api/unjoin',
            {
                method: "POST",
                body: JSON.stringify({
                    communityId: Number(params.communityId)
                }),
            })
        if (!response.ok) {
            setError("Something went wrong. Please try again later");
            return
        }
        setError(null)
        setIsPartOfCommunity(false);

    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const loadMoreFromTop = async () => {
        const response = await fetch(`/api/tenFromTop/${Number(params.communityId)}?offset=${countFromTop}`)

        if(!response.ok){
            return
        }

        setCountFromTop(countFromTop+1)
        const userList: Users[] = await response.json()



        const newTop = fromTop.concat(userList)
        setFromTop(newTop)

        const newMiddle = middleFriends.filter( (user) => {return (newTop.findIndex(e => e.userId === user.userId)) < 0;})
        setmiddleFriends(newMiddle)

        const newBottom = fromBottom.filter( (user) => {return (newTop.findIndex(e => e.userId === user.userId)) < 0;})
        setFromBottom(newBottom)

        setAktLength(newTop.length + newMiddle.length + newBottom.length)

    }

    const handleClickUser = async (id: number) => {
        router.push("/user/" + id);
    }


    const loadMoreFromBottom = async () => {
        const response = await fetch(`/api/tenFromBottom/${Number(params.communityId)}?offset=${countFromBottom}`)

        if(!response.ok){
            return
        }

        setCountFromBottom(countFromTop+1)
        const userList: Users[] = await response.json()



        const newBottom = userList.concat(fromBottom)
        setFromBottom(newBottom)

        const newMiddle = middleFriends.filter( (user) => {return (newBottom.findIndex(e => e.userId === user.userId)) < 0;})
        setmiddleFriends(newMiddle)

        const newTop = fromTop.filter( (user) => {return (newBottom.findIndex(e => e.userId === user.userId)) < 0;})
        setFromTop(newTop)

        setAktLength(newTop.length + newMiddle.length + newBottom.length)

    }

    const handleClickSearch = async () => {

        if(searchInput === ""){
            getRows()
        }
        else{
        const response = await fetch(`/api/searchedRankedUser/${Number(params.communityId)}?username=${searchInput}`)


        const user: Users[] = await response.json()

        setCountFromTop(0)
        setCountFromBottom(0)
        setFromTop([])
        setFromBottom([])
        setmiddleFriends([])

        if (user === null || user === undefined) {

        } else {
            setShowOne(true)
            setFromTop(user)
        }
    }}


    return (
        <>
            <div style={{margin: "50px"}}>
                <Grid container>
                    <Grid item xs={4} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div>
                            <Diversity3Icon sx={{height: '150px', width: '150px', borderRadius: '50%'}}
                                            style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}/>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{
                            margin: "10px",
                            marginTop: "30px",
                            display: "flex",
                            gap: "15px",
                            flexDirection: "column"
                        }}>
                            <b style={{fontSize: "20px", color: "#053773"}}>{communityName}</b>
                            <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                        sx={{color: "#053773"}}
                                    >
                                        {joinedUser.length} Joined Users
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}>
                                        {joinedUser.map(user =>
                                            <MenuItem onClick={handleClose} key={user.userId}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    width: "100px"
                                                }}>
                                                    <PersonIcon sx={{borderRadius: '50%'}}
                                                                style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}/>
                                                    <p>{user.user.username}</p>
                                                </div>
                                            </MenuItem>)}

                                    </Menu>
                                </div>
                            </div>
                            {!isPartOfCommunity &&
                                <Button style={{width: "150px"}} color="secondary" size={"small"} variant="contained"
                                        onClick={() => joinCommunity()}>Join Community</Button>
                            }
                            {isPartOfCommunity &&
                                <Button style={{width: "150px"}} color="secondary" size={"small"} variant="contained"
                                        onClick={() => unjoinCommunity()}>Leave Community</Button>
                            }
                            <p style={{color: "red", fontSize: "12px"}}>{error}</p>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{height: "40px", backgroundColor: "#074085"}}></div>

            <div style={{width: "80%", margin:"20px"}}>
            <div style={{
                height: "50px",
                backgroundColor: "#074085",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <p style={{color: "white", marginLeft: "10px"}}> {communityName}</p>
                <Paper
                    sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 200, backgroundColor: '#074085'}}
                    className={styles.searchinput}>
                    <InputBase
                        sx={{ml: 1, flex: 1, color: 'white', input: { color: 'white' }, placeholder:{color: "white"}}}
                        placeholder="Search User... "
                        style={{color: "#053773"}}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <IconButton onClick={() => handleClickSearch()} sx={{p: '10px'}} className={styles.searchbutton}>
                        <SearchIcon className={styles.searchicon}/>
                    </IconButton>
                </Paper>
            </div>

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
                            {fromTop.map((user) => (
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

                            <TableRow style={{ display: (showOne || aktLength === joinedUser.length) ? "none" : "table-row" }} >
                                <TableCell align="right"> </TableCell >
                                <TableCell align="right" > <Button onClick={loadMoreFromTop}>load more users</Button></TableCell>
                                <TableCell align="right"> </TableCell>
                            </TableRow>
                            {middleFriends.map((user) => (
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

                            <TableRow style={{ display: (showOne || aktLength === joinedUser.length) ? "none" : "table-row" }} >
                                <TableCell align="right"> </TableCell >
                                <TableCell align="right" > <Button onClick={loadMoreFromBottom} >load more users</Button></TableCell>
                                <TableCell align="right"> </TableCell>
                            </TableRow>

                            {fromBottom.map((user) => (
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

            </div>

        </>
    );
}
