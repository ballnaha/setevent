"use client";

import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";

export default function CTASection() {
    return (
        <Box sx={{ py: 12, bgcolor: "var(--primary)", position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'white', mb: 3 }}>
                    พร้อมเริ่มงานของคุณหรือยัง?
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.9)', mb: 6, fontWeight: 400 }}>
                    ปรึกษาเราฟรี พร้อมรับใบเสนอราคาภายใน 24 ชั่วโมง
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: "white",
                        color: "var(--primary)",
                        fontFamily: "var(--font-prompt)",
                        borderRadius: "50px",
                        px: 6,
                        py: 2,
                        fontSize: "1.2rem",
                        fontWeight: 'bold',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        '&:hover': {
                            bgcolor: "#f0f0f0",
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s'
                    }}
                >
                    ติดต่อเราทันที
                </Button>
            </Container>
        </Box>
    );
}
