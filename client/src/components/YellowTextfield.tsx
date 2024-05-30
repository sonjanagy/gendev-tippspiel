'use client'

import {styled} from "@mui/system";
import TextField from "@mui/material/TextField";

export const YellowTextfield = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FFBB1B',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FFBB1B',
    },
    '& .MuiInputLabel-root': {
        color: '#FFBB1B',
    },
    '& .MuiOutlinedInput-input': {
        color: '#FFBB1B',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFBB1B',
        },
    },
});