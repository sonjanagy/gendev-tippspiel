import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
import {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {Community as CommunityType} from "@prisma/client";
import {getCookie} from "cookies-next";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


interface CommunityQuerried {
    communityId: number
    communityname: string,
}

export const CreateCommunity = () => {
    const [open, setOpen] = React.useState(false);
   const [error, setError] = useState<string | null>();
    const [name, setName] = useState<string>("");
    const [usersCommunities, setUsersCommunities] = useState<CommunityQuerried[]>([]);
    const [communities, setCommunities] = useState<CommunityQuerried[]>([]);

    useEffect(() => {
        const getInitial = async () => {

            const token = getCookie('userData');
            if (token === null || token === undefined) {
                setError("token is null")
                return
            }
            const id = token.split(":")[2].split("}")[0]

            const userComms = await fetch(`/api/joinedCommunities/${Number(id)}`)

            const userCommsList: CommunityQuerried[] = await userComms.json();
            if (userCommsList !== null) {
                setUsersCommunities(userCommsList)
            }

            const response = await fetch('/api/communities');

            if (response !== null && response.body !== null) {
                const communities_as_json: CommunityQuerried[] = await response.json();
                setCommunities(communities_as_json);
            }
        }
        getInitial()
    }, []);

    const handleAdd = async () => {
        if (usersCommunities !== null && usersCommunities !== undefined && usersCommunities.length >= 5) {
            setError("sorry you cant create a Community. You have reached the maximal number of joined communities (5)")
            return
        }
        if (name === "") {
            setError("sorry need a valid name")
            return
        }

        const index = communities.findIndex(e => e.communityname === name)

        if (index !== -1) {
            setError("a community with this name already exists")
            return
        }

        const response = await fetch(`/api/createCommunity/${name}`, {method: "POST"});

        if(response === null){
            setError("something went wrong sorry")
            return
        }
        setError("")
        handleClose()
    };

    //usersCommunities.length >=5

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return <>
        <div style={{display: "flex", margin: "10px"}}>
            <Button color="secondary" variant="contained" onClick={handleClickOpen}>
                create community
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{m: 0, p: 2}} color={"#0171C2"} id="customized-dialog-title">
                    Create Community
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <Box gap={2} display="flex" marginTop={"10px"} flexDirection="column" width={"500px"}
                     alignItems="center">
                    <TextField style={{color: "black", width: "300px"}} fullWidth size="small" label="communityName" variant="outlined"
                               onChange={(e => {
                                   setName(e.target.value)
                               })}>Name</TextField>

                    <p style={{color: "red"}}>{error}</p>
                    <Button autoFocus color="secondary" variant="contained" onClick={handleAdd}>
                        create community
                    </Button>
                </Box>
                <DialogActions>
                </DialogActions>
            </BootstrapDialog>
        </div>

    </>
}