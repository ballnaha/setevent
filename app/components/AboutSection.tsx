"use client";

import React from "react";
import { Box, Container, Typography, Stack, Button, Chip } from "@mui/material";
import { ArrowRight, MagicStar, StatusUp, People, Monitor, Speaker, Award } from "iconsax-react";

import Link from "next/link";

export default function AboutSection() {
    const features = [
        { text: "รับจัดงานอีเวนต์ครบวงจร", icon: <MagicStar size="24" variant="Bulk" color="var(--primary)" /> },
        { text: "งานแต่งงาน & งานเลี้ยงสังสรรค์", icon: <StatusUp size="24" variant="Bulk" color="var(--primary)" /> },
        { text: "งานสัมมนา & เปิดตัวสินค้า", icon: <People size="24" variant="Bulk" color="var(--primary)" /> },
        { text: "เช่าจอ LED ทุกขนาดทั่วประเทศ", icon: <Monitor size="24" variant="Bulk" color="var(--primary)" /> },
        { text: "ระบบแสง สี เสียง เวทีมาตรฐาน", icon: <Speaker size="24" variant="Bulk" color="var(--primary)" /> },
        { text: "ทีมงาน Support มืออาชีพ", icon: <Award size="24" variant="Bulk" color="var(--primary)" /> },
    ];

    return (
        <Box
            id="about-section"
            component="section"
            sx={{
                pt: { xs: 6, md: 15 },
                pb: 0,
                bgcolor: "var(--background)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Decorations */}
            <Box
                sx={{
                    position: "absolute",
                    top: "10%",
                    left: "-5%",
                    width: "40%",
                    height: "40%",
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 70%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10%",
                    right: "-5%",
                    width: "40%",
                    height: "40%",
                    background: "radial-gradient(circle, rgba(10, 92, 90, 0.08) 0%, rgba(10, 92, 90, 0) 70%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Stack spacing={{ xs: 4, md: 6 }} alignItems="center" textAlign="center">
                    {/* Header */}
                    <Stack spacing={2} alignItems="center">
                        <Chip
                            label="ABOUT SET EVENT"
                            sx={{
                                bgcolor: "rgba(10, 92, 90, 0.1)",
                                color: "var(--primary)",
                                fontWeight: 700,
                                fontFamily: "var(--font-prompt)",
                                letterSpacing: 1,
                                border: "1px solid var(--border-color)",
                                height: { xs: 28, md: 32 },
                                fontSize: { xs: '0.7rem', md: '0.8125rem' }
                            }}
                        />
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: "1.75rem", md: "3.5rem" },
                                fontWeight: 800,
                                fontFamily: "var(--font-prompt)",
                                color: "var(--foreground)",
                                lineHeight: 1.2,
                            }}
                        >
                            <span style={{ color: "var(--primary)" }}>ผู้นำด้านการจัดอีเวนต์</span> <br />
                            และอุปกรณ์โปรดักชั่นครบวงจร
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: "0.9rem", md: "1.2rem" },
                                lineHeight: { xs: 1.6, md: 1.8 },
                                color: "var(--foreground)",
                                opacity: 0.7,
                                fontFamily: "var(--font-prompt)",
                                maxWidth: "800px",
                            }}
                        >
                            SET EVENT Thailand มุ่งมั่นสร้างสรรค์ประสบการณ์ที่เหนือระดับ
                            ด้วยบริการรับจัดงานอีเวนต์ครบวงจร ตั้งแต่งานแต่งงาน งานสัมมนา ไปจนถึงคอนเสิร์ต
                            พร้อมเทคโนโลยีจอ LED และระบบแสงสีเสียงมาตรฐานสากล
                        </Typography>
                    </Stack>

                    {/* Features Grid - 2 columns on mobile */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                            gap: { xs: 2, md: 3 },
                            width: "100%",
                        }}
                    >
                        {features.map((feature, i) => (
                            <Box
                                key={i}
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    borderRadius: { xs: "16px", md: "24px" },
                                    bgcolor: "var(--card-bg)",
                                    border: "1px solid var(--border-color)",
                                    boxShadow: "var(--card-shadow)",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: { xs: 1.5, md: 2 },
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        borderColor: "var(--primary)",
                                        bgcolor: "rgba(10, 92, 90, 0.02)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: 40, md: 50 },
                                        height: { xs: 40, md: 50 },
                                        borderRadius: { xs: "10px", md: "14px" },
                                        bgcolor: "rgba(10, 92, 90, 0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "& svg": {
                                            width: { xs: 20, md: 24 },
                                            height: { xs: 20, md: 24 }
                                        }
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: "0.85rem", md: "1rem" },
                                        fontFamily: "var(--font-prompt)",
                                        color: "var(--foreground)",
                                        lineHeight: 1.4
                                    }}
                                >
                                    {feature.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Action */}
                    <Button
                        component={Link}
                        href="/about"
                        variant="contained"
                        endIcon={<ArrowRight size="20" variant="Bold" color="#fff" />}
                        sx={{
                            bgcolor: "var(--primary)",
                            color: "white",
                            px: 5,
                            py: 2,
                            borderRadius: "50px",
                            fontWeight: 700,
                            fontFamily: "var(--font-prompt)",
                            fontSize: "1rem",
                            boxShadow: "var(--primary-glow)",
                            "&:hover": {
                                bgcolor: "var(--primary)",
                                transform: "scale(1.02)",
                                boxShadow: "var(--primary-glow)",
                            },
                        }}
                    >
                        รู้จักเราเพิ่มเติม
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
