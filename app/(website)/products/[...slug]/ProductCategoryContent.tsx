"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Button, Stack, Skeleton, Chip, Modal, IconButton, Tooltip } from "@mui/material";
import { ArrowRight2, Gallery, CloseCircle, ArrowLeft2, ArrowRight, ExportSquare, Crown, ShieldTick, TruckFast, MagicStar, MedalStar, NoteText, MessageQuestion, CallCalling, Monitor } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    priceUnit: string | null; // e.g. "ต่อตารางเมตร", "ต่อชิ้น", "/วัน"
    images: string[];
    features: string[];
}

interface CategoryChild {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
}

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface BreadcrumbItem {
    name: string;
    slug: string;
}

interface PageData {
    category: CategoryData;
    children: CategoryChild[];
    products: Product[];
    breadcrumb: BreadcrumbItem[];
    path: string;
}

// ProductCard Component - Glassmorphism Bottom Panel Style (Like Middle Card)
function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    const prevRef = React.useRef<HTMLButtonElement>(null);
    const nextRef = React.useRef<HTMLButtonElement>(null);

    const hasImages = product.images && product.images.length > 0;
    const imageCount = product.images?.length || 0;

    // Open lightbox
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <Paper
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => openLightbox(0)}
                sx={{
                    position: 'relative',
                    borderRadius: 6,
                    overflow: 'hidden',
                    height: { xs: 340, md: 380 },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
                    }
                }}
            >
                {/* Full Background Image with Swiper */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        '& .swiper': { width: '100%', height: '100%' },
                        '& .swiper-pagination': {
                            bottom: 'auto',
                            top: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'auto',
                            display: 'flex',
                            gap: '6px',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(4px)',
                            borderRadius: 10,
                            px: 1.2,
                            py: 0.6
                        },
                        '& .swiper-pagination-bullet': {
                            bgcolor: 'white',
                            opacity: 0.6,
                            width: 6,
                            height: 6,
                            transition: 'all 0.3s ease',
                            margin: '0 !important'
                        },
                        '& .swiper-pagination-bullet-active': {
                            opacity: 1,
                            bgcolor: 'white',
                            width: 16,
                            borderRadius: 4
                        }
                    }}
                >
                    {hasImages ? (
                        <>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                onBeforeInit={(swiper) => {
                                    if (typeof swiper.params.navigation !== 'boolean') {
                                        swiper.params.navigation!.prevEl = prevRef.current;
                                        swiper.params.navigation!.nextEl = nextRef.current;
                                    }
                                }}
                                pagination={{ clickable: true }}
                                loop={imageCount > 1}
                                onClick={(swiper, e) => {
                                    e.stopPropagation();
                                    openLightbox(swiper.realIndex);
                                }}
                            >
                                {product.images.map((img, idx) => (
                                    <SwiperSlide key={idx}>
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                                            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}>
                                            <Image
                                                src={img}
                                                alt={product.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Navigation Arrows */}
                            {imageCount > 1 && (
                                <>
                                    <IconButton
                                        ref={prevRef}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            position: 'absolute',
                                            left: 12,
                                            top: '40%',
                                            transform: 'translateY(-50%)',
                                            zIndex: 20,
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(4px)',
                                            color: 'white',
                                            width: 32,
                                            height: 32,
                                            opacity: isHovered ? 1 : 0,
                                            transition: 'all 0.3s ease',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                                        }}
                                    >
                                        <ArrowLeft2 size="16" color="white" />
                                    </IconButton>
                                    <IconButton
                                        ref={nextRef}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            position: 'absolute',
                                            right: 12,
                                            top: '40%',
                                            transform: 'translateY(-50%)',
                                            zIndex: 20,
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(4px)',
                                            color: 'white',
                                            width: 32,
                                            height: 32,
                                            opacity: isHovered ? 1 : 0,
                                            transition: 'all 0.3s ease',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                                        }}
                                    >
                                        <ArrowRight2 size="16" color="white" />
                                    </IconButton>
                                </>
                            )}
                        </>
                    ) : (
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #2d5a4a 0%, #1a3a2e 100%)'
                        }}>
                            <Box sx={{ transform: 'translateY(-32px)' }}>
                                <Gallery size="64" color="rgba(255,255,255,0.3)" variant="Bold" />
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Soft Dark Glassmorphism Bottom Panel */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                    backdropFilter: 'blur(6px)',
                    pt: 8,
                    pb: 2.5,
                    px: 2.5,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    maskImage: 'linear-gradient(to bottom, transparent, black 40%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)'
                }}>
                    {/* Name & Title Row */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 2,
                        mb: 2
                    }}>
                        {/* Product Name */}
                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            fontSize: { xs: '1rem', md: '1.2rem' },
                            color: 'white',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            flex: 1
                        }}>
                            {product.name}
                        </Typography>

                        {/* Price or View Details (Moved to Top Right) */}
                        <Box sx={{ flexShrink: 0 }}>
                            {product.price ? (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                }}>
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        fontSize: '1.25rem',
                                        color: 'white',
                                        lineHeight: 1,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                    }}>
                                        ฿{product.price.toLocaleString()}
                                    </Typography>
                                    {product.priceUnit && (
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.75rem',
                                            color: 'rgba(255,255,255,0.9)',
                                            mt: 0.2
                                        }}>
                                            {product.priceUnit}
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 3,
                                    px: 1.2,
                                    py: 0.5,
                                    gap: 0.5,
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        color: 'white',
                                        lineHeight: 1
                                    }}>
                                        ดูรายละเอียด
                                    </Typography>
                                    <ArrowRight2 size="14" color="white" />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Bottom Area: Features, Desc, Author & Share */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: 2,
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid rgba(255,255,255,0.15)'
                    }}>
                        {/* Left Column: Features & Description */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
                                    {product.features.slice(0, 2).map((feature, idx) => (
                                        <Box key={idx} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.6
                                        }}>
                                            <Gallery size="14" color="rgba(255,255,255,0.8)" />
                                            <Typography sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.75rem',
                                                color: 'rgba(255,255,255,0.9)',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            )}

                            {/* Description (Moved to Bottom) */}
                            {product.description && (
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.8rem',
                                    color: 'rgba(255,255,255,0.75)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.4,
                                    mb: 0.5
                                }}>
                                    {product.description}
                                </Typography>
                            )}

                            {/* Author / Signature */}
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.65rem',
                                color: 'rgba(255,255,255,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                Collection <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'white', opacity: 0.5 }}></span> {categoryName}
                            </Typography>
                        </Box>

                        {/* Right Column: Share Button */}
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (navigator.share) {
                                        navigator.share({
                                            title: product.name,
                                            text: product.description || product.name,
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                    }
                                }}
                                sx={{
                                    bgcolor: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    color: 'white',
                                    width: 36,
                                    height: 36,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderColor: 'white',
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                <ExportSquare size="16" color="white" />
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>
            </Paper>

            {/* Lightbox Modal using Swiper */}
            <Modal
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, md: 4 },
                    '& .MuiBackdrop-root': {
                        bgcolor: 'rgba(0,0,0,0.95)'
                    }
                }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    maxWidth: 1200,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    outline: 'none',
                    '& .swiper': { width: '100%', height: '100%' }
                }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={() => setLightboxOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: { xs: 8, md: 16 },
                            right: { xs: 8, md: 16 },
                            zIndex: 100,
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <CloseCircle size="28" color="white" />
                    </IconButton>

                    {/* Main Swiper */}
                    <Box sx={{ flex: 1, position: 'relative', minHeight: 0, borderRadius: { xs: 2, md: 3 }, overflow: 'hidden' }}>
                        <Swiper
                            modules={[Navigation, EffectFade, Thumbs]}
                            navigation={{
                                prevEl: '.lightbox-prev',
                                nextEl: '.lightbox-next',
                            }}
                            effect="fade"
                            loop={imageCount > 1}
                            initialSlide={lightboxIndex}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            onSlideChange={(swiper) => setLightboxIndex(swiper.realIndex)}
                            style={{ height: '100%' }}
                        >
                            {product.images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Image
                                            src={img}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            priority
                                        />
                                    </Box>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Lightbox Navigation Arrows */}
                        {imageCount > 1 && (
                            <>
                                <IconButton
                                    className="lightbox-prev"
                                    sx={{
                                        position: 'absolute',
                                        left: { xs: 8, md: 24 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 100,
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        width: { xs: 40, md: 56 },
                                        height: { xs: 40, md: 56 },
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                        '&.swiper-button-disabled': { opacity: 0, pointerEvents: 'none' }
                                    }}
                                >
                                    <ArrowLeft2 size="28" color="white" />
                                </IconButton>
                                <IconButton
                                    className="lightbox-next"
                                    sx={{
                                        position: 'absolute',
                                        right: { xs: 8, md: 24 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 100,
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        width: { xs: 40, md: 56 },
                                        height: { xs: 40, md: 56 },
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                        '&.swiper-button-disabled': { opacity: 0, pointerEvents: 'none' }
                                    }}
                                >
                                    <ArrowRight2 size="28" color="white" />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    {/* Footer: Counter & Thumbnails */}
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        {/* Image Counter */}
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, px: 2, py: 0.5 }}>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'white', fontSize: '0.9rem' }}>
                                {lightboxIndex + 1} / {imageCount}
                            </Typography>
                        </Box>

                        {/* Thumbnail Swiper */}
                        {imageCount > 1 && (
                            <Box sx={{ width: '100%', maxWidth: 600, height: { xs: 50, md: 70 } }}>
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    spaceBetween={10}
                                    slidesPerView={'auto'}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    centerInsufficientSlides={true}
                                    style={{ height: '100%' }}
                                    className="thumb-swiper"
                                >
                                    {product.images.map((img, idx) => (
                                        <SwiperSlide key={idx} style={{ width: 'auto' }}>
                                            <Box
                                                sx={{
                                                    width: { xs: 60, md: 90 },
                                                    height: '100%',
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: idx === lightboxIndex ? '2px solid white' : '2px solid transparent',
                                                    opacity: idx === lightboxIndex ? 1 : 0.5,
                                                    transition: 'all 0.2s',
                                                    '&:hover': { opacity: 1 }
                                                }}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    width={90}
                                                    height={70}
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                />
                                            </Box>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default function ProductCategoryContent() {
    const params = useParams();
    const slugArray = params.slug as string[] | undefined;
    const slugPath = slugArray?.join('/') || '';

    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!slugPath) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/products/by-slug?path=${encodeURIComponent(slugPath)}`);
                const json = await res.json();

                if (!res.ok) {
                    setError(json.error || 'Failed to load');
                    return;
                }

                setData(json);
            } catch (err) {
                setError('Failed to load category');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [slugPath]);

    // Build breadcrumb path
    const buildBreadcrumbHref = (index: number) => {
        if (!data?.breadcrumb) return '/products';
        const slugs = data.breadcrumb.slice(0, index + 1).map(b => b.slug);
        return `/products/${slugs.join('/')}`;
    };

    if (loading) {
        return (
            <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10 }}>
                {/* Hero Skeleton - Light Theme */}
                <Box sx={{
                    pt: { xs: 15, md: 22 },
                    pb: { xs: 8, md: 10 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3
                }}>
                    <Skeleton variant="rounded" width={140} height={32} sx={{ borderRadius: 10, bgcolor: 'rgba(0,0,0,0.05)' }} />
                    <Skeleton variant="text" width={300} height={60} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
                    <Skeleton variant="text" width={500} height={24} sx={{ maxWidth: '90%', bgcolor: 'rgba(0,0,0,0.05)' }} />
                </Box>
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} variant="rounded" height={300} sx={{ bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 }} />
                        ))}
                    </Box>
                </Container>
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}>
                        ไม่พบหน้าที่ต้องการ
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(0,0,0,0.6)', mb: 4 }}>
                        {error || 'ไม่พบหมวดหมู่สินค้านี้'}
                    </Typography>
                    <Button
                        component={Link}
                        href="/products"
                        variant="contained"
                        sx={{ fontFamily: 'var(--font-prompt)', bgcolor: '#1a1a1a' }}
                    >
                        กลับหน้าสินค้า
                    </Button>
                </Container>
            </Box>
        );
    }

    const { category, children, products, breadcrumb } = data;
    const hasSubcategories = children && children.length > 0;
    const hasProducts = products && products.length > 0;

    return (
        <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10 }}>
            {/* Hero Section - Same as Contact */}
            {/* Hero Section - Same as Contact */}
            {/* Header Section with Geometric background */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Products Category"
                            sx={{
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10B981',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
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
                                textTransform: 'uppercase'
                            }}
                        >
                            {category.name}
                        </Typography>
                        {category.description && (
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
                                {category.description}
                            </Typography>
                        )}
                    </Stack>
                </Container>
            </Box>

            {/* Subcategories Section - Minimal Cards */}
            {hasSubcategories && (
                <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2, mb: 6 }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: { xs: 2, md: 3 }
                    }}>
                        {children.map((child) => {
                            const isIndoor = child.name.toLowerCase().includes('indoor') || child.slug.includes('indoor');
                            const isOutdoor = child.name.toLowerCase().includes('outdoor') || child.slug.includes('outdoor');

                            return (
                                <Paper
                                    key={child.id}
                                    component={Link}
                                    href={`/products/${slugPath}/${child.slug}`}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        bgcolor: 'rgba(128,128,128,0.03)',
                                        borderRadius: 3,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        transition: 'all 0.3s ease',
                                        border: '1px solid',
                                        borderColor: 'rgba(128,128,128,0.2)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                            borderColor: 'var(--primary)',
                                            '& .card-icon': {
                                                bgcolor: 'var(--primary)',
                                                color: 'white',
                                                '& svg path': {
                                                    stroke: 'white'
                                                }
                                            },
                                            '& .card-arrow': {
                                                bgcolor: 'var(--primary)',
                                                color: 'white'
                                            }
                                        }
                                    }}
                                >
                                    {/* Icon */}
                                    <Box
                                        className="card-icon"
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {isIndoor ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 22H2M2 11L10.126 4.04a3 3 0 013.748 0L22 11M15.5 5.5V3.5a1 1 0 011-1h2a1 1 0 011 1v5M4 22V9.5M20 22V9.5M9 22v-4a3 3 0 016 0v4M10 9a2 2 0 104 0 2 2 0 00-4 0Z" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : isOutdoor ? (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M18 12a6 6 0 11-12 0 6 6 0 0112 0Z" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <Monitor size="24" color="var(--primary)" variant="Outline" />
                                        )}
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                                            color: 'var(--foreground)',
                                            mb: 0.5
                                        }}>
                                            {child.name}
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.9rem',
                                            color: 'var(--foreground)',
                                            opacity: 0.6
                                        }}>
                                            {isIndoor ? 'สำหรับงานในร่ม' : isOutdoor ? 'สำหรับงานกลางแจ้ง' : 'ดูรายละเอียด'}
                                        </Typography>
                                        <Chip
                                            label={`${child._count.products} สินค้า`}
                                            size="small"
                                            sx={{
                                                mt: 1.5,
                                                bgcolor: 'rgba(16, 185, 129, 0.08)',
                                                color: 'var(--primary)',
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                height: 24
                                            }}
                                        />
                                    </Box>

                                    {/* Arrow */}
                                    <Box
                                        className="card-arrow"
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(0,0,0,0.04)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <ArrowRight2 size="20" color="var(--primary)" />
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                </Container>
            )}

            {/* Products Grid */}
            {hasProducts && (
                <Container maxWidth="lg" sx={{ mt: hasSubcategories ? 0 : 6 }}>
                    {/* Section Header */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography sx={{
                            color: "var(--primary)",
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            mb: 1,
                            textTransform: 'uppercase',
                            letterSpacing: 2
                        }}>
                            Our Products
                        </Typography>
                        <Typography variant="h4" sx={{
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 700,
                            color: "var(--foreground)",
                            mb: 1
                        }}>
                            รายการสินค้า
                        </Typography>
                        <Typography sx={{
                            fontFamily: "var(--font-prompt)",
                            color: "rgba(0,0,0,0.5)",
                            fontSize: '1rem'
                        }}>
                            พบ {products.length} รายการ
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
                        gap: { xs: 3, md: 4 }
                    }}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} categoryName={category.name} />
                        ))}
                    </Box>
                </Container>
            )}

            {/* Empty State */}
            {!hasSubcategories && !hasProducts && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '40vh',
                    py: 8
                }}>
                    <Gallery size="64" color="rgba(0,0,0,0.2)" variant="Bold" />
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '1.2rem',
                        color: 'rgba(0,0,0,0.5)',
                        mt: 2
                    }}>
                        ยังไม่มีสินค้าในหมวดหมู่นี้
                    </Typography>
                </Box>

            )}

            {/* --- NEW BOTTOM SECTIONS --- */}

            {/* --- CTA Section --- */}

            {/* 3. New CTA (Gradient) */}
            <Box sx={{
                position: 'relative',
                py: { xs: 8, md: 10 },
                bgcolor: '#0a5c5a', // Fallback
                background: 'linear-gradient(135deg, #0a5c5a 0%, #06403e 100%)',
                overflow: 'hidden',
                color: 'white',
                mt: 10
            }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                        พร้อมยกระดับงานของคุณ?
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: { xs: '1rem', md: '1.25rem' }, opacity: 0.8, mb: 5, maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
                        ปรึกษาฟรี ไม่มีค่าใช้จ่าย ทีมงาน SET EVENT พร้อมให้คำแนะนำและจัดสเปคให้เหมาะสมกับงบประมาณ
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                        <Button
                            href="https://line.me/ti/p/~@setevent"
                            target="_blank"
                            variant="contained"
                            startIcon={<MessageQuestion size="24" variant="Bold" color="white" />}
                            sx={{
                                bgcolor: '#06C755',
                                color: 'white',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 600,
                                px: 4, py: 1.8,
                                borderRadius: 3,
                                fontSize: '1rem',
                                boxShadow: '0 8px 24px rgba(6, 199, 85, 0.3)',
                                '&:hover': { bgcolor: '#05b04a', transform: 'translateY(-2px)' }
                            }}
                        >
                            แอด LINE @setevent
                        </Button>
                        <Button
                            href="tel:0812345678"
                            variant="outlined"
                            startIcon={<CallCalling size="24" variant="Bold" color="white" />}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 600,
                                px: 4, py: 1.8,
                                borderRadius: 3,
                                fontSize: '1rem',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                            }}
                        >
                            โทร 093-726-5055
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
