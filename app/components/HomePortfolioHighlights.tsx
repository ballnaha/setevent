"use client";

import React from "react";
import { Box, Container, Typography, Button, Paper, Stack, Chip } from "@mui/material";
import { Gallery, Play, ArrowRight } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

interface PortfolioHighlight {
    title: string;
    category: string;
    mediaType: 'image' | 'youtube';
    src: string; // Used for thumbnail if image, or YouTube ID if youtube
    link: string;
}

const DEFAULT_HIGHLIGHTS: PortfolioHighlight[] = [
    {
        title: "งานแต่งงานหรู ณ โรงแรมแกรนด์",
        category: "Wedding LED Screen",
        mediaType: 'image',
        src: "/images/wedding.webp",
        link: "/portfolio/wedding-led-grand-hotel"
    },
    {
        title: "บรรยากาศงานอีเว้นท์ระดับพรีเมียม",
        category: "Event Atmosphere",
        mediaType: 'youtube',
        src: "vPF_635D_aA",
        link: "/portfolio"
    },
    {
        title: "สัมมนาผู้บริหารระดับประเทศ",
        category: "Corporate Seminar",
        mediaType: 'image',
        src: "/images/seminar.webp",
        link: "/portfolio/corporate-seminar-p3-led"
    },
    {
        title: "คอนเสิร์ตระเบิดความมันส์",
        category: "Concert Lighting & LED",
        mediaType: 'image',
        src: "/images/concert.webp",
        link: "/portfolio/concert-outdoor-led"
    }
];

