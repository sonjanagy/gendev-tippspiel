'use client'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useEffect, useState} from "react";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import * as React from "react";
import Button from "@mui/material/Button";

import {useRouter} from 'next/navigation'

interface CommunityQuerried{
    communityId: number;
    communityname: string;
}


export const CommunitiesNavigation = () => {

    const router = useRouter()
    const [communities, setCommunities] = useState<CommunityQuerried[]>([]);

    useEffect(() => {
        const getInit = async () => {
            const response = await fetch('/api/communities');

            if (response !== null && response.body !== null) {
                const communities_as_json: CommunityQuerried[] = await response.json();
                setCommunities(communities_as_json);
            }
        }
        getInit();
    }, []);

    const handleklick = (id: number) => {
        router.push("/community/" + id);
    }

    return <div style={{display: 'flex', height: '80%', justifyContent: 'center', alignItems: 'center', margin: '5px'}}>

        <Accordion sx={{backgroundColor: "#074085"}} elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{color: '#ffffff'}} />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{color: "#ffffff"}}
            >
                EURO 2024
            </AccordionSummary>
            <AccordionDetails>
                {communities.map(community =>
                    <div key={community.communityname} style={{margin: "5px", display:"flex", flexDirection:"row", gap:"4px", alignItems:"center"}} >  <Diversity3Icon sx={{ borderRadius: '50%'}}
                                                                   style={{color: "#ffffff", backgroundColor: "#FFBB1B"}}/> <Button onClick={() => handleklick(community.communityId)} sx={{color: "white"}} key={community.communityId} variant="text">{community.communityname}</Button></div>)}
            </AccordionDetails>
        </Accordion>
    </div>
}
