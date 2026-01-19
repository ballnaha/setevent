"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import { Heart, Music, Play, Pause, Gift } from "iconsax-react";
import { Button, Typography, Box, Paper, IconButton } from "@mui/material";

// ==========================================
// 💖 CONFIGURATION
// ==========================================
const CONTENT = {
    title: "For My Love",
    openingText: "Tap to open your surprise",
    greeting: "Happy Valentine's Day",
    subtitle: "Take My Heart",
    message: `Every moment with you is a treasure.
  I Love You Forever ❤️`,
    signer: "Love, Make",
};

const MEMORIES = [
    {
        type: "image",
        url: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1974&auto=format&fit=crop",
        caption: "Our First Date ❤️",
    },
    {
        type: "image",
        url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2071&auto=format&fit=crop",
        caption: "Sweet Moments 📸",
    },
    {
        type: "image",
        url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1974&auto=format&fit=crop",
        caption: "Holding Hands 🤝",
    },
    {
        type: "image",
        url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop",
        caption: "Forever Love 💍",
    },
];

export default function ValentinePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; top: number; left: number; size: number; rotation: number; color: string }[]>([]);

    useEffect(() => {
        // Generate static border hearts like the image
        const colors = ["#FF3366", "#FF99AA", "#FF5577", "#D41442"];
        const borderHearts = [];
        // Top border
        for (let i = 0; i < 8; i++) borderHearts.push({ id: i, top: 2, left: i * 14, size: 24 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        // Bottom border
        for (let i = 0; i < 8; i++) borderHearts.push({ id: i + 10, top: 92, left: i * 14, size: 24 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        // Left border
        for (let i = 0; i < 10; i++) borderHearts.push({ id: i + 20, top: i * 10, left: 2, size: 20 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        // Right border
        for (let i = 0; i < 10; i++) borderHearts.push({ id: i + 30, top: i * 10, left: 90, size: 20 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });

        setHearts(borderHearts);

        // Audio setup
        // const bgMusic = new Audio("/valentine-song.mp3"); 
        // bgMusic.loop = true;
        // setAudio(bgMusic);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        if (audio) {
            audio.play().catch(e => console.log("Audio play failed", e));
            setIsPlaying(true);
        }
    };

    const toggleMusic = () => {
        if (audio) {
            if (isPlaying) audio.pause();
            else audio.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Box
            sx={{
                height: "100dvh",
                width: "100vw",
                background: isOpen ? "#FFF0F3" : "radial-gradient(circle at center, #ff9a9e 0%, #fecfef 50%, #f5576c 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                fontFamily: "'Comfortaa', sans-serif",
            }}
        >
            <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes float-lid { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .sunburst-bg {
          background: repeating-conic-gradient(
            from 0deg,
            #FFEBEE 0deg 18deg,
            #FFCDD2 18deg 36deg
          );
        }
      `}</style>

            {/* 🏙️ Background Decoration */}
            {isOpen ? (
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top colored Shape */}
                    <div className="absolute top-0 left-0 w-full h-[16%] bg-[#8B1D36] rounded-b-[2.5rem] z-0" />

                    {/* Floating Hearts Border */}
                    {hearts.map((h) => (
                        <Heart
                            key={h.id}
                            variant="Bold"
                            color={h.color}
                            style={{
                                position: 'absolute',
                                top: `${h.top}%`,
                                left: `${h.left}%`,
                                width: h.size,
                                height: h.size,
                                transform: `rotate(${h.rotation}deg)`,
                                zIndex: 1,
                                opacity: 0.9
                            }}
                        />
                    ))}
                </div>
            ) : (
                /* Intro Background */
                <div className="absolute inset-0 sunburst-bg z-0" />
            )}

            {/* 🎁 LOCK SCREEN (INTRO) */}
            {!isOpen && (
                <div className="w-full h-full flex flex-col justify-between items-center z-10 relative overflow-hidden" onClick={handleOpen}>

                    {/* Top Logo */}
                    <div className="pt-8 animate-fade-in-up">
                        <img
                            src="/images/logo1.png"
                            alt="SetEvent Logo"
                            className="h-5 w-auto object-contain drop-shadow-md opacity-90"
                        />
                    </div>

                    {/* Top Spacer reduced */}
                    <div className="flex-1 max-h-16" />

                    {/* Middle: Gift Box & Title */}
                    <div className="flex flex-col items-center justify-center cursor-pointer group transform transition-transform duration-300 active:scale-95">

                        {/* Floating Lid */}
                        <div className="relative w-48 h-16 bg-[#D32F2F] rounded-t-lg shadow-xl mb-4 animate-[float-lid_3s_ease-in-out_infinite]">
                            {/* Ribbon H */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-[#FF8A80]" />
                            {/* Bow */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-end">
                                <div className="w-8 h-8 bg-[#FF8A80] rounded-tl-full rounded-bl-full mr-1" />
                                <div className="w-4 h-4 bg-[#FF5252] rounded-full z-10" />
                                <div className="w-8 h-8 bg-[#FF8A80] rounded-tr-full rounded-br-full ml-1" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-center py-4 z-20">
                            <Typography variant="overline" className="text-gray-700 tracking-[0.3em] font-bold">
                                HAPPY
                            </Typography>
                            <Typography variant="h3" className="text-[#6D2128] font-bold" sx={{ fontFamily: 'cursive' }}>
                                Valentine
                            </Typography>
                        </div>

                        {/* Box Body */}
                        <div className="relative w-40 h-32 bg-[#E53935] shadow-2xl skew-x-1">
                            {/* Ribbon V */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-[#FF8A80]" />
                            {/* Ribbon H */}
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-[#FF8A80]" />
                            {/* Side Shadow */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[0px] border-r-[15px] border-r-[#B71C1C] border-b-[128px] border-b-transparent opacity-50" />
                        </div>

                    </div>

                    {/* Footer White Area */}
                    <div className="w-full bg-white mt-auto pt-8 pb-12 px-6 rounded-t-[3rem] text-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-center max-w-xs mx-auto">
                            <div className="text-left">
                                <Typography className="text-[#6D2128] font-black text-xl leading-none">
                                    LOVE
                                </Typography>
                                <Typography className="text-[#6D2128] text-xs tracking-widest my-1">
                                    IS IN THE
                                </Typography>
                                <Typography className="text-[#6D2128] font-black text-2xl leading-none">
                                    AIR
                                </Typography>
                            </div>

                            <Button
                                variant="contained"
                                size="medium"
                                startIcon={<Heart variant="Bold" size="18" color="white" />}
                                className="bg-gradient-to-r from-[#D32F2F] to-[#FF5252] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white rounded-full px-8 py-3 text-sm font-bold tracking-wider shadow-lg shadow-red-200 transform transition-all hover:-translate-y-1"
                                sx={{
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 16px rgba(211, 47, 47, 0.3)'
                                }}
                            >
                                Be Mine
                            </Button>
                        </div>
                        <Typography variant="caption" className="block text-gray-300 mt-6 text-[10px] tracking-[0.2em]">
                            HAPPY VALENTINE'S DAY {new Date().getFullYear()}
                        </Typography>
                    </div>       </div>
            )
            }
            {/* 🌹 MAIN CONTENT (Full Screen, No Scroll) */}
            {
                isOpen && (
                    <div className="w-full h-full flex flex-col items-center justify-between py-4 px-4 z-10 animate-[fadeIn_0.8s_ease-out]">

                        {/* Header Text */}
                        <div className="text-center pt-1 mb-2">
                            <Typography variant="h4" className="text-[#FFD7E0] font-bold tracking-wider" sx={{ fontFamily: 'cursive' }}>
                                Happy
                            </Typography>
                            <Typography variant="h5" className="text-white font-black tracking-widest uppercase drop-shadow-sm" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                VALENTINE
                            </Typography>
                        </div>

                        {/* Cards (Center Stage) */}
                        <div className="flex-1 flex items-center justify-center w-full py-2">
                            <Swiper
                                effect={"cards"}
                                grabCursor={true}
                                modules={[EffectCards, Pagination]}
                                className="w-[260px] h-[380px] sm:w-[320px] sm:h-[460px]" // Optimized for mobile viewport
                                pagination={{ clickable: true, dynamicBullets: true }}
                            >
                                {MEMORIES.map((memory, index) => (
                                    <SwiperSlide key={index} className="rounded-xl bg-white shadow-xl overflow-hidden border-[6px] border-white">
                                        <div className="w-full h-full relative">
                                            <img src={memory.url} alt={memory.caption} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
                                                <Typography className="text-white font-medium shadow-black drop-shadow-md">
                                                    {memory.caption}
                                                </Typography>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Bottom Message & Controls */}
                        <div className="w-full max-w-sm text-center pb-4">
                            <Typography variant="h6" className="text-[#8B1D36] font-bold uppercase tracking-widest mb-2" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                {CONTENT.subtitle}
                            </Typography>

                            <Paper elevation={0} sx={{ background: "rgba(255,255,255,0.6)", borderRadius: 3, p: 2, backdropFilter: 'blur(4px)' }}>
                                <Typography variant="body2" className="text-gray-700 whitespace-pre-line" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    {CONTENT.message}
                                </Typography>
                                <Typography variant="caption" className="block text-[#D41442] font-bold mt-2">
                                    - {CONTENT.signer} -
                                </Typography>
                            </Paper>

                            {/* Audio Toggle */}
                            {audio && (
                                <IconButton onClick={toggleMusic} className="mt-2 text-[#8B1D36]">
                                    {isPlaying ? <Music variant="Bold" /> : <Music variant="Outline" />}
                                </IconButton>
                            )}
                        </div>

                    </div>
                )
            }
        </Box >
    );
}
