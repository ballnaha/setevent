"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Button, Stack, Skeleton, Chip, IconButton } from "@mui/material";
import { ArrowRight2, Gallery, MagicStar, NoteText, MessageQuestion, CallCalling, Monitor } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/app/components/Breadcrumbs";

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
}

// ProductCard Component
function ProductCard({ product, categoryName, isPriority = false }: { product: Product; categoryName: string; isPriority?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getThumbnailUrl = (url: string) => {
        const ytId = getYoutubeId(url);
        if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        return url;
    };

    const hasImages = product.images && product.images.length > 0;
    const imageCount = product.images?.length || 0;
    const isVideo = hasImages && getYoutubeId(product.images[0]);

    return (
        <Paper
            component={Link}
            href={`/products/p/${product.slug}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                textDecoration: 'none',
                position: 'relative',
                borderRadius: 6,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 400, md: 440 },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                bgcolor: 'var(--card-bg)',
                border: 'none',
                boxShadow: 'none',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            {/* Full Background Image */}
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                {hasImages ? (
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <Image
                            src={getThumbnailUrl(product.images[0])}
                            alt={product.name}
                            fill
                            priority={isPriority}
                            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                            onLoad={() => handleImageLoad(0)}
                            style={{
                                objectFit: 'contain',
                                backgroundColor: 'transparent',
                                opacity: loadedImages[0] ? 1 : 0,
                                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                        {isVideo && (
                           <Box sx={{ 
                               position: 'absolute', 
                               inset: 0, 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center',
                               bgcolor: 'rgba(0,0,0,0.1)',
                               zIndex: 2
                           }}>
                               <Box sx={{ 
                                   width: 48, height: 48, borderRadius: '50%', 
                                   bgcolor: 'rgba(255,255,255,0.2)', 
                                   backdropFilter: 'blur(10px)',
                                   display: 'flex', alignItems: 'center', justifyContent: 'center'
                               }}>
                                    <Monitor size="24" color="white" variant="Bold" />
                               </Box>
                           </Box>
                        )}
                        {!loadedImages[0] && (
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height="100%"
                                animation="wave"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bgcolor: 'rgba(128,128,128,0.06)',
                                    zIndex: 1
                                }}
                            />
                        )}

                        
                        {/* More images indicator */}
                        {imageCount > 1 && (
                            <Box sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: 1.5,
                                px: 1,
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                zIndex: 2
                            }}>
                                <Gallery size="12" color="white" />
                                <Typography sx={{ color: 'white', fontSize: '0.65rem', fontWeight: 600 }}>
                                    +{imageCount - 1}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    }}>
                        <Stack spacing={1.5} alignItems="center" sx={{ opacity: 0.2, transform: 'translateY(-20px)' }}>
                            <Gallery size="56" color="var(--primary)" variant="Outline" />
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: 'var(--primary)',
                                letterSpacing: 1.5,
                                textTransform: 'uppercase'
                            }}>
                                No Image Available
                            </Typography>
                        </Stack>
                    </Box>
                )}
            </Box>

            {/* Soft Dark Glassmorphism Bottom Panel */}
            <Box sx={{
                bgcolor: 'var(--card-bg)',
                pt: 2.5,
                pb: 2.5,
                px: 3,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                borderTop: '1px solid var(--border-color)',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 2
                }}>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 600,
                        fontSize: { xs: '0.95rem', md: '1.1rem' },
                        color: 'var(--foreground)',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                    }}>
                        {product.name}
                    </Typography>

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
                                    fontSize: '1.1rem',
                                    color: 'var(--primary)',
                                    lineHeight: 1,
                                }}>
                                    ฿{product.price.toLocaleString()}
                                </Typography>
                                {product.priceUnit && (
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.7rem',
                                        color: 'var(--foreground)',
                                        opacity: 0.6,
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
                                bgcolor: 'var(--border-color)',
                                borderRadius: 3,
                                px: 1.2,
                                py: 0.5,
                                gap: 0.5,
                                border: '1px solid var(--border-color)'
                            }}>
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                    color: 'var(--foreground)',
                                    lineHeight: 1
                                }}>
                                    ดูรายละเอียด
                                </Typography>
                                <ArrowRight2 size="14" color="var(--foreground)" />
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 2,
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {product.features && product.features.length > 0 && (
                            <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
                                {product.features.slice(0, 2).map((feature, idx) => (
                                    <Box key={idx} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.6
                                    }}>
                                        <Gallery size="14" color="var(--primary)" />
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.75rem',
                                            color: 'var(--foreground)',
                                            opacity: 0.8,
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {feature}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        {product.description && (
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.8rem',
                                color: 'var(--foreground)',
                                opacity: 0.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.5,
                                mb: 1
                            }}>
                                {product.description}
                            </Typography>
                        )}

                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.65rem',
                            color: 'var(--foreground)',
                            opacity: 0.4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}>
                            Collection <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--primary)', opacity: 0.5 }}></span> {categoryName}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}

export default function ProductCategoryContent({ initialData = null }: { initialData?: PageData | null }) {
    const params = useParams();
    const slugArray = params.slug as string[] | undefined;
    const slugPath = slugArray?.join('/') || '';

    const [data, setData] = useState<PageData | null>(initialData);
    const [loading, setLoading] = useState(initialData === null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) return;

        async function fetchData() {
            if (!slugPath) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/products/by-slug?path=${encodeURIComponent(slugPath)}`, { cache: 'no-store' });
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
    }, [slugPath, initialData]);

    if (loading) {
        return (
            <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10, overflow: 'hidden' }}>
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

    if (error || !data) {
        return (
            <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}>
                        ไม่พบหน้าที่ต้องการ
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6, mb: 4 }}>
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

    const { category, children, products } = data;
    const hasSubcategories = children && children.length > 0;
    const hasProducts = products && products.length > 0;

    return (
        <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10, overflow: 'hidden' }}>
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
                bgcolor: "var(--background)",
            }}>
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
                    <Breadcrumbs 
                        center 
                        items={data.breadcrumb.map(b => ({ 
                            label: b.name, 
                            href: b.slug ? `/products/${b.slug}` : '/products' 
                        }))} 
                    />
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Products Category"
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
                                textTransform: 'uppercase',
                                textShadow: 'var(--text-glow)'
                            }}
                        >
                            {category.name.split(' ').map((word, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <br />}
                                    {i === category.name.split(' ').length - 1 ? (
                                        <span style={{
                                            background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            {word}
                                        </span>
                                    ) : (
                                        word
                                    )}
                                </React.Fragment>
                            ))}
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

            {hasSubcategories && (
                <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2, mb: 6 }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: { xs: 2, md: 3 }
                    }}>
                        {children.map((child) => (
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
                                    boxShadow: '0 4px 20px var(--border-color)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 40px var(--border-color)',
                                        borderColor: 'var(--primary)',
                                        '& .card-icon': {
                                            bgcolor: 'var(--primary)',
                                            color: 'white'
                                        },
                                        '& .card-arrow': {
                                            bgcolor: 'var(--primary)',
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
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
                                    <Monitor size="24" color="var(--primary)" variant="Outline" />
                                </Box>

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

                                <Box
                                    className="card-arrow"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(128,128,128,0.1)',
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
                        ))}
                    </Box>
                </Container>
            )}

            {hasProducts && (
                <Container maxWidth="lg" sx={{ mt: hasSubcategories ? 0 : 6 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'flex-end' },
                        justifyContent: 'space-between',
                        mb: 4,
                        pb: 2,
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <Box>
                            <Typography sx={{
                                color: "var(--primary)",
                                fontFamily: "var(--font-prompt)",
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                mb: 0.5,
                                textTransform: 'uppercase',
                                letterSpacing: 1.5
                            }}>
                                Our Products
                            </Typography>
                            <Typography variant="h5" sx={{
                                fontFamily: "var(--font-prompt)",
                                fontWeight: 700,
                                color: "var(--foreground)",
                            }}>
                                รายการสินค้า
                            </Typography>
                        </Box>
                        <Typography sx={{
                            fontFamily: "var(--font-prompt)",
                            color: "var(--foreground)",
                            opacity: 0.5,
                            fontSize: '0.9rem',
                            mt: { xs: 1, sm: 0 }
                        }}>
                            พบ {products.length} รายการ
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
                        gap: { xs: 3, md: 4 }
                    }}>
                        {products.map((product, idx) => (
                            <ProductCard key={product.id} product={product} categoryName={category.name} isPriority={idx < 3} />
                        ))}
                    </Box>
                </Container>
            )}

            {!hasSubcategories && !hasProducts && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '40vh',
                    py: 8
                }}>
                    <Box sx={{ opacity: 0.2 }}>
                        <Gallery size="64" color="var(--foreground)" variant="Bold" />
                    </Box>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '1.2rem',
                        color: 'var(--foreground)',
                        opacity: 0.5,
                        mt: 2
                    }}>
                        ยังไม่มีสินค้าในหมวดหมู่นี้
                    </Typography>
                </Box>
            )}

            <Box sx={{
                position: 'relative',
                py: { xs: 8, md: 10 },
                bgcolor: '#0a5c5a',
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
                            rel="noopener noreferrer"
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
