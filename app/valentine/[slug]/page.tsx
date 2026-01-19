"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import { Heart, Music, Play, Pause, Gift } from "iconsax-react";
import { Button, Typography, Box, Paper, IconButton, CircularProgress } from "@mui/material";

// ==========================================
// 💖 DEFAULT CONFIGURATION (FALLBACK)
// ==========================================
const DEFAULT_CONTENT = {
    title: "For My Love",
    openingText: "Tap to open your surprise",
    greeting: "Happy Valentine's Day",
    subtitle: "Take My Heart",
    message: `Every moment with you is a treasure.
  I Love You Forever ❤️`,
    signer: "Love, Make",
    backgroundColor: "#FFF0F3",
    backgroundMusicYoutubeId: "",
    backgroundMusicUrl: "",
};

const DEFAULT_MEMORIES = [
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
    {
        type: "youtube",
        url: "cTpcStBG2eE",
        caption: "Our Sweet Journey 🎥",
    },
    {
        type: "tiktok",
        url: "7591516289156369685", // TikTok Video ID
        caption: "Fun Times 🎵",
        thumbnail: "", // ใส่ URL รูป thumbnail ที่นี่ (ถ้าไม่ใส่จะแสดงเป็น gradient)
    },
];

interface ValentineContent {
    title: string;
    openingText: string;
    greeting: string;
    subtitle: string;
    message: string;
    signer: string;
    backgroundColor: string;
    backgroundMusicYoutubeId: string;
    backgroundMusicUrl: string;
}

