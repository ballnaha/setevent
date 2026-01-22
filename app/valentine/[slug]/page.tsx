"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
    const [hasSwiped, setHasSwiped] = useState(false); // Track if user has swiped at least once
    // Initialize without 0, so even the first slide technically is "new" until we leave it, 
    // though usually handled by initial render. Keeping it empty is safer for animation logic.
    const [seenSlides, setSeenSlides] = useState<Set<number>>(new Set());

    // 🎭 Swiper Creative Effect Configuration (Memoized at top level for Hooks rules)
    const swiperCreativeConfig = useMemo(() => ({
        prev: {
            translate: ['-120%', 0, -300],
            rotate: [0, 0, -5],
            scale: 0.8,
            opacity: 0,
        },
        next: {
            translate: ['25px', '20px', -100],
            rotate: [0, 0, 5],
            scale: 0.94,
            opacity: 0.6,
        },
        perspective: true,
        limitProgress: 4,
        progressMultiplier: 1.2,
        shadowPerProgress: true,
    }), []);

    // Background Music State
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isMusicMuted, setIsMusicMuted] = useState(false);
    const musicPlayerRef = React.useRef<HTMLIFrameElement>(null);
    const musicAudioRef = React.useRef<HTMLAudioElement>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMusicStarted, setIsMusicStarted] = useState(false); // New state to trigger music immediately on click
    const [countdown, setCountdown] = useState<number | null>(null);

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
        // 🎵 Start background music IMMEDIATELY (Crucial for mobile autoplay)
        // Move this to the very top of the interaction to ensure user gesture propagation
        if (displayContent.backgroundMusicUrl || displayContent.backgroundMusicYoutubeId) {
            setIsMusicStarted(true);
            setIsMusicPlaying(true);
            setIsMusicMuted(false);

            // For native audio element
            if (musicAudioRef.current) {
                musicAudioRef.current.muted = false;
                musicAudioRef.current.play().catch(e => console.log("Direct play blocked:", e));
            }
        }

        setIsTransitioning(true);
        setCountdown(3);

        // 🚀 Auto Fullscreen on Open (Triggered immediately to satisfy user gesture)
        if (typeof document !== 'undefined' && !document.fullscreenElement) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => { /* Silent skip */ });
                setIsFullscreen(true);
            }
        }

        // 🕒 Countdown Logic
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(timer);

                    // Final transition to open
                    setTimeout(() => {
                        setIsOpen(true);
                        setCountdown(null);

                        // Trigger heart burst
                        if (typeof triggerHeartBurst === 'function') {
                            triggerHeartBurst();
                        }

                        // Fade out the mask after a short delay
                        setTimeout(() => {
                            setIsTransitioning(false);
                        }, 300);
                    }, 800);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
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

    // 📱 Handle Page Visibility (Stop music when user minimize line or switch app)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // Pause music when page is not visible
                if (musicAudioRef.current) {
                    musicAudioRef.current.pause();
                }
                // For YouTube, we might need to clear the src temporarily or just let it be 
                // but usually browsers handle iframe audio better than native audio on visibility
            } else if (document.visibilityState === 'visible') {
                // Resume if it was playing before
                if (isOpen && isMusicPlaying && !isMusicMuted) {
                    if (musicAudioRef.current) {
                        musicAudioRef.current.play().catch(e => console.log("Resume play blocked:", e));
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isOpen, isMusicPlaying, isMusicMuted]);

    // Pause music when video modal opens
    const handleOpenVideoModal = (memory: any) => {
        setActiveVideo(memory);
        // Note: The hidden YouTube player will continue but video takes audio focus
    };

    const handleCloseVideoModal = () => {
        setActiveVideo(null);
    };

    const handleSlideChange = useCallback((swiper: any) => {
        const activeIndex = swiper.activeIndex;
        const previousIndex = swiper.previousIndex;

        // Update current slide index only if changed
        setCurrentSlideIndex(activeIndex);

        // Mark the PREVIOUS slide as seen (so when we come back, it's clear)
        // We don't mark the CURRENT one yet, so the mystery animation can play!
        setSeenSlides(prev => {
            if (prev.has(previousIndex)) return prev;
            const next = new Set(prev);
            next.add(previousIndex);
            return next;
        });

        // Mark as swiped to hide the hint
        if (activeIndex > 0) {
            setHasSwiped(true);
        }

        // Throttle: prevent burst if too soon after last one
        const now = Date.now();
        if (now - lastBurstTimeRef.current < BURST_THROTTLE_MS) {
            return;
        }
        lastBurstTimeRef.current = now;

        setBurstHearts((prev) => {
            if (prev.length >= MAX_HEARTS) return prev;

            const count = Math.min(4, MAX_HEARTS - prev.length);
            if (count <= 0) return prev;

            const newHearts = Array.from({ length: count }).map((_, i) => ({
                id: now + i,
                left: 25 + Math.random() * 50,
                size: 14 + Math.random() * 14,
                duration: 1 + Math.random() * 0.8,
                delay: Math.random() * 0.2,
            }));

            setTimeout(() => {
                setBurstHearts((current) =>
                    current.filter(h => !newHearts.find(nh => nh.id === h.id))
                );
            }, 2000);

            return [...prev, ...newHearts];
        });
    }, [hasSwiped]); // Added hasSwiped dependency

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
                    <Typography sx={{
                        mt: 4,
                        color: '#4A151B',
                        fontWeight: 700,
                        fontFamily: "'Dancing Script', cursive",
                        letterSpacing: '0.15em',
                        fontSize: '1.3rem',
                        textAlign: 'center',
                        textTransform: ''
                    }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Charm:wght@400;700&family=Mali:ital,wght@0,400;0,700;1,400&family=Sriracha&display=swap');
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
        @keyframes countdown-pop {
            0% { transform: scale(0.5) rotate(-10deg); opacity: 0; filter: blur(10px); }
            50% { transform: scale(1.4) rotate(5deg); opacity: 0.8; filter: blur(0px); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes aurora-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 51, 102, 0.4), 0 0 40px rgba(255, 51, 102, 0.2); }
            50% { box-shadow: 0 0 50px rgba(255, 51, 102, 0.8), 0 0 100px rgba(255, 51, 102, 0.4); }
        }
        @keyframes heart-beat-scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        @keyframes swipeHint {
            0% { transform: translateX(60px); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateX(-60px); opacity: 0; }
        }
        @keyframes heart-float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-5px) rotate(5deg); }
        }
        @keyframes heart-beat-glow {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,255,255,0.4)); }
            50% { transform: scale(1.2); filter: drop-shadow(0 0 20px rgba(255,255,255,0.8)); }
        }
        @keyframes ring-spread {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes text-shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes letter-pop {
            0%, 100% { transform: translateY(0); opacity: 0.6; }
            50% { transform: translateY(-3px); opacity: 1; text-shadow: 0 0 8px white; }
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
        @keyframes subtle-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes intro-heart-drift {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            15% { opacity: 0.6; }
            85% { opacity: 0.6; }
            100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        .intro-glow-bg {
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 240, 243, 0) 70%);
        }
        .shimmer-text {
            background: linear-gradient(90deg, #6D2128 0%, #D32F2F 25%, #6D2128 50%, #D32F2F 75%, #6D2128 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fillColor: transparent;
            animation: text-shine 4s linear infinite;
        }
        @keyframes aura-ripple {
            0% { transform: scale(0.8); opacity: 0.6; }
            100% { transform: scale(1.8); opacity: 0; }
        }
        .aura-ring {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(211, 47, 47, 0.3);
            animation: aura-ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Music Visualizer */
        @keyframes music-bar {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
        }
        .music-bar {
            width: 3px;
            background-color: white;
            border-radius: 2px;
            animation: music-bar 0.8s ease-in-out infinite;
        }
        
        /* Card Premium Shine */
        @keyframes shine-sweep {
            0% { transform: translateX(-200%) skewX(-30deg); }
            100% { transform: translateX(200%) skewX(-30deg); }
        }
        .card-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(255, 255, 255, 0) 100%
            );
            z-index: 15;
            pointer-events: none;
        }
        .animate-shine {
            animation: shine-sweep 2.5s ease-in-out infinite;
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
        .fullscreen-mask {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
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

        /* Simple Fade Up Animation - High Performance */
        @keyframes simpleFadeUp {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes text-glow-reveal {
            0%, 15% { color: transparent; text-shadow: 0 0 20px #fff; letter-spacing: 2px; }
            35% { color: rgba(255,255,255,1); text-shadow: 0 0 5px #fff; letter-spacing: 0.5px; }
            45%, 98% { color: #fff; text-shadow: 2px 2px 10px rgba(0,0,0,0.3); letter-spacing: 0.5px; }
            100% { color: transparent; }
        }
        .animate-caption-mystery {
            animation: captionMysteryReveal 16s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .mystery-text-emergence {
            animation: text-glow-reveal 16s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        
        /* Media (Photo/Video) Mystery Reveal - Low Blur Optimized */
        /* Media Mystery Reveal - Opacity Veil Technique (Zero Lag) */
        @keyframes veilFadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        .mystery-veil {
            position: absolute;
            inset: 0;
            background-color: white; 
            z-index: 20;
            pointer-events: none;
            will-change: opacity;
            backface-visibility: hidden;
        }
        .animate-veil-reveal {
            animation: veilFadeOut 2.0s ease-in-out forwards;
        }
        
        .caption-fade-up {
            animation: simpleFadeUp 0.8s ease-out forwards;
            will-change: opacity, transform;
            backface-visibility: hidden;
        }
        @keyframes heartPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
        }
        .romantic-text {
            font-family: 'Dancing Script', 'Mali', 'Charm', cursive;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(255, 182, 193, 0.4);
            font-weight: 700;
            letter-spacing: 0.2px;
        }
        .elegant-caption-box {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
            <div
                className={`fullscreen-mask flex flex-col items-center justify-center overflow-hidden ${isTransitioning ? 'active' : ''}`}
                style={{
                    background: displayContent.backgroundColor || "#FFF0F3",
                    pointerEvents: isTransitioning ? 'auto' : 'none'
                }}
            >
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

                {countdown !== null && (
                    <div className="relative flex items-center justify-center">
                        {/* Aurora Background for the number - Enlarged for better blending */}
                        <div className="absolute inset-0 w-64 h-64 bg-[#FF3366]/10 rounded-full blur-[80px] animate-pulse -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

                        <Typography
                            key={countdown}
                            className="text-[#FF3366] font-black z-20"
                            sx={{
                                fontSize: countdown === 0 ? '8rem' : '7.5rem',
                                fontFamily: "'Dancing Script', cursive",
                                textShadow: '0 0 40px rgba(255, 51, 102, 0.3)',
                                lineHeight: 1,
                                animation: 'countdown-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                                transformOrigin: 'center center',
                            }}
                        >
                            {countdown > 0 ? countdown : "❤️"}
                        </Typography>
                    </div>
                )}
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
                    muted={false}
                    style={{
                        position: 'fixed',
                        top: -100,
                        left: -100,
                        width: 1,
                        height: 1,
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: -1
                    }}
                />
            )}

            {/* YouTube Audio - Triggered immediately on click (not waiting for isOpen) */}
            {/* Always render if ID exists but only set SRC when started to improve mobile reliability */}
            {displayContent.backgroundMusicYoutubeId && !displayContent.backgroundMusicUrl && (
                <iframe
                    ref={musicPlayerRef}
                    src={isMusicStarted ? `https://www.youtube.com/embed/${displayContent.backgroundMusicYoutubeId}?autoplay=1&mute=${isMusicMuted ? 1 : 0}&loop=1&playlist=${displayContent.backgroundMusicYoutubeId}&controls=0` : ''}
                    allow="autoplay; encrypted-media"
                    style={{
                        position: 'fixed',
                        top: -100,
                        left: -100,
                        width: 1,
                        height: 1,
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
                                {isMusicMuted ? (
                                    <div className="absolute w-full h-[2px] bg-gray-400 rotate-45 rounded-full" />
                                ) : (
                                    /* Active Music Visualizer Bars */
                                    <div className="absolute -right-6 flex items-end gap-[2px] h-4">
                                        <div className="music-bar" style={{ animationDelay: '0s' }} />
                                        <div className="music-bar" style={{ animationDelay: '0.2s', height: '12px' }} />
                                        <div className="music-bar" style={{ animationDelay: '0.4s', height: '8px' }} />
                                    </div>
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
                <div className="w-full h-full flex flex-col justify-start items-center z-10 relative overflow-hidden" onClick={handleOpen}>

                    {/* Top Logo - Centered Header Style (Aligned with icons) */}

                    {/* Top Guard - Reduced for better fit on smaller screens */}
                    <div className="flex-none" style={{ height: 'calc(3.5rem + env(safe-area-inset-top))' }} />

                    {/* Middle: Gift Box & Title - Centered in flexible space */}
                    <div className="flex-grow w-full flex flex-col items-center justify-center overflow-visible">

                        {/* Background Ambient Hearts - Improved Visibility */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="absolute opacity-0" style={{
                                    left: `${(i * 10) + (Math.random() * 5)}%`,
                                    bottom: '-10%',
                                    animation: `intro-heart-drift ${12 + (i % 5) * 3}s linear infinite`,
                                    animationDelay: `${i * 1.5}s`
                                }}>
                                    <Heart
                                        size={18 + (i % 4) * 8}
                                        variant={(i % 2 === 0) ? "Bold" : "Bulk"}
                                        color={i % 3 === 0 ? "#FF3366" : i % 3 === 1 ? "#FF99AC" : "#D32F2F"}
                                        style={{ filter: 'drop-shadow(0 0 10px rgba(255,51,102,0.2))' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Radial Glow behind the box */}
                        <div className="absolute w-[300px] h-[300px] intro-glow-bg rounded-full blur-3xl opacity-60 pointer-events-none" />

                        <div className="flex flex-col items-center justify-center cursor-pointer group transform transition-all duration-500 active:scale-90 hover:scale-105 overflow-visible animate-[subtle-float_4s_ease-in-out_infinite]">

                            {/* Floating Lid */}
                            <div className="relative w-44 h-14 bg-[#D32F2F] rounded-t-xl shadow-2xl mb-3 animate-[float-lid_3s_ease-in-out_infinite] z-30">
                                {/* Ribbon H */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-[#FF8A80] shadow-inner" />
                                {/* Bow - More Detailed */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-end">
                                    <div className="w-10 h-10 bg-[#FF8A80] rounded-tl-[80%] rounded-bl-[20%] mr-1 shadow-lg transform -rotate-12 border-b-2 border-red-600/20" />
                                    <div className="w-5 h-5 bg-[#FF5252] rounded-full z-10 shadow-md border-2 border-white/20" />
                                    <div className="w-10 h-10 bg-[#FF8A80] rounded-tr-[80%] rounded-br-[20%] ml-1 shadow-lg transform rotate-12 border-b-2 border-red-600/20" />
                                </div>
                            </div>

                            {/* Text Area */}
                            <div className="text-center py-4 z-40 relative">
                                <Typography variant="overline" className="text-red-800/60 tracking-[0.5em] font-black text-[0.65rem]">
                                    SPECIAL DELIVERY
                                </Typography>
                                <Typography variant="h2" className="shimmer-text font-bold drop-shadow-sm" sx={{ fontFamily: 'Dancing Script', fontSize: '3rem' }}>
                                    {displayContent.title}
                                </Typography>
                            </div>

                            {/* Box Body */}
                            <div className="relative w-36 h-32 bg-[#E53935] shadow-[0_20px_50px_rgba(183,28,28,0.4)] rounded-b-lg overflow-hidden">
                                {/* Inner Shadow */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                                {/* Ribbon V */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-[#FF8A80] shadow-md" />
                                {/* Ribbon H */}
                                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-8 bg-[#FF8A80] shadow-sm" />

                                {/* Sparkles on Box */}
                                <div className="absolute top-2 left-4 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
                                <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-700" />
                            </div>

                            {/* Interactive Hint - Minimalist Ripple Aura Design */}
                            <div className="mt-8 mb-4 relative flex flex-col items-center">
                                {/* Expanding Aura Rings */}
                                <div className="aura-ring w-16 h-16" style={{ animationDelay: '0s' }} />
                                <div className="aura-ring w-16 h-16" style={{ animationDelay: '0.6s' }} />
                                <div className="aura-ring w-16 h-16" style={{ animationDelay: '1.2s' }} />

                                <div className="relative z-10 flex flex-col items-center gap-2 group/hint opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="bg-white/60 p-2 rounded-full backdrop-blur-md shadow-sm">
                                        <Heart size={20} variant="Bold" color="#D32F2F" className="animate-pulse" />
                                    </div>
                                    <Typography
                                        className="text-[#6D2128] font-bold tracking-[0.6em] text-[0.7rem] uppercase text-center"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            textShadow: '0 0 10px rgba(255,255,255,0.8)'
                                        }}
                                    >
                                        {displayContent.openingText || "Tap to open"}
                                    </Typography>
                                    <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#D32F2F]/40 to-transparent mt-1" />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Footer White Area - Adjusted for Small Screens */}
                    <div className="w-full bg-white/95 backdrop-blur-xl mt-auto pt-5 px-8 rounded-t-[2.5rem] text-center shadow-[0_-15px_50px_rgba(211,47,47,0.12)] flex flex-col items-center border-t border-red-50/30 relative"
                        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
                        {/* Slogan - More Compact */}
                        <div className="flex flex-col items-center">
                            <Typography className="text-[#D32F2F] font-black text-xl tracking-[0.2em] leading-none mb-1 opacity-90" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                LOVE
                            </Typography>
                            <div className="flex items-center gap-3 w-full justify-center opacity-60 scale-90">
                                <div className="h-[1px] w-5 bg-[#D32F2F]" />
                                <Typography className="text-[#6D2128] text-[0.55rem] tracking-[0.3em] font-bold uppercase">
                                    Is In The
                                </Typography>
                                <div className="h-[1px] w-5 bg-[#D32F2F]" />
                            </div>
                            <Typography className="text-[#D32F2F] font-black text-2xl tracking-[0.1em] leading-none mt-1" sx={{ fontFamily: 'var(--font-prompt)' }}>
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
                        <div className="w-full h-full flex flex-col items-center justify-between overflow-hidden">
                            {/* 1. Header Guard (Top Section) - Consistent with Fixed Header */}
                            <div className="w-full flex-none" style={{ height: 'calc(4.2rem + env(safe-area-inset-top))' }} />

                            {/* 2. Flexible Body (Middle Section - The Heart of the card) */}
                            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative px-4">
                                <div className="relative w-full flex justify-center items-center">
                                    <Swiper
                                        effect={"creative"}
                                        grabCursor={true}
                                        modules={[EffectCreative, Pagination, Autoplay]}
                                        className="valentine-swiper w-[310px] h-[60dvh] sm:w-[380px] sm:h-[75dvh] max-h-[750px]"
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
                                        creativeEffect={swiperCreativeConfig}
                                    >
                                        {/* 💖 Premium Heart Flow Hint */}
                                        {currentSlideIndex === 0 && !hasSwiped && (
                                            <div className="absolute inset-x-0 top-10 z-[60] flex flex-col items-center pointer-events-none">
                                                <div className="flex flex-col items-center gap-4 animate-[swipeHint_3.5s_infinite]">

                                                    {/* Advanced Heart Pulse with Rings */}
                                                    <div className="relative flex items-center justify-center">
                                                        {/* Expanding Love Rings */}
                                                        <div className="absolute w-8 h-8 rounded-full border border-white/40 animate-[ring-spread_2s_infinite]" />
                                                        <div className="absolute w-8 h-8 rounded-full border border-white/20 animate-[ring-spread_2s_infinite_0.5s]" />

                                                        <div className="relative z-10 animate-[heart-beat-glow_1.5s_infinite]">
                                                            <Heart size={32} variant="Bold" color="white" className="drop-shadow-[0_0_15px_rgba(255,51,102,0.6)]" />
                                                        </div>

                                                        {/* Floating companion hearts */}
                                                        <div className="absolute -top-4 -right-4 opacity-70 animate-[heart-float_2.5s_infinite]">
                                                            <Heart size={14} variant="Bold" color="white" />
                                                        </div>
                                                        <div className="absolute -bottom-2 -left-3 opacity-50 animate-[heart-float_2s_infinite_400ms]">
                                                            <Heart size={10} variant="Bold" color="white" />
                                                        </div>
                                                    </div>

                                                    {/* Elegant Shimmer Text */}
                                                    <div className="flex flex-col items-center">
                                                        <Typography
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                fontWeight: 800,
                                                                letterSpacing: '0.5em',
                                                                textTransform: 'uppercase',
                                                                background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, #ffffff 50%, rgba(255,255,255,0.2) 100%)',
                                                                backgroundSize: '200% auto',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                animation: 'text-shine 3s linear infinite',
                                                                textAlign: 'center',
                                                                fontFamily: 'var(--font-prompt)'
                                                            }}
                                                        >
                                                            Swipe to see more
                                                        </Typography>
                                                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mt-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {memories.map((memory, index) => {
                                            const isSeen = seenSlides.has(index);
                                            return (
                                                <SwiperSlide key={index}>
                                                    {({ isActive }) => (
                                                        <div className="slide-content relative w-full h-full">
                                                            {/* Premium Shine Effect - Always on for luster */}
                                                            <div className="card-shine animate-shine opacity-40" />

                                                            {/* Mystery Veil Overlay - Only for Unseen + Active, or if manually hidden */}
                                                            {(!isSeen || !isActive) && !isSeen && (
                                                                <div
                                                                    className={`mystery-veil ${isActive ? 'animate-veil-reveal' : 'opacity-100'}`}
                                                                />
                                                            )}
                                                            {memory.type === 'video' ? (
                                                                <div className="w-full h-full relative bg-gradient-to-br from-[#FF99AC] to-[#FF3366] overflow-hidden">
                                                                    {/* Decorative elements */}
                                                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                                                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl opacity-60" />

                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                        <div className="relative">
                                                                            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 animate-pulse" />
                                                                            <Heart
                                                                                size={64}
                                                                                variant="Bold"
                                                                                color="white"
                                                                                className="relative z-10 animate-[heartPulse_2s_ease-in-out_infinite]"
                                                                            />
                                                                        </div>
                                                                        <Typography
                                                                            className="text-white font-bold mt-4 tracking-widest text-xs uppercase opacity-80"
                                                                            sx={{ fontFamily: 'var(--font-prompt)' }}
                                                                        >
                                                                            Romantic Moment
                                                                        </Typography>
                                                                    </div>

                                                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/30">
                                                                        <Play size={12} variant="Bold" color="white" />
                                                                        <Typography className="text-white text-[10px] font-bold uppercase tracking-tighter">Video</Typography>
                                                                    </div>
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
                                                                    <div className="animate-caption-mystery flex flex-col items-center">
                                                                        <div className="mb-2" style={{ animation: 'heartPulse 1.5s ease-in-out infinite' }}>
                                                                            <Heart variant="Bold" color="#FF3366" size="24" style={{ filter: 'drop-shadow(0 0 10px rgba(255,51,102,0.8))' }} />
                                                                        </div>
                                                                        <div className="px-6 py-4 elegant-caption-box rounded-xl relative overflow-hidden caption-fade-up">
                                                                            <Typography
                                                                                variant="h5"
                                                                                className="romantic-text text-white text-center leading-relaxed"
                                                                                style={{ fontSize: '1.6rem' }}
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
                                            )
                                        })}
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
                            <div className="w-full max-w-sm text-center pt-0 px-6 flex-none z-[50] relative" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
                                <Typography variant="h6" className="text-[#8B1D36] font-bold uppercase tracking-widest mb-2 mt-[-10px]" sx={{ fontFamily: 'var(--font-prompt)', fontSize: '1rem' }}>
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
