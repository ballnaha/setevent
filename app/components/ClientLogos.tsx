"use client";

import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

export default function ClientLogos() {
    const clients = [
        "TechSummit 2024",
        "GlowFestival",
        "Bangkok Expo",
        "Wedding Planner Co.",
        "Corporate Thai",
        "Music Awards TH"
    ];

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--background)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="body2"
                    align="center"
                    sx={{
                        color: 'var(--secondary)',
                        mb: 4,
                        fontFamily: 'var(--font-prompt)',
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        opacity: 0.7
                    }}
                >
                    TRUSTED BY LEADING ORGANIZATIONS
                </Typography>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="center"
                    alignItems="center"
                    spacing={{ xs: 4, md: 8 }}
                    sx={{ opacity: 0.5 }}
                >
                    {clients.map((client, index) => (
                        <Typography
                            key={index}
                            variant="h6"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 'bold',
                                color: 'var(--foreground)',
                                cursor: 'default',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    opacity: 1,
                                    color: 'var(--primary)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            {client}
                        </Typography>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}
