'use client';

import { Box } from "@mui/material";
import LiffHeader from "./components/LiffHeader";
import LiffNavbar from "./components/LiffNavbar";

export default function LiffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ซ่อน website header/footer โดยใช้ CSS
    return (
        <>
            {/* Hide website header/footer */}
            <style jsx global>{`
        body > header,
        body > footer,
        body > main > header,
        body > main > footer {
          display: none !important;
        }
        body {
          display: block !important;
        }
      `}</style>

            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <LiffHeader />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        pb: '70px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    {children}
                </Box>
                <LiffNavbar />
            </Box>
        </>
    );
}
