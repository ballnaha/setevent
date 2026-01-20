"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import { Heart, Music, Play, Pause, Gift, Maximize, CloseCircle } from "iconsax-react";
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
    const [isTransitioning, setIsTransitioning] = useState(false);
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

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMusicStarted, setIsMusicStarted] = useState(false); // New state to trigger music immediately on click

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    }, []);

    // Throttle ref for heart burst effect
    const lastBurstTimeRef = useRef<number>(0);
    const BURST_THROTTLE_MS = 600; // Minimum time between bursts
    const MAX_HEARTS = 15; // Maximum hearts allowed at once (reduced for mobile)

    const triggerHeartBurst = useCallback(() => {
        const now = Date.now();
        if (now - lastBurstTimeRef.current < BURST_THROTTLE_MS) return;
        lastBurstTimeRef.current = now;

        const newHearts = Array.from({ length: 15 }).map((_, i) => ({
            id: now + i,
            left: Math.random() * 100,
            size: Math.random() * 20 + 20,
            duration: Math.random() * 2 + 3,
            delay: Math.random() * 0.5,
        }));

        setBurstHearts(newHearts);
        setTimeout(() => {
            setBurstHearts([]);
        }, 5000);
    }, []);

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

    // Memoize border hearts - reduced count for mobile performance
    const borderHearts = React.useMemo(() => {
        const colors = ["#FF3366", "#FF99AA", "#FF5577", "#D41442"];
        const heartsArr = [];
        // Top border (reduced from 8 to 4)
        for (let i = 0; i < 4; i++) heartsArr.push({ id: `t-${i}`, top: 2, left: 10 + i * 25, size: 22 + Math.random() * 8, rotation: Math.random() * 20 - 10, color: colors[i % 4] });
        // Bottom border (reduced from 8 to 4)
        for (let i = 0; i < 4; i++) heartsArr.push({ id: `b-${i}`, top: 92, left: 10 + i * 25, size: 22 + Math.random() * 8, rotation: Math.random() * 20 - 10, color: colors[i % 4] });
        // Left border (reduced from 10 to 4)
        for (let i = 0; i < 4; i++) heartsArr.push({ id: `l-${i}`, top: 10 + i * 22, left: 2, size: 18 + Math.random() * 8, rotation: Math.random() * 20 - 10, color: colors[i % 4] });
        // Right border (reduced from 10 to 4)
        for (let i = 0; i < 4; i++) heartsArr.push({ id: `r-${i}`, top: 10 + i * 22, left: 90, size: 18 + Math.random() * 8, rotation: Math.random() * 20 - 10, color: colors[i % 4] });
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
        setIsTransitioning(true);

        // 🚀 Auto Fullscreen on Open (Triggered immediately to satisfy user gesture)
        if (typeof document !== 'undefined' && !document.fullscreenElement) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => { /* Silent skip */ });
                setIsFullscreen(true);
            }
        }

        // 🎵 Start background music IMMEDIATELY (Crucial for mobile autoplay)
        if (displayContent.backgroundMusicUrl || displayContent.backgroundMusicYoutubeId) {
            setIsMusicStarted(true);
            setIsMusicPlaying(true);
            setIsMusicMuted(false);

            // For native audio element
            if (musicAudioRef.current) {
                musicAudioRef.current.play().catch(e => console.log("Direct play blocked:", e));
            }
        }

        // Delay the reveal slightly to mask the "black flicker"
        setTimeout(() => {
            setIsOpen(true);

            // Trigger heart burst
            if (typeof triggerHeartBurst === 'function') {
                triggerHeartBurst();
            }

            // Fade out the mask after a short delay
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }, 400); // 400ms is usually enough for the browser to scale
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

    const handleSlideChange = useCallback((swiper: { activeIndex: number }) => {
        // Update current slide index
        setCurrentSlideIndex(swiper.activeIndex);

        // Throttle: prevent burst if too soon after last one
        const now = Date.now();
        if (now - lastBurstTimeRef.current < BURST_THROTTLE_MS) {
            return; // Skip burst, too soon
        }
        lastBurstTimeRef.current = now;

        // Limit total hearts on screen
        setBurstHearts((prev) => {
            // If already at max, don't add more
            if (prev.length >= MAX_HEARTS) {
                return prev;
            }

            // Calculate how many we can add (reduced for mobile performance)
            const availableSlots = MAX_HEARTS - prev.length;
            const count = Math.min(4, availableSlots); // Reduced to 4 hearts per burst

            if (count <= 0) return prev;

            const newHearts = Array.from({ length: count }).map((_, i) => ({
                id: now + i,
                left: 25 + Math.random() * 50,
                size: 14 + Math.random() * 14, // Smaller hearts
                duration: 1 + Math.random() * 0.8, // Faster animation
                delay: Math.random() * 0.2,
            }));

            // Schedule cleanup
            setTimeout(() => {
                setBurstHearts((current) =>
                    current.filter(h => !newHearts.find(nh => nh.id === h.id))
                );
            }, 2000);

            return [...prev, ...newHearts];
        });
    }, []);

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
                    <Typography sx={{ mt: 4, color: '#4A151B', fontWeight: 800, fontFamily: 'cursive', letterSpacing: 2, fontSize: '1.5rem' }}>
                        Preparing your surprise...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: "100dvh",
                width: "100vw",
                background: displayContent.backgroundColor || "#FFF0F3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
                fontFamily: "'Comfortaa', sans-serif",
            }}
        >
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Charm:wght@400;700&display=swap');
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
        @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
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
        
        /* Valentine Swiper - Optimized for Mobile */
        .valentine-swiper {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            perspective: 1200px;
            overflow: visible !important;
        }
        .valentine-swiper .swiper-wrapper {
            overflow: visible !important;
        }
        .valentine-swiper .swiper-slide {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            /* Let Swiper handle transitions for native feel */
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);
            overflow: visible !important;
            border-radius: 16px !important;
            background: white;
            border: 6px solid white;
        }
        .valentine-swiper .swiper-slide-active {
            box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.25);
        }
        /* Next slides: darker appearance using brightness filter (not opacity) */
        .valentine-swiper .swiper-slide-next {
            filter: brightness(0.85);
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
        }
        .valentine-swiper .swiper-slide-next + .swiper-slide {
            filter: brightness(0.7);
            box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.25);
        }
        .valentine-swiper .swiper-slide img {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        /* Inner content wrapper */
        .valentine-swiper .slide-content {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 10px;
            position: relative;
        }
        
        /* Smooth image reveal - only transition on first load */
        .memory-image {
            opacity: 0;
        }
        .memory-image.loaded {
            opacity: 1;
            /* No transition after loaded to prevent flicker on swipe back */
        }
        
        html, body {
            background-color: #FFF0F3;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        /* Continuous Transition Mask */
        .fullscreen-mask {
            position: fixed;
            inset: 0;
            background: #FFF0F3;
            z-index: 9999;
            display: flex;
            items-center;
            justify-content: center;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .fullscreen-mask.active {
            opacity: 1;
        }
        
        /* Swiper Bullet Styles */
        .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            background: rgba(255, 255, 255, 0.5) !important;
            opacity: 1 !important;
            border-radius: 50% !important;
            transition: all 0.3s ease !important;
            margin: 0 4px !important;
        }
        .swiper-pagination-bullet-active {
            width: 20px !important;
            height: 8px !important;
            background: #D32F2F !important;
            border-radius: 4px !important;
        }

        /* Caption Animation */
        @keyframes captionFadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-5px); }
        }
        .animate-caption-fade {
            animation: captionFadeInOut 5s ease-out forwards;
        }
        @keyframes heartPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
        }
        .romantic-text {
            font-family: 'Dancing Script', 'Charm', cursive;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255, 182, 193, 0.4);
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .elegant-caption-box {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
            border-left: 2px solid rgba(255, 182, 193, 0.5);
            border-right: 2px solid rgba(255, 182, 193, 0.5);
            transform: rotate(-1.5deg);
        }
        @keyframes music-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes music-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 4px 25px rgba(255, 51, 102, 0.5); }
        }
        .music-playing {
            animation: music-pulse 2s ease-in-out infinite;
        }
        .music-icon-spin {
            animation: music-spin 4s linear infinite;
        }
        @keyframes petal-fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
        }
        .petal {
            position: absolute;
            background: #FFCDD2;
            border-radius: 150% 0 150% 0;
            z-index: 1;
            pointer-events: none;
        }
        @keyframes radiant-pulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 51, 102, 0.4)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 30px rgba(255, 51, 102, 0.8)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 51, 102, 0.4)); }
        }
        .radiant-heart {
            animation: radiant-pulse 2s ease-in-out infinite;
        }
      `}</style>

            {/* 🎭 Love Transition Mask */}
            <div className={`fullscreen-mask flex flex-col items-center justify-center overflow-hidden ${isTransitioning ? 'active' : ''}`}>
                {/* Visual Petals falling */}
                {isTransitioning && Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="petal"
                        style={{
                            width: Math.random() * 15 + 10 + 'px',
                            height: Math.random() * 15 + 10 + 'px',
                            left: Math.random() * 100 + '%',
                            top: '-20px',
                            animation: `petal-fall ${Math.random() * 3 + 2}s linear infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0,
                            background: i % 2 === 0 ? '#FF3366' : '#FFCDD2',
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}
                    />
                ))}

                <div className="radiant-heart mb-6 z-10">
                    <Heart size="80" variant="Bold" color="#FF3366" />
                </div>
                <Typography
                    variant="h5"
                    className="text-[#8B1D36] font-bold tracking-[0.4em] z-10"
                    sx={{
                        fontFamily: 'Dancing Script',
                        textShadow: '0 0 20px rgba(255,255,255,0.8)',
                        animation: 'fadeIn 1s ease-out'
                    }}
                >
                    PREPARING LOVE...
                </Typography>
            </div>

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
            {/* Native Audio (MP3) - Preloaded but paused */}
            {displayContent.backgroundMusicUrl && (
                <audio
                    ref={musicAudioRef}
                    src={displayContent.backgroundMusicUrl}
                    loop
                    playsInline
                    preload="auto"
                    style={{ display: 'none' }}
                />
            )}

            {/* YouTube Audio - Triggered immediately on click (not waiting for isOpen) */}
            {isMusicStarted && !displayContent.backgroundMusicUrl && displayContent.backgroundMusicYoutubeId && (
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

            {/*  Controls (Right Side: Music) */}
            {isOpen && (
                <div className="fixed right-5 z-[60] flex flex-col gap-3" style={{ top: 'calc(1.25rem + env(safe-area-inset-top))' }}>
                    {(displayContent.backgroundMusicUrl || displayContent.backgroundMusicYoutubeId) && (
                        <button
                            onClick={toggleMusic}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${!isMusicMuted ? 'music-playing' : ''}`}
                            style={{
                                background: isMusicMuted
                                    ? 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)'
                                    : 'linear-gradient(135deg, #FF99AC 0%, #FF3366 100%)',
                                border: '3px solid white',
                                boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                            }}
                        >
                            <div className={`relative flex items-center justify-center ${!isMusicMuted ? 'music-icon-spin' : ''}`}>
                                <Music
                                    size="20"
                                    variant={isMusicMuted ? "Linear" : "Bold"}
                                    color={isMusicMuted ? "#9ca3af" : "white"}
                                />
                                {isMusicMuted && (
                                    <div className="absolute w-full h-[2px] bg-gray-400 rotate-45 rounded-full" />
                                )}
                            </div>
                        </button>
                    )}
                </div>
            )}

            {/* 🔳 Controls (Left Side: Fullscreen) */}
            {isOpen && (
                <div className="fixed left-5 z-[60]" style={{ top: 'calc(1.25rem + env(safe-area-inset-top))' }}>
                    <button
                        onClick={toggleFullscreen}
                        className="group w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 overflow-hidden"
                        style={{
                            background: isFullscreen
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            boxShadow: '0 4px 15px -1px rgba(0,0,0,0.1)',
                        }}
                    >
                        {/* Subtle Background Glow */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {isFullscreen ? (
                            <div className="relative transform rotate-180 transition-transform duration-500 opacity-60 group-hover:opacity-100">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 3V9H2M16 3V9H22M8 21V15H2M16 21V15H22" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ) : (
                            <div className="relative transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 9V2H9M15 2H22V9M2 15V22H9M15 22H22V15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </button>
                </div>
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

                    {/* Top Logo - Centered Header Style (Aligned with icons) */}

                    {/* Top Spacer - Reduced to pull content up on mobile */}
                    <div className="h-10 flex-none" />

                    {/* Middle: Gift Box & Title */}
                    <div className="flex flex-col items-center justify-center cursor-pointer group transform transition-transform duration-300 active:scale-95">

                        {/* Floating Lid - Slightly smaller for mobile optimization */}
                        <div className="relative w-40 h-12 bg-[#D32F2F] rounded-t-lg shadow-xl mb-3 animate-[float-lid_3s_ease-in-out_infinite]">
                            {/* Ribbon H */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full bg-[#FF8A80]" />
                            {/* Bow */}
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-end">
                                <div className="w-7 h-7 bg-[#FF8A80] rounded-tl-full rounded-bl-full mr-1" />
                                <div className="w-3.5 h-3.5 bg-[#FF5252] rounded-full z-10" />
                                <div className="w-7 h-7 bg-[#FF8A80] rounded-tr-full rounded-br-full ml-1" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-center py-4 z-20">
                            <Typography variant="overline" className="text-gray-700 tracking-[0.3em] font-bold">
                                HAPPY
                            </Typography>
                            <Typography variant="h3" className="text-[#6D2128] font-bold" sx={{ fontFamily: 'Dancing Script' }}>
                                {displayContent.title}
                            </Typography>
                        </div>

                        {/* Box Body - Slightly smaller */}
                        <div className="relative w-32 h-28 bg-[#E53935] shadow-2xl skew-x-1">
                            {/* Ribbon V */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full bg-[#FF8A80]" />
                            {/* Ribbon H */}
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-6 bg-[#FF8A80]" />
                            {/* Side Shadow */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[0px] border-r-[12px] border-r-[#B71C1C] border-b-[112px] border-b-transparent opacity-50" />
                        </div>

                        {/* Interactive Hint - Tighter margin */}
                        <div className="mt-4 mb-2 animate-[bounce_2s_infinite] opacity-60">
                            <Typography className="text-[#6D2128] text-[0.7rem] font-medium tracking-[.4em] uppercase flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse" />
                                {displayContent.openingText || "Tap to open your surprise"}
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse" />
                            </Typography>
                        </div>

                    </div>

                    {/* Footer White Area - Redesigned for Premium Look */}
                    <div className="w-full bg-white/95 backdrop-blur-sm mt-auto pt-6 pb-12 px-8 rounded-t-[2.5rem] text-center shadow-[0_-15px_50px_rgba(211,47,47,0.15)] flex flex-col items-center border-t border-red-50/50 relative">
                        {/* Slogan with Elegant Typography - Optimized Size for Mobile */}
                        <div className="flex flex-col items-center">
                            <Typography className="text-[#D32F2F] font-black text-2xl tracking-[0.2em] leading-none mb-1 opacity-90" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                LOVE
                            </Typography>
                            <div className="flex items-center gap-3 w-full justify-center opacity-70">
                                <div className="h-[1px] w-6 bg-[#D32F2F]" />
                                <Typography className="text-[#6D2128] text-[0.6rem] tracking-[0.3em] font-bold uppercase">
                                    Is In The
                                </Typography>
                                <div className="h-[1px] w-6 bg-[#D32F2F]" />
                            </div>
                            <Typography className="text-[#D32F2F] font-black text-3xl tracking-[0.1em] leading-none mt-2" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                AIR
                            </Typography>
                        </div>

                        {/* Logo at Bottom Right */}
                        <div className="absolute bottom-4 right-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                            <img
                                src="/images/logo1.png"
                                alt="SetEvent Logo"
                                className="h-6 w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 🌹 MAIN CONTENT (Stable Layout) */}
            {isOpen && (
                <>
                    {/* 🏆 Header Section (Fixed outside the animated container to prevent jumping) */}
                    <div className="fixed left-0 right-0 text-center z-[70] pointer-events-none px-16" style={{ top: 'calc(1.25rem + env(safe-area-inset-top))' }}>
                        <Typography variant="h6" className="text-[#FFD7E0] font-bold tracking-wider" sx={{ fontFamily: 'cursive', lineHeight: 1.5, fontSize: '1.2rem' }}>
                            {displayContent.greeting?.split(' ')[0] || "Happy"}
                        </Typography>
                        <Typography variant="subtitle1" className="text-white font-black tracking-widest uppercase drop-shadow-sm" sx={{ fontFamily: 'var(--font-prompt)', lineHeight: 1, fontSize: '1rem' }}>
                            {displayContent.greeting?.split(' ').slice(1).join(' ') || "VALENTINE"}
                        </Typography>
                    </div>

                    <div className="w-full h-full flex flex-col items-center z-10 animate-[fadeIn_0.8s_ease-out] overflow-hidden relative">
                        <div className="w-full h-full flex flex-col items-center justify-between pt-2 pb-6 overflow-hidden">
                            {/* 1. Header Guard (Top Section) */}
                            <div className="w-full h-[10dvh] min-h-[70px] flex-none" />

                            {/* 2. Flexible Body (Middle Section - The Heart of the card) */}
                            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative px-4" style={{ top: '-30px' }}>
                                <div className="relative w-full flex justify-center items-center">
                                    <Swiper
                                        effect={"creative"}
                                        grabCursor={true}
                                        modules={[EffectCreative, Pagination, Autoplay]}
                                        className="valentine-swiper w-[310px] h-[55dvh] sm:w-[380px] sm:h-[65dvh] max-h-[600px]"
                                        pagination={{ clickable: true, dynamicBullets: true }}
                                        onSlideChange={handleSlideChange}
                                        speed={800}
                                        touchRatio={1}
                                        touchAngle={45}
                                        shortSwipes={true}
                                        longSwipes={true}
                                        longSwipesRatio={0.2}
                                        longSwipesMs={80}
                                        followFinger={true}
                                        threshold={3}
                                        touchStartPreventDefault={false}
                                        touchMoveStopPropagation={true}
                                        resistance={true}
                                        resistanceRatio={0.7}
                                        watchSlidesProgress={true}
                                        observer={true}
                                        observeParents={true}
                                        creativeEffect={{
                                            prev: {
                                                translate: ['-120%', 0, -300],
                                                rotate: [0, 0, -5],
                                                scale: 0.8,
                                                opacity: 0,
                                            },
                                            next: {
                                                translate: ['10px', '12px', -80],
                                                rotate: [0, 0, 2],
                                                scale: 0.92,
                                                opacity: 0.4,
                                            },
                                            perspective: true,
                                            limitProgress: 4,
                                            progressMultiplier: 1.2,
                                            shadowPerProgress: true,
                                        }}
                                    >
                                        {memories.map((memory, index) => (
                                            <SwiperSlide key={index}>
                                                {({ isActive }) => (
                                                    <div className="slide-content">
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
                                                                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#25F4EE] rounded-full blur-3xl opacity-60" />
                                                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FE2C55] rounded-full blur-3xl opacity-60" />
                                                                        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white rounded-full blur-2xl opacity-20" />
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
                                                                {!loadedImages.has(index) && (
                                                                    <div className="absolute inset-0 image-loading flex items-center justify-center" style={{ zIndex: 5 }}>
                                                                        <div className="text-4xl animate-pulse">💖</div>
                                                                    </div>
                                                                )}
                                                                <img
                                                                    src={memory.url}
                                                                    alt={memory.caption || ""}
                                                                    className="w-full h-full object-cover"
                                                                    style={{
                                                                        position: 'relative',
                                                                        zIndex: 10,
                                                                        opacity: loadedImages.has(index) ? 1 : 0
                                                                    }}
                                                                    onLoad={() => handleImageLoaded(index)}
                                                                />
                                                            </div>
                                                        )}

                                                        {memory.caption && isActive && (
                                                            <div className="absolute bottom-12 left-0 right-0 px-6 z-30 pointer-events-none">
                                                                <div className="animate-caption-fade flex flex-col items-center">
                                                                    <div className="mb-2" style={{ animation: 'heartPulse 1.5s ease-in-out infinite' }}>
                                                                        <Heart variant="Bold" color="#FF3366" size="24" style={{ filter: 'drop-shadow(0 0 5px #FF3366)' }} />
                                                                    </div>
                                                                    <div className="px-8 py-4 elegant-caption-box backdrop-blur-md rounded-lg shadow-xl relative">
                                                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-lg pointer-events-none" />
                                                                        <Typography
                                                                            variant="h5"
                                                                            className="romantic-text text-white text-center leading-relaxed"
                                                                            style={{ fontSize: '1.8rem' }}
                                                                        >
                                                                            {memory.caption}
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                                    </div>
                                                )}
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* 🎬 FLOATING PLAY BUTTON */}
                                    {(memories[currentSlideIndex]?.type === 'youtube' ||
                                        memories[currentSlideIndex]?.type === 'tiktok' ||
                                        memories[currentSlideIndex]?.type === 'video') && (
                                            <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 z-20">
                                                <button
                                                    onClick={() => handleOpenVideoModal(memories[currentSlideIndex])}
                                                    className="group relative flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                                    style={{ boxShadow: '0 8px 30px rgba(211, 47, 47, 0.3)' }}
                                                >
                                                    <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30" />
                                                    <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 rounded-full">
                                                        <Play size="16" variant="Bold" color="white" />
                                                    </span>
                                                    <span className="font-bold text-gray-800 text-sm pr-1">เล่นวิดีโอ</span>
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* 3. Message Footer (Bottom Section) */}
                            <div className="w-full max-w-sm text-center pt-4 pb-8 px-6 flex-none z-[50] relative" style={{ top: '20px' }}>
                                <Typography variant="h6" className="text-[#8B1D36] font-bold uppercase tracking-widest mb-2" sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                    {displayContent.subtitle}
                                </Typography>

                                <Paper elevation={0} sx={{
                                    background: "rgba(255,255,255,0.7)",
                                    borderRadius: "18px",
                                    p: 2,
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.5)',
                                    boxShadow: '0 8px 32px -4px rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="body2" className="text-gray-700 whitespace-pre-line leading-relaxed" sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem' }}>
                                        {displayContent.message}
                                    </Typography>
                                    <Typography variant="caption" className="block text-[#D41442] font-extrabold mt-2 tracking-wider">
                                        - {displayContent.signer} -
                                    </Typography>
                                </Paper>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* 🎬 VIDEO MODAL - Premium UI */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(20,0,10,0.98) 100%)',
                    }}
                >
                    {/* Romantic glow effects */}
                    <div className="absolute top-20 left-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Header with close button */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[102]">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">💕</span>
                            <span className="text-white/80 text-sm font-medium">Video Memory</span>
                        </div>
                        <button
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                            onClick={handleCloseVideoModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Video Container */}
                    <div
                        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease-out]"
                        style={{
                            width: 'min(90vw, 380px)',
                            height: 'min(80vh, 680px)',
                            boxShadow: '0 25px 80px -20px rgba(255, 100, 150, 0.3), 0 0 60px rgba(0,0,0,0.5)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Video type badge */}
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                            style={{
                                background: activeVideo?.type === 'youtube'
                                    ? 'linear-gradient(135deg, #FF0000, #CC0000)'
                                    : activeVideo?.type === 'tiktok'
                                        ? 'linear-gradient(135deg, #25F4EE, #FE2C55)'
                                        : 'linear-gradient(135deg, #FF6B6B, #D32F2F)'
                            }}
                        >
                            {activeVideo?.type === 'youtube' ? '▶ YouTube' : activeVideo?.type === 'tiktok' ? '♪ TikTok' : '🎬 Video'}
                        </div>

                        {activeVideo?.type === 'youtube' ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${activeVideo?.url}?autoplay=1&mute=${(displayContent.backgroundMusicYoutubeId || displayContent.backgroundMusicUrl) ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title="YouTube video"
                                allowFullScreen
                            />
                        ) : activeVideo?.type === 'tiktok' ? (
                            <iframe
                                src={`https://www.tiktok.com/player/v1/${activeVideo?.url}?music_info=1&description=1&autoplay=1&mute=${(displayContent.backgroundMusicYoutubeId || displayContent.backgroundMusicUrl) ? 1 : 0}&volume_control=1&loop=1`}
                                className="w-full h-full"
                                allow="encrypted-media;"
                                title="TikTok video"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={activeVideo?.url}
                                className="w-full h-full object-contain bg-black"
                                controls
                                autoPlay
                                playsInline
                                muted={!!(displayContent.backgroundMusicYoutubeId || displayContent.backgroundMusicUrl)}
                            />
                        )}
                    </div>

                    {/* Caption at bottom */}
                    {activeVideo?.caption && (
                        <div className="absolute bottom-6 left-4 right-4 text-center">
                            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl">
                                <Typography className="text-white font-medium text-sm">
                                    {activeVideo?.caption}
                                </Typography>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Box>
    );
}
