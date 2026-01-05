"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { ArrowRight, Star1 } from "iconsax-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
    {
        subtitle: "อันดับ 1 ด้านอุปกรณ์จัดงานอีเว้นท์",
        title: "เนรมิตงานของคุณให้",
        highlight: "สมบูรณ์แบบ",
        description: "SetEvent บริการให้เช่าอุปกรณ์จัดงานครบวงจร และทีมงานมืออาชีพที่พร้อมดูแลทุกรายละเอียด เพื่อให้งานของคุณออกมาน่าประทับใจที่สุด",
        bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        accentGradient: "radial-gradient(circle, rgba(0,127,134,0.3) 0%, rgba(0,0,0,0) 70%)", // Primary teal tint
    },
    {
        subtitle: "บริการครบวงจร",
        title: "จัดงานแต่งงานในฝัน",
        highlight: "ที่คุณเลือกได้",
        description: "แพ็กเกจจัดงานแต่งงานสุดคุ้ม ดูแลโดยทีม Planner มืออาชีพ พร้อมอุปกรณ์แสงสีเสียงที่ทันสมัยที่สุด",
        bgGradient: "linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 100%)", // Slight purple/pink tint for wedding
        accentGradient: "radial-gradient(circle, rgba(255,82,82,0.2) 0%, rgba(0,0,0,0) 70%)", // Secondary red/pink tint
    },
    {
        subtitle: "Event Organizer",
        title: "งานเปิดตัวสินค้า",
        highlight: "ระดับมืออาชีพ",
        description: "สร้างภาพลักษณ์ที่โดดเด่นให้กับแบรนด์ของคุณ ด้วยเวที แสง สี เสียง และจอ LED คุณภาพสูง รองรับทุกสเกลงาน",
        bgGradient: "linear-gradient(135deg, #0f1718 0%, #112222 100%)", // Slight teal tint
        accentGradient: "radial-gradient(circle, rgba(255,171,64,0.2) 0%, rgba(0,0,0,0) 70%)", // Tertiary orange tint
    },
];

export default function BannerSlider() {
    return (
        <Box sx={{ width: "100%", height: { xs: "600px", md: "800px" }, position: "relative" }}>
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                speed={1500}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return '<span class="' + className + '" style="background-color: var(--primary); width: 10px; height: 10px; margin: 0 6px;"></span>';
                    }
                }}
                style={{ width: "100%", height: "100%" }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                background: slide.bgGradient,
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Background Decorative Elements */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "-20%",
                                    right: "-10%",
                                    width: "60%",
                                    height: "60%",
                                    background: slide.accentGradient,
                                    filter: "blur(60px)",
                                    zIndex: 1,
                                    animation: "pulse 4s infinite alternate",
                                }}
                            />

                            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
                                <Stack spacing={4} sx={{ maxWidth: "800px" }}>
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 1,
                                            px: 2,
                                            py: 1,
                                            borderRadius: "50px",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            bgcolor: "rgba(255,255,255,0.05)",
                                            width: "fit-content",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    >
                                        <Star1 size="16" color="var(--tertiary)" variant="Bold" />
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "white", fontFamily: "var(--font-prompt)" }}
                                        >
                                            {slide.subtitle}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontSize: { xs: "2.5rem", md: "4.5rem" },
                                            fontWeight: "bold",
                                            lineHeight: 1.1,
                                            fontFamily: "var(--font-prompt)",
                                            color: "white",
                                            background: "-webkit-linear-gradient(45deg, #FFFFFF 30%, #CFD8DC 90%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        {slide.title}
                                        <br />
                                        <span
                                            style={{
                                                color: "var(--primary)",
                                                WebkitTextFillColor: "var(--primary)",
                                            }}
                                        >
                                            {slide.highlight}
                                        </span>{" "}
                                        ที่สุด
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: "rgba(255,255,255,0.8)",
                                            fontFamily: "var(--font-prompt)",
                                            lineHeight: 1.6,
                                            fontWeight: 300,
                                            maxWidth: "600px",
                                        }}
                                    >
                                        {slide.description}
                                    </Typography>

                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowRight />}
                                            sx={{
                                                bgcolor: "var(--primary)",
                                                color: "white",
                                                fontFamily: "var(--font-prompt)",
                                                borderRadius: "50px",
                                                px: 4,
                                                py: 1.5,
                                                fontSize: "1.1rem",
                                                textTransform: "none",
                                                boxShadow: "0 10px 20px -5px rgba(0, 127, 134, 0.4)",
                                                "&:hover": {
                                                    bgcolor: "#006A70",
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 15px 25px -5px rgba(0, 127, 134, 0.5)",
                                                },
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            ดูบริการของเรา
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                color: "white",
                                                borderColor: "rgba(255,255,255,0.3)",
                                                fontFamily: "var(--font-prompt)",
                                                borderRadius: "50px",
                                                px: 4,
                                                py: 1.5,
                                                fontSize: "1.1rem",
                                                textTransform: "none",
                                                "&:hover": {
                                                    borderColor: "white",
                                                    bgcolor: "white",
                                                    color: "black",
                                                },
                                            }}
                                        >
                                            ติดต่อสอบถาม
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Container>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles for Swiper Pagination */}
            <style jsx global>{`
        .swiper-pagination-bullet {
            background: rgba(255,255,255,0.3) !important;
            opacity: 1;
            transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
            background: var(--primary) !important;
            width: 25px !important;
            border-radius: 5px;
        }
      `}</style>
        </Box>
    );
}
