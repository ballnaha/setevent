'use client';

import { Box } from "@mui/material";
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
                component="main"
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {children}
            </Box>
            <LiffNavbar />

        </>
    );
}
