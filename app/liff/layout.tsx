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
        
        /* Vaul specific styles */
        [vaul-drawer] {
          touch-action: none;
        }
        [vaul-drawer][vaul-drawer-direction="bottom"] {
          transform: translate3d(0, 100%, 0);
        }
        [vaul-drawer][vaul-drawer-visible="true"][vaul-drawer-direction="bottom"] {
          transform: translate3d(0, 0, 0);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
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
