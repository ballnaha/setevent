'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-prompt), sans-serif',
        h1: { fontFamily: 'var(--font-prompt)' },
        h2: { fontFamily: 'var(--font-prompt)' },
        h3: { fontFamily: 'var(--font-prompt)' },
        h4: { fontFamily: 'var(--font-prompt)' },
        h5: { fontFamily: 'var(--font-prompt)' },
        h6: { fontFamily: 'var(--font-prompt)' },
        subtitle1: { fontFamily: 'var(--font-prompt)' },
        subtitle2: { fontFamily: 'var(--font-prompt)' },
        body1: { fontFamily: 'var(--font-prompt)' },
        body2: { fontFamily: 'var(--font-prompt)' },
        button: { fontFamily: 'var(--font-prompt)' },
        caption: { fontFamily: 'var(--font-prompt)' },
        overline: { fontFamily: 'var(--font-prompt)' },
    },
    palette: {
        primary: {
            main: '#0A5C5A',
        },
        secondary: {
            main: '#D4AF37',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'var(--font-prompt)',
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'var(--font-prompt)',
                },
            },
        },
    },
});

export default theme;
