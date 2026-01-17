"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Skeleton, Chip, Stack, Button } from "@mui/material";
import { ArrowRight2, Box1, Category2, MessageQuestion, CallCalling } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";

interface CategoryChild {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    _count: { products: number; children: number };
}

interface RootCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    children: CategoryChild[];
    _count: { products: number; children: number };
}

export default function ProductsContent() {
    const [categories, setCategories] = useState<RootCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/admin/categories', { cache: 'no-store' });
                const data = await res.json();

                // Filter to get only root categories and build tree
                const rootCats = data.filter((cat: any) => !cat.parentId);
                const catsWithChildren = rootCats.map((root: any) => ({
                    ...root,
                    children: data.filter((cat: any) => cat.parentId === root.id)
                }));

                setCategories(catsWithChildren);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', overflow: 'hidden', pb: 10 }}>
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
                            label="Our Products & Services"
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
                                textShadow: 'var(--text-glow)'
                            }}
                        >
                            PRODUCTS <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                & SERVICES
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
                            บริการครบวงจรด้านระบบภาพ เสียง แสง และโครงสร้าง พร้อมทีมงานมืออาชีพ
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Categories Section */}
            <Box sx={{ py: { xs: 2, md: 0 } }}>
                <Container maxWidth="lg">
                    {/* Section Header */}
                    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                        <Typography sx={{
                            color: "var(--primary)",
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            mb: 1,
                            textTransform: 'uppercase',
                            letterSpacing: 2
                        }}>
                            Categories
                        </Typography>
                        <Typography sx={{
                            color: "var(--foreground)",
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', md: '2rem' }
                        }}>
                            หมวดหมู่สินค้าและบริการ
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {/* Skeleton for 2 category sections */}
                            {[1, 2].map(categoryIndex => (
                                <Box key={categoryIndex}>
                                    {/* Category Header Skeleton */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 3
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Skeleton
                                                variant="rounded"
                                                width={48}
                                                height={48}
                                                sx={{ borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)' }}
                                            />
                                            <Box>
                                                <Skeleton
                                                    variant="text"
                                                    width={180}
                                                    height={32}
                                                    sx={{ bgcolor: 'rgba(0,0,0,0.08)' }}
                                                />
                                                <Skeleton
                                                    variant="text"
                                                    width={120}
                                                    height={20}
                                                    sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
                                                />
                                            </Box>
                                        </Box>
                                        <Skeleton
                                            variant="rounded"
                                            width={100}
                                            height={28}
                                            sx={{ borderRadius: 4, bgcolor: 'rgba(16, 185, 129, 0.08)' }}
                                        />
                                    </Box>

                                    {/* Subcategories Grid Skeleton */}
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
                                        gap: 3
                                    }}>
                                        {[1, 2, 3, 4].map(cardIndex => (
                                            <Paper
                                                key={cardIndex}
                                                sx={{
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    border: '1px solid rgba(0,0,0,0.06)'
                                                }}
                                            >
                                                {/* Image Skeleton */}
                                                <Skeleton
                                                    variant="rectangular"
                                                    height={160}
                                                    sx={{
                                                        bgcolor: 'rgba(0,0,0,0.06)',
                                                        animation: 'pulse 1.5s ease-in-out infinite'
                                                    }}
                                                />
                                                {/* Info Skeleton */}
                                                <Box sx={{ p: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Skeleton
                                                            variant="text"
                                                            width="70%"
                                                            height={24}
                                                            sx={{ bgcolor: 'rgba(0,0,0,0.08)' }}
                                                        />
                                                        <Skeleton
                                                            variant="circular"
                                                            width={18}
                                                            height={18}
                                                            sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)' }}
                                                        />
                                                    </Box>
                                                    <Skeleton
                                                        variant="text"
                                                        width="40%"
                                                        height={18}
                                                        sx={{ mt: 0.5, bgcolor: 'rgba(0,0,0,0.05)' }}
                                                    />
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : categories.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Category2 size="64" color="rgba(0,0,0,0.2)" variant="Bold" />
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'rgba(0,0,0,0.5)',
                                mt: 2,
                                fontSize: '1.1rem'
                            }}>
                                ยังไม่มีหมวดหมู่สินค้า
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        }}>
                            {categories.map((category) => (
                                <Box key={category.id}>
                                    {/* Category Header */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 3
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                bgcolor: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Box1 size="24" color="white" variant="Bold" />
                                            </Box>
                                            <Box>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 700,
                                                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                                                    color: 'var(--foreground)'
                                                }}>
                                                    {category.name}
                                                </Typography>
                                                {category.description && (
                                                    <Typography sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        color: 'var(--foreground)',
                                                        opacity: 0.6,
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {category.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={`${category.children.length} หมวดหมู่ย่อย`}
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                bgcolor: 'rgba(10, 92, 90, 0.1)',
                                                color: 'var(--primary)',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>

                                    {/* Subcategories Grid */}
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
                                        gap: 3
                                    }}>
                                        {category.children.map((child) => (
                                            <Paper
                                                key={child.id}
                                                component={Link}
                                                href={`/products/${category.slug}/${child.slug}`}
                                                sx={{
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    bgcolor: 'rgba(128,128,128,0.03)', // Light transparent bg for both modes
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    transition: 'all 0.3s ease',
                                                    border: '1px solid',
                                                    borderColor: 'rgba(128,128,128,0.2)',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                                                        borderColor: 'var(--primary)'
                                                    }
                                                }}
                                            >
                                                {/* Image */}
                                                <Box sx={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: 160,
                                                    bgcolor: 'rgba(128,128,128,0.1)', // Adaptive placeholder bg
                                                    overflow: 'hidden'
                                                }}>
                                                    {child.image ? (
                                                        <Image
                                                            src={child.image}
                                                            alt={child.name}
                                                            fill
                                                            placeholder="blur"
                                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <Box sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: 'linear-gradient(135deg, rgba(128,128,128,0.05) 0%, rgba(128,128,128,0.1) 100%)'
                                                        }}>
                                                            <Box1 size="40" color="rgba(0,0,0,0.15)" variant="Bold" />
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Info */}
                                                <Box sx={{ p: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Typography sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontWeight: 600,
                                                            fontSize: '1rem',
                                                            color: 'var(--foreground)'
                                                        }}>
                                                            {child.name}
                                                        </Typography>
                                                        <ArrowRight2 size="18" color="var(--primary)" />
                                                    </Box>
                                                    {child._count.products > 0 && (
                                                        <Typography sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.8rem',
                                                            color: 'var(--foreground)',
                                                            opacity: 0.5,
                                                            mt: 0.5
                                                        }}>
                                                            {child._count.products} สินค้า
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* CTA Section - Premium Gradient Style */}
            <Box sx={{
                position: 'relative',
                py: { xs: 8, md: 10 },
                bgcolor: '#0a5c5a',
                background: 'linear-gradient(135deg, #0a5c5a 0%, #06403e 100%)',
                overflow: 'hidden',
                color: 'white',
                mt: 4
            }}>
                {/* Diagonal Lines Pattern */}
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
                            rel="noopener noreferrer"
                            aria-label="ติดต่อเราผ่าน LINE @setevent"
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
                            href="tel:0937265055"
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
