import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import DialogActions from "@mui/material/DialogActions";
import {useEffect, useState} from "react";
import {StatusCodes} from "http-status-codes";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import timezone from 'dayjs/plugin/timezone';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TeamQueried {
    teamId: number,
    country: string,
    flag: string
}

interface Team {
    label: string,
    teamId: number
}

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export const RegisterGame = () => {
    const [open, setOpen] = React.useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [homeTeam, setHomeTeam] = useState<String | null>(null);
    const [awayTeam, setAwayTeam] = useState<String | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>();

    useEffect(() => {
        const getTeams = async () => {
            const response = await fetch('/api/teams');
            if (response !== null && response.body !== null) {
                const teams_as_json: TeamQueried[] = await response.json();
                setTeams(teams_as_json.map(team => ({
                    "label": team.country,
                    "teamId": team.teamId
                })));
            }
        }
        getTeams();
    }, []);


    const handleAdd = async () => {

        if(homeTeam === null) {
            setError("Please select a home team");
            return;
        }
        if(awayTeam === null) {
            setError("Please select a away team");
            return;
        }

        if(awayTeam === homeTeam) {
            setError("The teams have to be different");
            return;
        }

        if(startTime === null ) {
            setError("Please select a date and time");
            return;
        }

        if(startTime.getDate() <= new Date().getDate() && startTime.getMonth() <= new Date().getMonth()  && (startTime.getHours()-1) <= new Date().getHours() && startTime.getMinutes() <= new Date().getMinutes() && startTime.getFullYear() <= new Date().getFullYear() ) {
            setError("date and time has to be before now");
            return;
        }

        const response = await fetch('/api/game',
            {
                method: "POST",
                body: JSON.stringify({
                    hometeam: homeTeam,
                    awayteam: awayTeam,
                    starttime: startTime,
                    date: startTime,

                }),
            })

        if (!response.ok) {
            if (response.status === StatusCodes.BAD_REQUEST) {
                setError("Home- or awayteam don't exist");
            }
            return;
        }
        handleClose();

    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return <>
        <div style={{display: "flex", margin: "10px"}}>
            <Button color="secondary" variant="contained" onClick={handleClickOpen}>
                Add game
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{m: 0, p: 2}} color={"#0171C2"} id="customized-dialog-title">
                    Add game
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
                <Box gap={5} display="flex" marginTop={"10px"} flexDirection="column" width={"500px"}
                     alignItems="center">
                    <Autocomplete disablePortal id="combo-box-demo" options={teams} sx={{width: 300}}
                                  renderInput={(params) => <TextField {...params} label="Hometeam"/>}
                                  onChange={((e, value) => {
                                      if (value !== null) {
                                          setHomeTeam(value.label)
                                      }
                                  })}
                    />
                    <Autocomplete disablePortal id="combo-box-demo" options={teams} sx={{width: 300}}
                                  renderInput={(params) => <TextField {...params} label="Awayteam"/>}
                                  onChange={((e, value) => {
                                      if (value !== null) {
                                          setAwayTeam(value.label)
                                      }
                                  })}/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                            <DateTimePicker label="Basic date time picker" timezone="Europe/London" onAccept={(date) => {
                                if (date !== null) {
                                    console.log(date.toDate().toString())
                                    setStartTime(date.toDate());
                                }
                            }}/>
                        </DemoContainer>
                    </LocalizationProvider>
                    <p style={{color: "red"}}>{error}</p>
                    <Button autoFocus color="secondary" variant="contained" onClick={handleAdd}>
                        add game
                    </Button>
                </Box>
                <DialogActions>
                </DialogActions>
            </BootstrapDialog>
        </div>

    </>
}