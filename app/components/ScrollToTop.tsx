"use client";

import React, { useState, useEffect } from "react";
import { Box, Fab, Zoom } from "@mui/material";
import { ArrowUp2 } from "iconsax-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled more than 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Zoom in={isVisible}>
            <Box
                onClick={scrollToTop}
                role="button"
                tabIndex={0}
                aria-label="เลื่อนกลับไปด้านบน"
                onKeyDown={(e) => e.key === 'Enter' && scrollToTop()}
                sx={{
                    position: "fixed",
                    bottom: { xs: 24, md: 32 },
                    right: { xs: 24, md: 32 },
                    zIndex: 1000,
                    cursor: 'pointer',
                }}
            >
                <Fab
                    size="small"
                    aria-label="เลื่อนกลับไปด้านบน"
                    sx={{
                        width: 40,
                        height: 40,
                        minHeight: 40,
                        background: "rgba(10, 92, 90, 0.6)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(10, 92, 90, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            background: "rgba(10, 92, 90, 0.8)",
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 30px rgba(10, 92, 90, 0.35)",
                        },
                        "&:active": {
                            transform: "translateY(-1px)",
                        },
                    }}
                >
                    <ArrowUp2 size="20" variant="Bold" color="white" />
                </Fab>
            </Box>
        </Zoom>
    );
}