export default function ValentineSlugPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [content, setContent] = useState<ValentineContent | null>(null);
    const [memories, setMemories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; top: number; left: number; size: number; rotation: number; color: string }[]>([]);
    const [burstHearts, setBurstHearts] = useState<{ id: number; left: number; size: number; duration: number; delay: number }[]>([]);
    const [activeVideo, setActiveVideo] = useState<{ type: string; url: string; caption: string } | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    // Background Music State
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isMusicMuted, setIsMusicMuted] = useState(false);
    const musicPlayerRef = React.useRef<HTMLIFrameElement>(null);
    const musicAudioRef = React.useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const response = await fetch(`/api/valentine/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setContent({
                        title: data.title || DEFAULT_CONTENT.title,
                        openingText: data.openingText || DEFAULT_CONTENT.openingText,
                        greeting: data.greeting || DEFAULT_CONTENT.greeting,
                        subtitle: data.subtitle || DEFAULT_CONTENT.subtitle,
                        message: data.message || DEFAULT_CONTENT.message,
                        signer: data.signer || DEFAULT_CONTENT.signer,
                        backgroundColor: data.backgroundColor || DEFAULT_CONTENT.backgroundColor,
                        backgroundMusicYoutubeId: data.backgroundMusicYoutubeId || "",
                        backgroundMusicUrl: data.backgroundMusicUrl || "",
                    });
                    if (data.memories && data.memories.length > 0) {
                        setMemories(data.memories);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch valentine data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Memoize border hearts to prevent regeneration and infinite loops
    const borderHearts = React.useMemo(() => {
        const colors = ["#FF3366", "#FF99AA", "#FF5577", "#D41442"];
        const heartsArr = [];
        // Top border
        for (let i = 0; i < 8; i++) heartsArr.push({ id: `t-${i}`, top: 2, left: i * 14, size: 24 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        // Bottom border
        for (let i = 0; i < 8; i++) heartsArr.push({ id: `b-${i}`, top: 92, left: i * 14, size: 24 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        // Left border
        for (let i = 0; i < 10; i++) heartsArr.push({ id: `l-${i}`, top: i * 10, left: 2, size: 20 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        // Right border
        for (let i = 0; i < 10; i++) heartsArr.push({ id: `r-${i}`, top: i * 10, left: 90, size: 20 + Math.random() * 10, rotation: Math.random() * 30 - 15, color: colors[i % 4] });
        return heartsArr;
    }, []);

    // Ref to track image preload objects to prevent memory leaks
    const preloadImagesRef = useRef<HTMLImageElement[]>([]);

    // Memoized callback for handling image load
    const handleImageLoaded = useCallback((index: number) => {
        setLoadedImages(prev => {
            if (prev.has(index)) return prev;
            const updated = new Set(prev);
            updated.add(index);
            return updated;
        });
    }, []);

    useEffect(() => {
        // Cleanup previous preload images
        preloadImagesRef.current.forEach(img => {
            img.onload = null;
            img.onerror = null;
        });
        preloadImagesRef.current = [];

        // Preload all images and mark other types as loaded
        const nonImageIndexes: number[] = [];

        memories.forEach((memory, index) => {
            if (memory.type === 'image') {
                const img = new Image();
                img.onload = () => handleImageLoaded(index);
                img.onerror = () => handleImageLoaded(index); // Mark as loaded even on error to prevent infinite loading
                img.src = memory.url;
                preloadImagesRef.current.push(img);
            } else if (memory.type === 'youtube') {
                const img = new Image();
                img.onload = () => handleImageLoaded(index);
                img.onerror = () => handleImageLoaded(index);
                img.src = `https://img.youtube.com/vi/${memory.url}/hqdefault.jpg`;
                preloadImagesRef.current.push(img);
            } else {
                nonImageIndexes.push(index);
            }
        });

        // Batch update for non-image types
        if (nonImageIndexes.length > 0) {
            setLoadedImages(prev => {
                const updated = new Set(prev);
                let changed = false;
                nonImageIndexes.forEach(idx => {
                    if (!updated.has(idx)) {
                        updated.add(idx);
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });
        }

        // Cleanup on unmount
        return () => {
            preloadImagesRef.current.forEach(img => {
                img.onload = null;
                img.onerror = null;
            });
        };
    }, [memories, handleImageLoaded]);

    const displayContent = content || DEFAULT_CONTENT;

    const handleOpen = () => {
        setIsOpen(true);
        // Start background music if available (MP3 has priority)
        if (displayContent.backgroundMusicUrl || displayContent.backgroundMusicYoutubeId) {
            setIsMusicPlaying(true);
        }
    };

    const toggleMusic = () => {
        const newMuted = !isMusicMuted;
        setIsMusicMuted(newMuted);

        // Control MP3 audio element
        if (musicAudioRef.current) {
            musicAudioRef.current.muted = newMuted;
        }
    };

    // Effect to handle music play/pause
    useEffect(() => {
        if (isOpen && isMusicPlaying) {
            if (musicAudioRef.current) {
                musicAudioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            }
        }
    }, [isOpen, isMusicPlaying]);

    // Effect to handle mute state
    useEffect(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.muted = isMusicMuted;
        }
    }, [isMusicMuted]);

    // Pause music when video modal opens
    const handleOpenVideoModal = (memory: any) => {
        setActiveVideo(memory);
        // Note: The hidden YouTube player will continue but video takes audio focus
    };

    const handleCloseVideoModal = () => {
        setActiveVideo(null);
    };

    const handleSlideChange = (swiper: { activeIndex: number }) => {
        // Update current slide index
        setCurrentSlideIndex(swiper.activeIndex);

        // Create 10-15 burst hearts
        const count = 12;
        const newHearts = Array.from({ length: count }).map((_, i) => ({
            id: Date.now() + i,
            left: 20 + Math.random() * 60, // Center-ish
            size: 20 + Math.random() * 30, // Random sizes
            duration: 1 + Math.random() * 1.5, // 1s to 2.5s duration
            delay: Math.random() * 0.5,
        }));

        setBurstHearts((prev) => [...prev, ...newHearts]);

        // Cleanup after animation
        setTimeout(() => {
            setBurstHearts((current) => current.filter(h => !newHearts.find(nh => nh.id === h.id)));
        }, 2500);
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    height: "100dvh",
                    width: "100vw",
                    background: "#FFF0F3",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Heart size="80" variant="Bulk" color="#FF3366" className="animate-bounce" />
                    <CircularProgress size={100} thickness={2} sx={{ position: 'absolute', top: -10, color: '#FF3366', opacity: 0.3 }} />
                    <Typography sx={{ mt: 4, color: '#4A151B', fontWeight: 800, fontFamily: 'cursive', letterSpacing: 2 }}>
                        Preparing your surprise...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    height: "100dvh",
                    width: "100vw",
                    background: displayContent.backgroundColor || "#FFF0F3",
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
        @keyframes burst-float {
            0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0; }
            20% { opacity: 1; transform: translateY(-20px) scale(1.2) rotate(10deg); }
            100% { transform: translateY(-200px) scale(1) rotate(-10deg); opacity: 0; }
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .image-loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        .sunburst-bg {
          background: repeating-conic-gradient(
            from 0deg,
            #FFEBEE 0deg 18deg,
            #FFCDD2 18deg 36deg
          );
        }
        
        /* Valentine Swiper - Hardware Acceleration & Smooth Transitions */
        .swiper {
            will-change: transform;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        .swiper-slide {
            will-change: transform;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        .swiper-slide img {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        
        /* Smooth image reveal */
        .memory-image {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .memory-image.loaded {
            opacity: 1;
        }
        
        /* Valentine Swiper Bullets - Heart Style */
        .swiper-pagination-bullet {
            width: 12px !important;
            height: 12px !important;
            background: #FFB6C1 !important;
            opacity: 0.6 !important;
            border-radius: 50% !important;
            transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
            width: 14px !important;
            height: 14px !important;
            background: linear-gradient(135deg, #FF6B6B, #D32F2F) !important;
            opacity: 1 !important;
            box-shadow: 0 0 10px rgba(211, 47, 47, 0.5) !important;
        }
      `}</style>

                {/* ❤️ Burst Hearts Animation Overlay */}
                <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                    {burstHearts.map((h) => (
                        <div
                            key={h.id}
                            className="absolute text-red-500 drop-shadow-md"
                            style={{
                                left: `${h.left}%`,
                                bottom: '20%', // Start from near bottom of cards
                                fontSize: `${h.size}px`,
                                animation: `burst-float ${h.duration}s ease-out forwards`,
                                animationDelay: `${h.delay}s`,
                            }}
                        >
                            ❤️
                        </div>
                    ))}
                </div>

                {/* 🎵 Hidden Background Music Player */}
                {isOpen && isMusicPlaying && displayContent.backgroundMusicUrl && (
                    <audio
                        ref={musicAudioRef}
                        src={displayContent.backgroundMusicUrl}
                        loop
                        playsInline
                        autoPlay
                        style={{ display: 'none' }}
                    />
                )}
                {isOpen && isMusicPlaying && !displayContent.backgroundMusicUrl && displayContent.backgroundMusicYoutubeId && (
                    <iframe
                        ref={musicPlayerRef}
                        src={`https://www.youtube.com/embed/${displayContent.backgroundMusicYoutubeId}?autoplay=1&mute=${isMusicMuted ? 1 : 0}&loop=1&playlist=${displayContent.backgroundMusicYoutubeId}&controls=0`}
                        allow="autoplay; encrypted-media"
                        style={{
                            position: 'absolute',
                            width: '1px',
                            height: '1px',
                            opacity: 0,
                            pointerEvents: 'none',
                            zIndex: -1
                        }}
                        title="Background Music YouTube"
                    />
                )}

                {/* 🎵 Music Control Button */}
                {isOpen && (displayContent.backgroundMusicUrl || displayContent.backgroundMusicYoutubeId) && (
                    <button
                        onClick={toggleMusic}
                        className="fixed top-4 right-4 z-[60] w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        style={{
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            border: '2px solid #FF3366'
                        }}
                    >
                        {isMusicMuted ? (
                            <span className="text-xl">🔇</span>
                        ) : (
                            <span className="text-xl animate-pulse">🎵</span>
                        )}
                    </button>
                )}

                {/* 🏙️ Background Decoration */}
                {isOpen ? (
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Top colored Shape */}
                        <div className="absolute top-0 left-0 w-full h-[16%] bg-[#8B1D36] rounded-b-[2.5rem] z-0" />

                        {/* Floating Hearts Border */}
                        {borderHearts.map((h) => (
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
                                    {displayContent.title}
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
                                    {displayContent.openingText || "Be Mine"}
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
                            <div className="text-center">
                                <Typography variant="h6" className="text-[#FFD7E0] font-bold tracking-wider" sx={{ fontFamily: 'cursive' }}>
                                    {displayContent.greeting?.split(' ')[0] || "Happy"}
                                </Typography>
                                <Typography variant="subtitle1" className="text-white font-black tracking-widest uppercase drop-shadow-sm" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    {displayContent.greeting?.split(' ').slice(1).join(' ') || "VALENTINE"}
                                </Typography>
                            </div>

                            {/* Cards (Center Stage) */}
                            <div className="flex-1 flex items-center justify-center w-full py-2">
                                <Swiper
                                    effect={"cards"}
                                    grabCursor={true}
                                    modules={[EffectCards, Pagination]}
                                    className="w-[300px] h-[450px] sm:w-[360px] sm:h-[540px]"
                                    pagination={{ clickable: true, dynamicBullets: true }}
                                    onSlideChange={handleSlideChange}
                                    speed={300}
                                    touchRatio={1.5}
                                    resistance={true}
                                    resistanceRatio={0.85}
                                    followFinger={true}
                                    threshold={5}
                                    observer={true}
                                    observeParents={true}
                                >
                                    {memories.map((memory, index) => (
                                        <SwiperSlide key={index} className="rounded-xl bg-white shadow-xl overflow-hidden border-[6px] border-white">
                                            <div className="w-full h-full relative">
                                                {memory.type === 'video' ? (
                                                    <div className="w-full h-full relative bg-gradient-to-br from-pink-400 to-rose-500">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Typography className="text-white text-4xl">🎬</Typography>
                                                        </div>
                                                        <Typography className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">Video</Typography>
                                                    </div>
                                                ) : memory.type === 'youtube' ? (
                                                    <div className="w-full h-full relative">
                                                        <img
                                                            src={`https://img.youtube.com/vi/${memory.url}/hqdefault.jpg`}
                                                            alt={memory.caption || ""}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                        <Typography className="absolute top-4 left-4 text-white text-sm bg-red-600/80 px-2 py-1 rounded">▶ YouTube</Typography>
                                                    </div>
                                                ) : memory.type === 'tiktok' ? (
                                                    <div className="w-full h-full relative">
                                                        {memory.thumbnail ? (
                                                            <img
                                                                src={memory.thumbnail}
                                                                alt={memory.caption || ""}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
                                                                {/* TikTok style glowing orbs */}
                                                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#25F4EE] rounded-full blur-3xl opacity-60" />
                                                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FE2C55] rounded-full blur-3xl opacity-60" />
                                                                <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white rounded-full blur-2xl opacity-20" />

                                                                {/* TikTok Logo Style */}
                                                                <div className="relative z-10 flex flex-col items-center text-white">
                                                                    <span className="text-6xl mb-2">♪</span>
                                                                    <span className="font-bold text-lg tracking-wider">TikTok</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                        <Typography className="absolute top-4 left-4 text-white text-sm bg-black/70 px-2 py-1 rounded">🎵 TikTok</Typography>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full relative">
                                                        {/* Loading skeleton - only show if not loaded */}
                                                        {!loadedImages.has(index) && (
                                                            <div className="absolute inset-0 image-loading flex items-center justify-center z-5">
                                                                <div className="text-4xl animate-pulse">💖</div>
                                                            </div>
                                                        )}
                                                        {/* Actual image - hidden until loaded */}
                                                        <img
                                                            src={memory.url}
                                                            alt={memory.caption || ""}
                                                            className={`w-full h-full object-cover memory-image ${loadedImages.has(index) ? 'loaded' : ''}`}
                                                            style={{ position: 'relative', zIndex: loadedImages.has(index) ? 10 : 1 }}
                                                            onLoad={() => handleImageLoaded(index)}
                                                        />
                                                    </div>
                                                )}

                                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-center pointer-events-none">
                                                    <Typography className="text-white font-medium shadow-black drop-shadow-md">
                                                        {memory.caption}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* 🎬 EXTERNAL PLAY BUTTON - Outside Swiper */}
                                {(memories[currentSlideIndex]?.type === 'youtube' ||
                                    memories[currentSlideIndex]?.type === 'tiktok' ||
                                    memories[currentSlideIndex]?.type === 'video') && (
                                        <Button
                                            variant="contained"
                                            onClick={() => handleOpenVideoModal(memories[currentSlideIndex])}
                                            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                            startIcon={<Play size="20" variant="Bold" color="white" />}
                                            sx={{
                                                borderRadius: '50px',
                                                px: 4,
                                                py: 1.5,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                                                animation: 'pulse 2s infinite',
                                            }}
                                        >
                                            ▶ เล่นวิดีโอ
                                        </Button>
                                    )}
                            </div>

                            {/* Bottom Message & Controls */}
                            <div className="w-full max-w-sm text-center pb-4">
                                <Typography variant="h6" className="text-[#8B1D36] font-bold uppercase tracking-widest mb-2" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    {displayContent.subtitle}
                                </Typography>

                                <Paper elevation={0} sx={{ background: "rgba(255,255,255,0.6)", borderRadius: 3, p: 2, backdropFilter: 'blur(4px)' }}>
                                    <Typography variant="body2" className="text-gray-700 whitespace-pre-line" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                        {displayContent.message}
                                    </Typography>
                                    <Typography variant="caption" className="block text-[#D41442] font-bold mt-2">
                                        - {displayContent.signer} -
                                    </Typography>
                                </Paper>
                            </div>

                        </div>
                    )
                }
            </Box >

            {/* 🎬 VIDEO MODAL */}
            {
                activeVideo && (
                    <div
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                        onClick={handleCloseVideoModal}
                    >
                        <button
                            className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors z-[101]"
                            onClick={handleCloseVideoModal}
                        >
                            ✕
                        </button>

                        <div
                            className="bg-black rounded-xl overflow-hidden shadow-2xl w-[85vw] max-w-[360px] h-[85vh] max-h-[640px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {activeVideo.type === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${activeVideo.url}?autoplay=1&mute=${(displayContent.backgroundMusicYoutubeId || displayContent.backgroundMusicUrl) ? 1 : 0}&controls=1&rel=0`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title="YouTube video"
                                    allowFullScreen
                                />
                            ) : activeVideo.type === 'tiktok' ? (
                                <iframe
                                    src={`https://www.tiktok.com/player/v1/${activeVideo.url}?music_info=1&description=1&autoplay=1&mute=${(displayContent.backgroundMusicYoutubeId || displayContent.backgroundMusicUrl) ? 1 : 0}&volume_control=1&loop=1`}
                                    className="w-full h-full"
                                    allow="encrypted-media;"
                                    title="TikTok video"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={activeVideo.url}
                                    className="w-full h-full object-contain"
                                    controls
                                    autoPlay
                                    playsInline
                                    muted={!!(displayContent.backgroundMusicYoutubeId || displayContent.backgroundMusicUrl)}
                                />
                            )}
                        </div>

                        <Typography className="absolute bottom-8 text-white text-center font-medium">
                            {activeVideo.caption}
                        </Typography>
                    </div>
                )
            }
        </>
    );
}
