"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Stack, Skeleton, IconButton } from "@mui/material";
import { CloseCircle, ArrowLeft2, ArrowRight2, MagicStar, NoteText, MessageQuestion } from "iconsax-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Thumbs, FreeMode } from 'swiper/modules';
import { useRouter } from "next/navigation";
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
    priceUnit: string | null;
    images: string[];
    features: string[];
}

interface ProductDetailViewProps {
    product: Product;
    categoryName?: string;
    onClose?: () => void;
    isModal?: boolean;
}

export default function ProductDetailView({ product, categoryName = "Product Detail", onClose, isModal = false }: ProductDetailViewProps) {
    const router = useRouter();
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    const imageCount = product.images?.length || 0;

    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: isModal ? '100vh' : 'auto',
            minHeight: isModal ? '100vh' : '100vh',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            bgcolor: 'var(--background)',
            overflow: isModal ? 'hidden' : 'visible',
            '& .swiper': { width: '100%', height: '100%' }
        }}>
            {/* Close Button */}
            {(isModal || !isModal) && (
                <IconButton
                    onClick={handleClose}
                    aria-label="ปิดภาพขยาย"
                    sx={{
                        position: 'absolute',
                        top: { xs: 16, md: 24 },
                        right: { xs: 16, md: 24 },
                        zIndex: 100,
                        color: 'var(--foreground)',
                        bgcolor: 'var(--border-color)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': { bgcolor: 'var(--background)', border: '1px solid var(--primary)' }
                    }}
                >
                    <CloseCircle size="28" color='var(--primary)' variant='Outline' />
                </IconButton>
            )}

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                flex: 1,
                minHeight: 0,
                overflow: { xs: 'auto', lg: 'hidden' },
            }}>
                {/* Left Side: Image Swiper */}
                <Box sx={{
                    flex: { xs: '0 0 auto', lg: 1 },
                    height: { xs: '60vh', lg: 'auto' },
                    position: 'relative',
                    minHeight: 0,
                    overflow: 'hidden',
                    borderRight: { lg: '1px solid var(--border-color)' },
                    bgcolor: 'rgba(0,0,0,0.02)'
                }}>
                    <Swiper
                        modules={[Navigation, EffectFade, Thumbs]}
                        navigation={{
                            prevEl: '.lightbox-prev',
                            nextEl: '.lightbox-next',
                        }}
                        effect="fade"
                        loop={imageCount > 1}
                        initialSlide={0}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        onSlideChange={(swiper) => setLightboxIndex(swiper.realIndex)}
                        style={{ height: '100%' }}
                    >
                        {product.images.map((img, idx) => (
                            <SwiperSlide key={idx}>
                                <Box sx={{ position: 'relative', width: '100%', height: '100%', p: { xs: 1, md: 4 } }}>
                                    <Image
                                        src={img}
                                        alt={product.name}
                                        fill
                                        onLoad={() => handleImageLoad(idx)}
                                        style={{
                                            objectFit: 'contain',
                                            objectPosition: 'center',
                                            opacity: loadedImages[idx] ? 1 : 0,
                                            transition: 'opacity 0.4s ease-in-out'
                                        }}
                                        priority={idx === 0}
                                    />
                                    {!loadedImages[idx] && (
                                        <Skeleton
                                            variant="rectangular"
                                            width="100%"
                                            height="100%"
                                            animation="wave"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bgcolor: 'rgba(128,128,128,0.1)',
                                                zIndex: 1
                                            }}
                                        />
                                    )}
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
                                    left: 24,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 100,
                                    color: 'var(--foreground)',
                                    bgcolor: 'var(--border-color)',
                                    backdropFilter: 'blur(10px)',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { bgcolor: 'var(--background)', border: '1px solid var(--primary)' },
                                    '&.swiper-button-disabled': { opacity: 0 }
                                }}
                            >
                                <ArrowLeft2 size="28" />
                            </IconButton>
                            <IconButton
                                className="lightbox-next"
                                sx={{
                                    position: 'absolute',
                                    right: 24,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 100,
                                    color: 'var(--foreground)',
                                    bgcolor: 'var(--border-color)',
                                    backdropFilter: 'blur(10px)',
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { bgcolor: 'var(--background)', border: '1px solid var(--primary)' },
                                    '&.swiper-button-disabled': { opacity: 0 }
                                }}
                            >
                                <ArrowRight2 size="28" />
                            </IconButton>
                        </>
                    )}
                </Box>

                {/* Right Side: Product Details */}
                <Box sx={{
                    width: { xs: '100%', lg: 550 },
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'var(--card-bg)',
                    flexShrink: 0,
                    overflowY: 'auto',
                    p: { xs: 4, md: 6 },
                    position: 'relative'
                }}>
                    {/* Category/Breadcrumb */}
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.8rem',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                        {categoryName}
                    </Typography>

                    {/* Title */}
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 800,
                        fontSize: { xs: '1.8rem', md: '2.4rem' },
                        color: 'var(--foreground)',
                        lineHeight: 1.1,
                        mb: 4,
                        letterSpacing: '-0.5px'
                    }}>
                        {product.name}
                    </Typography>

                    {/* Price Section */}
                    {product.price && (
                        <Box sx={{
                            mb: 5,
                            p: 3,
                            bgcolor: 'rgba(10, 92, 90, 0.05)',
                            borderRadius: 4,
                            border: '1px solid rgba(10, 92, 90, 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.1 }} />
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6, fontSize: '0.85rem', fontWeight: 500, mb: 1 }}>
                                ราคาเช่าประมาณการ
                            </Typography>
                            <Stack direction="row" alignItems="baseline" spacing={1.5}>
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 800,
                                    fontSize: { xs: '2rem', md: '2.4rem' },
                                    color: 'var(--primary)',
                                    lineHeight: 1
                                }}>
                                    ฿{product.price.toLocaleString()}
                                </Typography>
                                {product.priceUnit && (
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.5, fontSize: '1.2rem', fontWeight: 500 }}>
                                        {product.priceUnit}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    )}

                    {/* Features Section */}
                    {product.features && product.features.length > 0 && (
                        <Box sx={{ mb: 5 }}>
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                mb: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                color: 'var(--foreground)'
                            }}>
                                <MagicStar size="24" color="var(--primary)" variant="Bold" />
                                จุดเด่นและสเปคสินค้า
                            </Typography>
                            <Stack spacing={2}>
                                {product.features.map((feature, idx) => (
                                    <Box key={idx} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 1.5,
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                    }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--primary)', flexShrink: 0 }} />
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.85, fontWeight: 500 }}>
                                            {feature}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Description Section */}
                    {product.description && (
                        <Box sx={{ mb: 6 }}>
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                mb: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                color: 'var(--foreground)'
                            }}>
                                <NoteText size="24" color="var(--primary)" variant="Bold" />
                                รายละเอียดงานบริการ
                            </Typography>
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '1rem',
                                color: 'var(--foreground)',
                                opacity: 0.75,
                                lineHeight: 1.9,
                                whiteSpace: 'pre-line',
                                pl: 0.5
                            }}>
                                {product.description}
                            </Typography>
                        </Box>
                    )}

                    {/* CTA Button */}
                    <Box sx={{ mt: 'auto', pt: 4 }}>
                        <Button
                            href="https://line.me/ti/p/~@setevent"
                            target="_blank"
                            variant="contained"
                            fullWidth
                            startIcon={<MessageQuestion size="24" variant="Bold" color="white" />}
                            sx={{
                                bgcolor: '#1a1a1a',
                                color: 'white',
                                py: 2.5,
                                borderRadius: 4,
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    bgcolor: 'var(--primary)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(10, 92, 90, 0.25)',
                                }
                            }}
                        >
                            สอบถามจองคิวงาน
                        </Button>

                        <Typography sx={{
                            mt: 2.5,
                            textAlign: 'center',
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.85rem',
                            color: 'var(--foreground)',
                            opacity: 0.5,
                            fontWeight: 300
                        }}>
                            * ราคาอาจมีการเปลี่ยนแปลงตามระยะทางและจำนวนวันเช่า
                        </Typography>
                    </Box>

                    {/* Image Selector Strip */}
                    {imageCount > 1 && (
                        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid var(--border-color)' }}>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'var(--foreground)', opacity: 0.4, mb: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                                ดูภาพเพิ่มเติม ({imageCount})
                            </Typography>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                modules={[FreeMode, Navigation, Thumbs]}
                                spaceBetween={12}
                                slidesPerView={'auto'}
                                freeMode={true}
                                watchSlidesProgress={true}
                                style={{ height: 80 }}
                            >
                                {product.images.map((img, idx) => (
                                    <SwiperSlide key={idx} style={{ width: 'auto' }}>
                                        <Box
                                            sx={{
                                                width: 100,
                                                height: 80,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: idx === lightboxIndex ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                                                opacity: idx === lightboxIndex ? 1 : 0.6,
                                                transition: 'all 0.3s',
                                                '&:hover': { opacity: 1, transform: 'scale(1.05)' }
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                width={100}
                                                height={80}
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
        </Box>
    );
}
