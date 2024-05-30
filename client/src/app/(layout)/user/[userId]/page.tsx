'use client'
import * as React from "react";
import Grid from '@mui/material/Grid';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import { getCookie } from 'cookies-next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonIcon from '@mui/icons-material/Person';
import {Community} from "@prisma/client";

interface UserQueried {
    userId: number
    username: string,
    email: string,
}

interface FriendQuerried {
    friendOfUserId: number
}

interface CommunityQuerried {
    communityId: number
    community: Community,
}

export default function User({params}: { params: { userId: string } }) {

    const [error, setError] = useState<string | null>(null);
    const [isTheSame, setIsTheSame] = useState<boolean>(true);
    const [isFriend, setIsFriend] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("loading...");
    const [friends, setFriends] = useState<FriendQuerried[]>([]);
    const [communities, setCommunities] = useState<CommunityQuerried[]>([]);



    useEffect(() => {
        const getLoggedinUser = async () => {
            const token = getCookie('userData');
            if (token === null || token === undefined) {
                setError("token is null")
                return
            }
            const id = token.split(":")[2].split("}")[0]

            if(Number(id) === Number(params.userId)){
                setIsTheSame(true)
            }
            else{
                setIsTheSame(false)
            }

            const userRes = await fetch(`/api/user/${Number(params.userId)}`)


            const user: UserQueried = await userRes.json();

            if (user === null) {
                //todo hier einfügen zu usergibtesnicht seite
            } else {
                setUserName(user.username)
            }

            const loggedinfriends = await fetch(`/api/pinnedFriends/${Number(id)}`)

            const loggedinFriendsList : FriendQuerried[] = await loggedinfriends.json()

            if(loggedinFriendsList === null){
                setIsFriend(false);
            }
            else {
                if (loggedinFriendsList.some(el => el.friendOfUserId === Number(params.userId))) {
                    setIsFriend(true);
                } else {
                    setIsFriend(false);
                }
            }

            const searchedFriends = await fetch(`/api/pinnedFriends/${Number(params.userId)}`)

            const searchedFriendsList : FriendQuerried[] = await searchedFriends.json()

            if(loggedinFriendsList !== null){
                setFriends(searchedFriendsList);
            }

            const com = await fetch(`/api/joinedCommunities/${Number(params.userId)}`)

            const communitieslist: CommunityQuerried[] = await com.json()


            if(communitieslist !== null){
                setCommunities(communitieslist);
            }

        }
        setError(null)
        getLoggedinUser();
    },[])

    useEffect(() => {
        console.log(communities)
    }, [communities]);


    const pinFriend = async () => {
        const response = await fetch('/api/pinn',
            {
                method: "POST",
                body: JSON.stringify({
                    friendId: Number(params.userId)
                }),
            })

        if (!response.ok) {
            setError("Something went wrong. Please try again later");
            return
        }
        setError(null)
        setIsFriend(true);
    }



    const unpinFriend = async () => {
        const response = await fetch('/api/unpin',
            {
                method: "POST",
                body: JSON.stringify({
                    friendId: Number(params.userId)
                }),
            })
        if (!response.ok) {
            setError("Something went wrong. Please try again later");
            return
        }
        setError(null)
        setIsFriend(false);
    }


    const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
    const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);

    const open1 = Boolean(anchorEl1);
    const open2 = Boolean(anchorEl2);
    const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose1 = () => {
        setAnchorEl1(null);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    return (
        <>
            <div style={{margin: "50px"}}>
                <Grid container>
                    <Grid item xs={4} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div>
                            <Avatar src="/broken-image.jpg" sx={{height: '150px', width: '150px'}}
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
                            <b style={{fontSize: "20px", color: "#053773"}}>{userName}</b>
                            <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open1 ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open1 ? 'true' : undefined}
                                        onClick={handleClick1}
                                        sx={{color:"#053773"}}
                                    >
                                        {communities.length} Joined Communities
                                    </Button>
                                    <Menu

                                        id="basic-menu"
                                        anchorEl={anchorEl1}
                                        open={open1}
                                        onClose={handleClose1}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}>
                                        {communities.map(community =>
                                            <MenuItem onClick={handleClose1} key={community.communityId}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}>
                                                    <Diversity3Icon sx={{ borderRadius: '50%'}}
                                                                    style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}/>
                                                    <p>{community.community.communityname}</p>
                                                </div>
                                            </MenuItem>)}

                                    </Menu>
                                </div>
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open2 ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open2 ? 'true' : undefined}
                                        onClick={handleClick2}
                                        sx={{color:"#053773"}}
                                    >
                                        {friends.length} Pinned Friends
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl2}
                                        open={open2}
                                        onClose={handleClose2}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}>
                                        {friends.map(friend =>
                                            <MenuItem onClick={handleClose2} key={friend.friendOfUserId}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    width: "100px"
                                                }}>

                                                    <PersonIcon sx={{ borderRadius: '50%'}}
                                                                    style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}/>
                                                    <p>{friend.friendOfUserId}</p>
                                                </div>
                                            </MenuItem>)}

                                    </Menu>
                                </div>
                            </div>

                            {!isTheSame && !isFriend &&
                                <Button style={{width: "130px"}} color="secondary" size={"small"} variant="contained"
                                        onClick={() => pinFriend()}>Pin User</Button>
                            }
                            {!isTheSame && isFriend &&
                                <Button style={{width: "130px"}} color="secondary" size={"small"} variant="contained"
                                        onClick={() => unpinFriend()}>Unpin User</Button>
                            }
                            <p style={{color: "red", fontSize: "12px"}}>{error}</p>

                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{height: "40px", backgroundColor: "#074085"}}></div>
        </>
    );
}