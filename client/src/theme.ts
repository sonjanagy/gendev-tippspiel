'use client';
import {Roboto} from 'next/font/google';
import {createTheme} from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        primary: {
            main: '#0171C2',
        },
        secondary: {
            main: '#FFBB1B',
            contrastText: 'white'
        },
    },

});

export default theme;