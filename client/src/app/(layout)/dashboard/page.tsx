'use client'
import AroundAktGameBox from "@/components/AroundAktGameBox";
import {RankingDashboardAll} from "@/components/RankingDashboardAll"
import {RankingDashboardCommunity} from "@/components/RankingDashboardCommunity"
import * as React from "react";
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import {Community} from "@prisma/client";
import {useRouter} from "next/navigation";
import {Button} from "@mui/material";


interface Users {
    userId: number,
    username: string,
    totalPoints: number,
    rank: number
    communtiyId: number
}

interface CommunityQuerried {
    communityId: number
    community: Community,
}


export default function Dashboard() {

    const [users, setUsers] = useState<Users[]>([]);
    const [communities, setCommunities] = useState<CommunityQuerried[]>([]);
    const router = useRouter()

    useEffect(() => {
        const getUsers = async () => {
            const token = getCookie('userData');
            if (token === null || token === undefined) {
                return
            }
            const id = token.split(":")[2].split("}")[0]

            const response = await fetch(`/api/sneakPreview/${Number(id)}`);

            if (response !== null && response.body !== null) {
                console.log(response)
                const users_as_json: Users[] = await response.json();
                setUsers(users_as_json)
            }

            const com = await fetch(`/api/joinedCommunities/${Number(id)}`)

            const communitieslist: CommunityQuerried[] = await com.json()


            if(communitieslist !== null){
                setCommunities(communitieslist);
            }
        }
        getUsers()
    },[])

    const handleClickCommunity = async (id: number) => {
        router.push("/community/" + id);
    }

    return (
        <>
            <AroundAktGameBox></AroundAktGameBox>
            <div style={{height: "40px", backgroundColor: "#074085"}}></div>

            <div style={{display: 'flex', flexDirection: 'row', flexFlow: 'row wrap',
                justifyContent: "space-between", width: "100%"}}>
            <div style={{width: "45%", margin:"20px"}}>
                <div style={{
                    height: "50px",
                    backgroundColor: "#074085",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <p style={{color: "white", marginLeft: "10px"}}> Gesamtrangliste</p>
                </div>
                <RankingDashboardAll users={users}></RankingDashboardAll>
            </div>

                {communities.map(community =>
                    <div key={community.communityId} style={{width:"45%",  margin:"20px"}}>
                        <div style={{
                            height: "50px",
                            backgroundColor: "#074085",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <Button onClick={() => handleClickCommunity(community.communityId)} sx={{color:"white", textTransform: 'none'}} style={{marginLeft: "10px"}}  variant="text">{community.community.communityname}</Button>
                        </div>

                    <RankingDashboardCommunity
                    communityId={community.communityId}></RankingDashboardCommunity>
                    </div>
            )}
            </div>
</>
)
    ;
}