export default function HomePortfolioHighlights({ initialHighlights }: { initialHighlights?: PortfolioHighlight[] }) {
    const [data, setData] = React.useState<PortfolioHighlight[]>(initialHighlights || DEFAULT_HIGHLIGHTS);

    React.useEffect(() => {
        if (!initialHighlights) {
            fetch('/api/admin/home-highlights')
                .then(res => res.json())
                .then(json => {
                    if (Array.isArray(json)) setData(json);
                })
                .catch(err => console.error("Failed to load highlights:", err));
        }
    }, [initialHighlights]);

    const renderMedia = (item: PortfolioHighlight, isMain: boolean = false) => {
        if (item.mediaType === 'youtube') {
            if (isMain) {
                return (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none' }}>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${item.src}?autoplay=1&mute=1&loop=1&playlist=${item.src}&controls=0&modestbranding=1&rel=0&showinfo=0`}
                            title={item.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '100%',
                                height: '100%',
                                transform: 'translate(-50%, -50%) scale(1.5)',
                                pointerEvents: 'none',
                                objectFit: 'cover'
                            }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '50%',
                            p: 1.5,
                            display: 'flex',
                            zIndex: 2
                        }}>
                            <Play size="24" color="white" variant="Bulk" />
                        </Box>
                    </Box>
                );
            }
            // Small YouTube item
            return (
                <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                    <Image
                        src={`https://img.youtube.com/vi/${item.src}/hqdefault.jpg`}
                        alt={item.title}
                        fill
                        className="media-img"
                        style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 40,
                        height: 40,
                        bgcolor: 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1
                    }}>
                        <Play size="20" color="white" variant="Bold" />
                    </Box>
                </Box>
            );
        }

        // Standard image
        return (
            <Image
                src={item.src}
                alt={item.title}
                fill
                className="media-img"
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
        );
    };

    const highlights = data; // Use fetched or default data

    return (
        <Box component="section" sx={{ py: { xs: 10, md: 15 }, bgcolor: "var(--background)" }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                    mb={{ xs: 5, md: 8 }}
                    spacing={2}
                >
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Gallery size="24" color="var(--primary)" variant="Bulk" />
                            <Typography variant="overline" sx={{ color: "var(--primary)", fontWeight: 700, letterSpacing: 2, fontFamily: 'var(--font-prompt)' }}>
                                OUR MASTERPIECES
                            </Typography>
                        </Stack>
                        <Typography variant="h3" component="h2" sx={{ fontFamily: "var(--font-prompt)", fontWeight: 800, mb: 1, background: 'linear-gradient(90deg, var(--foreground) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '3.5rem' } }}>
                            ผลงานล่าสุดที่น่าประทับใจ
                        </Typography>
                        <Typography variant="body1" sx={{ color: "var(--foreground)", opacity: 0.7, maxWidth: 600, fontFamily: 'var(--font-prompt)' }}>
                            สัมผัสประสบการณ์เบื้องหลังความสำเร็จที่เราใส่ใจทุกรายละเอียด
                            เพื่อสร้างสรรค์ความประทับใจให้กับทุกงานสำคัญของคุณ
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href="/portfolio"
                        endIcon={<ArrowRight size="20" variant="Bold" color="var(--primary)" />}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            '&:hover': { bgcolor: 'rgba(10, 92, 90, 0.05)', transform: 'translateX(5px)' },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ดูผลงานทั้งหมด
                    </Button>
                </Stack>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 1 }}>
                    {/* Featured Item (Highlights 1) */}
                    <Box sx={{ gridColumn: { md: 'span 7' } }}>
                        <Paper
                            component={Link}
                            href={highlights[1].link}
                            sx={{
                                display: 'block',
                                textDecoration: 'none',
                                position: 'relative',
                                height: { xs: 300, md: 500 },
                                borderRadius: 0,
                                overflow: 'hidden',
                                bgcolor: '#000',
                                '&:hover .media-overlay': { bgcolor: 'rgba(0,0,0,0.3)' },
                                '&:hover .media-content': { transform: 'translateY(0)', opacity: 1 },
                                boxShadow: 'none'
                            }}
                        >
                            {renderMedia(highlights[1], true)}

                            <Box className="media-overlay" sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                                transition: 'all 0.4s ease',
                                zIndex: 1
                            }} />

                            <Box className="media-content" sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                p: 4,
                                width: '100%',
                                transform: { xs: 'translateY(0)', md: 'translateY(10px)' },
                                opacity: { xs: 1, md: 0.9 },
                                transition: 'all 0.4s ease',
                                zIndex: 2
                            }}>
                                <Chip 
                                    label={highlights[1].category} 
                                    sx={{ 
                                        bgcolor: 'var(--primary)', 
                                        color: 'white', 
                                        fontWeight: 700, 
                                        fontFamily: 'var(--font-prompt)',
                                        mb: 1.5,
                                        height: 28,
                                        fontSize: '0.75rem',
                                        '& .MuiChip-label': { px: 1.5 }
                                    }} 
                                />
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-prompt)', mb: 2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                                    {highlights[1].title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Box sx={{ bgcolor: 'white', color: 'black', borderRadius: 2, px: 3, py: 1, fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-prompt)' }}>
                                        ดูรายละเอียดผลงาน
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Small Items Container */}
                    <Box sx={{ gridColumn: { md: 'span 5' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/* Highlights 0 */}
                        <Paper
                            component={Link}
                            href={highlights[0].link}
                            sx={{
                                textDecoration: 'none',
                                position: 'relative',
                                height: { xs: 250, md: 246 },
                                borderRadius: 0,
                                overflow: 'hidden',
                                '&:hover .media-img': { transform: 'scale(1.1)' },
                                boxShadow: 'none'
                            }}
                        >
                            {renderMedia(highlights[0])}
                            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                <Chip label={highlights[0].category} size="small" sx={{ bgcolor: 'var(--primary)', color: 'white', fontWeight: 700, fontFamily: 'var(--font-prompt)', width: 'fit-content', mb: 1, height: 24, fontSize: '0.7rem' }} />
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontFamily: 'var(--font-prompt)' }}>{highlights[0].title}</Typography>
                            </Box>
                        </Paper>

                        {/* Two Small Items Side by Side */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 1,
                            flex: 1
                        }}>
                            {/* Highlights 2 */}
                            <Paper
                                component={Link}
                                href={highlights[2].link}
                                sx={{
                                    textDecoration: 'none',
                                    position: 'relative',
                                    height: { xs: 246, md: '100%' },
                                    borderRadius: 0,
                                    overflow: 'hidden',
                                    '&:hover .media-img': { transform: 'scale(1.1)' },
                                    boxShadow: 'none'
                                }}
                            >
                                {renderMedia(highlights[2])}
                                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                    <Chip label={highlights[2].category} size="small" sx={{ bgcolor: 'var(--primary)', color: 'white', fontWeight: 700, fontFamily: 'var(--font-prompt)', width: 'fit-content', mb: 0.5, height: 20, fontSize: '0.65rem' }} />
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>{highlights[2].title}</Typography>
                                </Box>
                            </Paper>

                            {/* Highlights 3 */}
                            <Paper
                                component={Link}
                                href={highlights[3].link}
                                sx={{
                                    textDecoration: 'none',
                                    position: 'relative',
                                    height: { xs: 246, md: '100%' },
                                    borderRadius: 0,
                                    overflow: 'hidden',
                                    '&:hover .media-img': { transform: 'scale(1.1)' },
                                    boxShadow: 'none'
                                }}
                            >
                                {renderMedia(highlights[3])}
                                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 70%)', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                    <Chip label={highlights[3].category} size="small" sx={{ bgcolor: 'var(--primary)', color: 'white', fontWeight: 700, fontFamily: 'var(--font-prompt)', width: 'fit-content', mb: 0.5, height: 20, fontSize: '0.65rem' }} />
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>{highlights[3].title}</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
