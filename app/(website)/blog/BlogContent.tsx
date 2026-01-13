
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Chip, TextField, InputAdornment, Skeleton, Button, Stack, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { SearchNormal1, Calendar, User, ArrowRight2, Book, Clock, MagicStar, CloseCircle } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: string;
    publishedAt: string;
    views: number;
}

const CATEGORIES = ["All", "Inspiration", "Knowledge", "Technical Guide", "Trends", "Guides"];

export default function BlogContent() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/blogs');
                if (res.ok) {
                    const data = await res.json();
                    setBlogs(data);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Bento Grid Logic: First 3 items are featured (1 big, 2 small)
    const featuredBlogs = filteredBlogs.slice(0, 3);
    const regularBlogs = filteredBlogs.slice(3);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10 }}>
            {/* Header Section with Geometric background */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 12 },
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
                    background: 'radial-gradient(circle, rgba(0, 194, 203, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack spacing={3} alignItems="center" textAlign="center">
                        <Chip
                            label="SetEvent Knowledge Hub"
                            sx={{
                                bgcolor: 'rgba(0, 194, 203, 0.1)',
                                color: '#00C2CB',
                                border: '1px solid rgba(0, 194, 203, 0.2)',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500
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
                                letterSpacing: '-1px'
                            }}
                        >
                            INSIGHTS & <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #00C2CB 0%, #E94560 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                INSPIRATION
                            </span>
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 600,
                                lineHeight: 1.8
                            }}
                        >
                            คลังความรู้และไอเดียใหม่ๆ สำหรับการจัดงานอีเวนต์ อัปเดตเทรนด์แสงสีเสียง และเทคนิคจากมืออาชีพ
                        </Typography>

                        {/* Search & Filter */}
                        <Box sx={{ width: '100%', maxWidth: 600, mt: 4 }}>
                            <TextField
                                fullWidth
                                placeholder="ค้นหาบทความที่คุณสนใจ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        borderRadius: 30,
                                        pr: 1,
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '& fieldset': { border: 'none' },
                                        color: 'var(--foreground)'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchNormal1 size="20" color="var(--primary)" style={{ marginLeft: 8 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {searchTerm && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setSearchTerm('')}
                                                    sx={{ color: 'var(--foreground)', opacity: 0.5, '&:hover': { opacity: 1 } }}
                                                >
                                                    <CloseCircle size="20" color="currentColor" variant="Bold" />
                                                </IconButton>
                                            )}
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    borderRadius: 20,
                                                    bgcolor: 'var(--primary)',
                                                    fontFamily: 'var(--font-prompt)',
                                                    textTransform: 'none',
                                                    minWidth: 80
                                                }}
                                            >
                                                Search
                                            </Button>
                                        </Stack>
                                    )
                                }}
                            />
                        </Box>

                        {/* Category Filter Chips */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                mt: 3,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 1
                            }}
                        >
                            {CATEGORIES.map((cat) => (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: selectedCategory === cat ? 'var(--foreground)' : 'transparent',
                                        color: selectedCategory === cat ? 'var(--background)' : 'var(--foreground)',
                                        border: '1px solid',
                                        borderColor: selectedCategory === cat ? 'var(--foreground)' : 'rgba(128,128,128,0.4)',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        py: 2.5,
                                        px: 1,
                                        opacity: selectedCategory === cat ? 1 : 0.8,
                                        '&:hover': {
                                            bgcolor: selectedCategory === cat ? 'var(--foreground)' : 'rgba(128,128,128,0.15)',
                                            opacity: 1
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {loading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
                        {[1, 2, 3].map(n => (
                            <Skeleton key={n} variant="rectangular" height={300} sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)' }} />
                        ))}
                    </Box>
                ) : filteredBlogs.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Book size="60" color="gray" variant="Bulk" style={{ opacity: 0.5, marginBottom: 16 }} />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'text.secondary' }}>
                            ไม่พบข้อมูลที่คุณค้นหา
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Bento Grid Featured */}
                        {!searchTerm && selectedCategory === "All" && featuredBlogs.length > 0 && (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
                                gridTemplateRows: { md: '1fr 1fr' }, // Define 2 equal rows
                                gap: 3,
                                mb: 8,
                                height: { md: '600px' }
                            }}>
                                {/* Main Featured (Left) */}
                                <Box
                                    component={Link}
                                    href={`/blog/${featuredBlogs[0].slug}`}
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        gridRow: { md: 'span 2' },
                                        minHeight: { xs: 300, md: 'auto' },
                                        group: 'group',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Image
                                        src={featuredBlogs[0].coverImage || '/images/logo.png'}
                                        alt={featuredBlogs[0].title}
                                        fill
                                        style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        p: 4
                                    }}>
                                        <Chip label={featuredBlogs[0].category} size="small" sx={{ bgcolor: 'var(--primary)', color: 'white', width: 'fit-content', mb: 2 }} />
                                        <Typography variant="h4" sx={{
                                            color: 'white',
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            mb: 1,
                                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                            fontSize: { xs: '1.5rem' }
                                        }}>
                                            {featuredBlogs[0].title}
                                        </Typography>
                                        <Stack direction="row" spacing={2} sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Calendar size="16" color="#fff" /> {formatDate(featuredBlogs[0].publishedAt)}</Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Clock size="16" color="#fff" /> 5 min read</Box>
                                        </Stack>
                                    </Box>
                                </Box>

                                {/* Sub Featured (Right Column) - spans both rows */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    gridRow: { md: 'span 2' } // Span both rows like left card
                                }}>
                                    {featuredBlogs.slice(1).map((blog) => (
                                        <Box
                                            key={blog.id}
                                            component={Link}
                                            href={`/blog/${blog.slug}`}
                                            sx={{
                                                position: 'relative',
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                flex: 1, // Equal height distribution
                                                minHeight: { xs: 220, md: 0 }
                                            }}
                                        >
                                            <Image
                                                src={blog.coverImage || '/images/logo.png'}
                                                alt={blog.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 100%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                p: 3
                                            }}>
                                                <Typography variant="h6" sx={{
                                                    color: 'white',
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600,
                                                    lineHeight: 1.3,
                                                    mb: 1
                                                }}>
                                                    {blog.title}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-prompt)' }}>
                                                    {blog.category} • {formatDate(blog.publishedAt)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Latest Articles Grid */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                            <Typography variant="h4" sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                color: 'var(--foreground)'
                            }}>
                                Latest Articles
                            </Typography>
                            <Button endIcon={<ArrowRight2 />} sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--primary)' }}>
                                View All
                            </Button>
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                            gap: 4
                        }}>
                            {(searchTerm || selectedCategory !== "All" ? filteredBlogs : regularBlogs).map((blog) => (
                                <Box
                                    key={blog.id}
                                    component={Link}
                                    href={`/blog/${blog.slug}`}
                                    sx={{
                                        group: 'group',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'relative',
                                        pt: '75%', // Changed from 65% to 75% for taller images
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        mb: 2.5,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                    }}>
                                        <Image
                                            src={blog.coverImage || '/images/logo.png'}
                                            alt={blog.title}
                                            fill
                                            style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                                        />
                                    </Box>
                                    <Box>
                                        <Chip
                                            label={blog.category}
                                            size="small"
                                            sx={{
                                                mb: 1.5,
                                                bgcolor: 'rgba(0, 194, 203, 0.1)',
                                                color: '#00C2CB',
                                                fontWeight: 600,
                                                borderRadius: 1
                                            }}
                                        />
                                        <Typography variant="h6" sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            color: 'var(--foreground)',
                                            mb: 1.5,
                                            lineHeight: 1.4,
                                            minHeight: '3.6em', // approx 2.5 lines
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            transition: 'color 0.2s',
                                            '&:hover': { color: 'var(--primary)' }
                                        }}>
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            color: 'var(--foreground)',
                                            opacity: 0.7,
                                            mb: 2,
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}>
                                            {blog.excerpt}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 'auto' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <User size="16" color="gray" />
                                                <Typography variant="caption" color="text.secondary">
                                                    {blog.author || 'Admin'}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">•</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(blog.publishedAt)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
}
