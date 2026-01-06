"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";

const stats = [
    { number: "10+", label: "Years Experience" },
    { number: "500+", label: "Events Organized" },
    { number: "10k+", label: "Equipment Items" },
    { number: "100%", label: "Client Satisfaction" },
];

export default function StatsCounter() {
    return (
        <Box sx={{ py: 8, bgcolor: "var(--foreground)", color: "white" }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 4, textAlign: 'center' }}>
                    {stats.map((stat, index) => (
                        <Box key={index}>
                            <Typography variant="h2" sx={{ fontFamily: "var(--font-prompt)", fontWeight: "bold", color: "var(--primary)", mb: 1 }}>
                                {stat.number}
                            </Typography>
                            <Typography variant="h6" sx={{ fontFamily: "var(--font-prompt)", opacity: 0.8 }}>
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
