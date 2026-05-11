"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Container, Typography, Chip, Skeleton, Stack, Button } from "@mui/material";
import { Gallery } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import ModalWrapper from "../products/components/ModalWrapper";

// Portfolio interface
interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    description?: string | null;
    image: string;
    slug: string;
}

interface PortfolioImageItem {
    id: string;
    url: string;
    caption: string | null;
    order: number;
}

function PortfolioQuickView({
    item,
    albumImages,
    albumLoading,
    shouldBypassOptimization,
}: {
    item: PortfolioItem;
    albumImages: PortfolioImageItem[];
    albumLoading: boolean;
    shouldBypassOptimization: (src: string) => boolean;
}) {
    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            bgcolor: 'var(--background)',
            overflow: 'hidden',
        }}>
            <Box sx={{
                flex: { xs: '0 0 auto', lg: 1 },
                height: { xs: '60vh', lg: '100%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRight: { lg: '1px solid var(--border-color)' },
                p: { xs: 2, md: 4 },
            }}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}>
                    {albumImages[0] && (
                        <Image
                            src={albumImages[0].url}
                            alt={item.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 70vw"
                            unoptimized={shouldBypassOptimization(albumImages[0].url)}
                            style={{ objectFit: 'contain', objectPosition: 'center' }}
                        />
                    )}
                    {albumLoading && (
                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height="100%"
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'var(--border-color)',
                                opacity: 0.3,
                            }}
                        />
                    )}
                </Box>
            </Box>

            <Box sx={{
                width: { xs: '100%', lg: 520 },
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'var(--card-bg)',
                overflowY: 'auto',
                p: { xs: 4, md: 5 },
            }}>
                <Chip
                    label={item.category}
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 2,
                        bgcolor: 'rgba(10, 92, 90, 0.1)',
                        color: 'var(--primary)',
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 600,
                    }}
                />
                <Typography
                    component="h2"
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 800,
                        fontSize: { xs: '1.8rem', md: '2.3rem' },
                        color: 'var(--foreground)',
                        lineHeight: 1.15,
                        mb: 2.5,
                    }}
                >
                    {item.title}
                </Typography>
                {item.description && (
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '1rem',
                            color: 'var(--foreground)',
                            opacity: 0.72,
                            lineHeight: 1.8,
                            mb: 3,
                        }}
                    >
                        {item.description}
                    </Typography>
                )}
                <Button
                    component={Link}
                    href={`/portfolio/${encodeURIComponent(item.slug)}`}
                    onClick={(event) => {
                        event.preventDefault();
                        window.location.assign(`/portfolio/${encodeURIComponent(item.slug)}`);
                    }}
                    sx={{
                        alignSelf: 'flex-start',
                        fontFamily: 'var(--font-prompt)',
                        color: 'var(--primary)',
                        px: 0,
                        mb: 3,
                    }}
                >
                    ดูรายละเอียดเต็ม
                </Button>
                {albumImages.length > 1 && (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                        gap: 1.5,
                        mt: 'auto',
                    }}>
                        {albumImages.map((img) => (
                            <Box
                                key={img.id}
                                sx={{
                                    position: 'relative',
                                    aspectRatio: '4/3',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: 'rgba(128,128,128,0.08)',
                                }}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.caption || item.title}
                                    fill
                                    sizes="120px"
                                    unoptimized={shouldBypassOptimization(img.url)}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

// Categories are now dynamically derived from the database data.
// Empty categories will automatically disappear from the filters.

export default function PortfolioContent({ initialData = [] }: { initialData?: PortfolioItem[] }) {
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialData);
    const [loading, setLoading] = useState(initialData.length === 0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [albumImages, setAlbumImages] = useState<PortfolioImageItem[]>([]);
    const [albumLoading, setAlbumLoading] = useState(false);
    const pushedModalPathRef = useRef<string | null>(null);

    const shouldBypassOptimization = (src: string) =>
        src.startsWith("/uploads/") && /\.(webp|avif|gif)$/i.test(src);

    useEffect(() => {
        if (initialData.length === 0) {
            fetchPortfolios();
        }
    }, [initialData]);

    const fetchPortfolios = async () => {
        try {
            const res = await fetch('/api/portfolios', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setPortfolioItems(data);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all unique categories from portfolios
    const allCategories = React.useMemo(() => {
        const categoriesFromData = portfolioItems.map(p => p.category);
        const uniqueCategories = Array.from(new Set(categoriesFromData));
        return ["All", ...uniqueCategories.sort()];
    }, [portfolioItems]);

    const filteredItems = selectedCategory === "All"
        ? portfolioItems
        : portfolioItems.filter((d: PortfolioItem) => d.category === selectedCategory);

    const closePortfolio = useCallback((fromPopState = false) => {
        setSelectedItem(null);
        setAlbumImages([]);
        setAlbumLoading(false);

        if (!fromPopState && pushedModalPathRef.current && window.location.pathname === pushedModalPathRef.current) {
            window.history.back();
        }

        if (fromPopState) {
            pushedModalPathRef.current = null;
        }
    }, []);

    const openPortfolio = useCallback(async (event: React.MouseEvent<HTMLAnchorElement>, item: PortfolioItem) => {
        event.preventDefault();

        setSelectedItem(item);
        setAlbumImages(item.image ? [{
            id: item.id,
            url: item.image,
            caption: item.title,
            order: 0,
        }] : []);
        setAlbumLoading(true);

        const detailPath = `/portfolio/${encodeURIComponent(item.slug)}`;
        if (window.location.pathname !== detailPath) {
            window.history.pushState({ portfolioModal: true }, "", detailPath);
            pushedModalPathRef.current = detailPath;
        }

        try {
            const res = await fetch(`/api/portfolios/${item.id}/images`, { cache: 'no-store' });
            if (!res.ok) return;

            const data: PortfolioImageItem[] = await res.json();
            if (data.length > 0) {
                const coverExistsInAlbum = item.image ? data.some((img) => img.url === item.image) : true;
                setAlbumImages(coverExistsInAlbum || !item.image
                    ? data
                    : [{ id: item.id, url: item.image, caption: item.title, order: -1 }, ...data]
                );
            }
        } catch (error) {
            console.error('Error fetching portfolio album images:', error);
        } finally {
            setAlbumLoading(false);
        }
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            if (selectedItem) {
                closePortfolio(true);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [closePortfolio, selectedItem]);

    if (loading) {
        return (
            <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
                {/* Hero Skeleton - More Minimal & Beautiful */}
                <Box sx={{
                    pt: { xs: 15, md: 22 },
                    pb: { xs: 8, md: 10 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3
                }}>
                    <Skeleton variant="rounded" width={140} height={32} sx={{ borderRadius: 10, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                    <Skeleton variant="text" height={60} sx={{ width: { xs: '90%', md: 400 }, bgcolor: 'var(--border-color)', opacity: 0.8 }} />
                    <Skeleton variant="text" height={24} sx={{ width: { xs: '80%', md: 600 }, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                </Box>
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Skeleton
                                    variant="rounded"
                                    height={320}
                                    animation="wave"
                                    sx={{
                                        bgcolor: 'var(--border-color)',
                                        opacity: 0.4,
                                        borderRadius: 6
                                    }}
                                />
                                <Box sx={{ px: 1 }}>
                                    <Skeleton variant="text" width="85%" height={32} sx={{ bgcolor: 'var(--border-color)', opacity: 0.7 }} />
                                    <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: 'var(--border-color)', opacity: 0.4 }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10, overflow: 'hidden' }}>
            {/* Header Section with Geometric background */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',

            }}>
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, var(--decor-emerald) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, var(--decor-ruby) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Breadcrumbs center items={[{ label: 'Portfolio' }]} />
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Our Masterpieces"
                            sx={{
                                bgcolor: 'rgba(10, 92, 90, 0.1)',
                                color: 'var(--primary)',
                                border: '1px solid rgba(10, 92, 90, 0.2)',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 600
                            }}
                        />
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '4.5rem' },
                                color: 'var(--foreground)',
                                lineHeight: 1.1,
                                letterSpacing: '-1px',
                                textShadow: 'var(--text-glow)'
                            }}
                        >
                            FEATURED <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #0A5C5A 0%, #00C2CB 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                PORTFOLIO
                            </span>
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 600,
                                lineHeight: 1.8,
                                mx: 'auto'
                            }}
                        >
                            ผลงานที่ผ่านมาของเรา สะท้อนคุณภาพและความเชี่ยวชาญในการเนรมิตงานอีเว้นท์ทุกรูปแบบให้เป็นจริง
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Category Filter */}
            <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 } }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mb: { xs: 3, md: 5 }
                }}>
                    {allCategories.map((cat: string) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setSelectedCategory(cat)}
                            sx={{
                                px: 1,
                                py: 2.5,
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                bgcolor: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                border: '1px solid',
                                borderColor: selectedCategory === cat ? 'var(--primary)' : 'rgba(128,128,128,0.4)',
                                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(10, 92, 90, 0.3)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: selectedCategory === cat ? 1 : 0.8,
                                '&:hover': {
                                    bgcolor: selectedCategory === cat ? 'var(--primary)' : 'rgba(128,128,128,0.15)',
                                    transform: 'translateY(-2px)',
                                    opacity: 1
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Masonry Gallery */}
                {loading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} variant="rounded" height={300} sx={{ borderRadius: 3, width: '100%', bgcolor: 'rgba(224,224,224,0.4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        ))}
                    </Box>
                ) : filteredItems.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        borderRadius: 4,
                        border: '1px dashed rgba(128,128,128,0.2)'
                    }}>
                        <Gallery size="64" color="var(--primary)" variant="Bulk" style={{ opacity: 0.3, marginBottom: 20 }} />
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', fontWeight: 600, mb: 1 }}>
                            {selectedCategory !== "All" ? "ไม่พบผลงานในหมวดหมู่นี้" : "ยังไม่มีผลงานในขณะนี้"}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6 }}>
                            {selectedCategory !== "All" ? "ลองเลือกหมวดหมู่户外อื่นๆ ดูนะคะ" : "เรากำลังรวบรวมผลงานสวยๆ มาให้ชม เร็วๆ นี้แน่นอนค่ะ"}
                        </Typography>
                        {selectedCategory !== "All" && (
                            <Button
                                onClick={() => setSelectedCategory('All')}
                                sx={{ mt: 3, fontFamily: 'var(--font-prompt)', color: 'var(--primary)' }}
                            >
                                ดูผลงานทั้งหมด
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 2
                    }}>
                        {filteredItems.map((item, idx) => (
                            <Link
                                key={item.id}
                                href={`/portfolio/${encodeURIComponent(item.slug)}`}
                                onClick={(event) => openPortfolio(event, item)}
                                style={{ textDecoration: 'none' }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        transition: 'all 0.4s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                                        },
                                        '&:hover img': {
                                            transform: 'scale(1.1)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        borderRadius: 'inherit',
                                        bgcolor: 'rgba(128,128,128,0.1)',
                                        aspectRatio: 'unset', // Let the image determine height
                                        overflow: 'hidden'
                                    }}>
                                        <Image
                                            src={item.image || '/images/placeholder.jpg'}
                                            alt={item.title}
                                            width={500}
                                            height={500}
                                            priority={idx === 0}
                                            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                                            unoptimized={shouldBypassOptimization(item.image || "")}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                                transition: 'transform 0.6s ease'
                                            }}
                                        />
                                    </Box>

                                    {/* Gradient Overlay - Always Visible */}
                                    <Box className="overlay" sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                                        opacity: 1,
                                        transition: 'opacity 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        p: 2
                                    }}>
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{
                                                alignSelf: 'flex-start',
                                                mb: 1,
                                                bgcolor: 'var(--primary)',
                                                color: 'white',
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                height: { xs: 24, md: 28 }
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: { xs: '1rem', md: '1.25rem' },
                                                color: 'white',
                                                lineHeight: 1.3,
                                                mb: 1,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Link>
                        ))}
                    </Box>
                )}
            </Container>

            {selectedItem && (
                <ModalWrapper>
                    <PortfolioQuickView
                        item={selectedItem}
                        albumImages={albumImages}
                        albumLoading={albumLoading}
                        shouldBypassOptimization={shouldBypassOptimization}
                    />
                </ModalWrapper>
            )}
        </Box>
    );
}
