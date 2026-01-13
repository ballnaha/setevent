"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Chip, Stack, Skeleton, Divider, Button, Avatar, Snackbar, Alert } from '@mui/material';
import { Calendar, Clock, User, ArrowLeft, Eye, Share, Facebook, Link21 } from 'iconsax-react';
import Link from 'next/link';
import Image from 'next/image';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    author: string;
    publishedAt: string;
    views: number;
}

type Props = {
    params: Promise<{ slug: string }>;
};

export default function BlogDetailContent({ params }: Props) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { slug } = await params;
                const res = await fetch(`/api/blogs/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setBlog(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch blog:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [params]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleShare = async () => {
        if (navigator.share && blog) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setSnackbarOpen(true);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setSnackbarOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10 }}>
                {/* Hero Skeleton */}
                <Box sx={{
                    pt: { xs: 15, md: 22 },
                    pb: { xs: 6, md: 10 },
                    position: 'relative'
                }}>
                    <Container maxWidth="md">
                        <Skeleton variant="rounded" width={100} height={32} sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)' }} />
                        <Skeleton variant="text" width="90%" height={60} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
                        <Skeleton variant="text" width="70%" height={60} sx={{ mb: 3, bgcolor: 'rgba(0,0,0,0.08)' }} />
                        <Stack direction="row" spacing={3}>
                            <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.05)' }} />
                            <Skeleton variant="text" width={100} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.05)' }} />
                        </Stack>
                    </Container>
                </Box>

                {/* Image Skeleton */}
                <Container maxWidth="lg" sx={{ mb: 6 }}>
                    <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4, bgcolor: 'rgba(0,0,0,0.06)' }} />
                </Container>

                {/* Content Skeleton */}
                <Container maxWidth="md">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Skeleton key={n} variant="text" width={`${90 - n * 5}%`} height={24} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.05)' }} />
                    ))}
                </Container>
            </Box>
        );
    }

    if (error || !blog) {
        return (
            <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10 }}>
                <Container maxWidth="md" sx={{ pt: { xs: 20, md: 25 }, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', mb: 2 }}>
                        ไม่พบบทความ
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6, mb: 4 }}>
                        บทความที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่
                    </Typography>
                    <Button
                        component={Link}
                        href="/blog"
                        variant="contained"
                        startIcon={<ArrowLeft size="20" color="white" />}
                        sx={{
                            bgcolor: 'var(--primary)',
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 2,
                            px: 4,
                            py: 1.5
                        }}
                    >
                        กลับหน้าบทความ
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10 }}>
            {/* Header Section */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 6, md: 10 },
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
                    background: 'radial-gradient(circle, rgba(0, 194, 203, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Back Button - Positioned nicely */}
                    <Box sx={{ mb: 4 }}>
                        <Button
                            component={Link}
                            href="/blog"
                            startIcon={<ArrowLeft size="18" color="var(--primary)" />}
                            sx={{
                                color: 'var(--primary)',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500,
                                border: '1px solid',
                                borderColor: 'rgba(0, 194, 203, 0.3)',
                                borderRadius: 2,
                                px: 2,
                                py: 0.75,
                                '&:hover': {
                                    bgcolor: 'rgba(0, 194, 203, 0.1)',
                                    borderColor: 'var(--primary)'
                                }
                            }}
                        >
                            กลับหน้าบทความ
                        </Button>
                    </Box>

                    {/* Category */}
                    <Chip
                        label={blog.category}
                        sx={{
                            mb: 3,
                            bgcolor: 'rgba(0, 194, 203, 0.1)',
                            color: '#00C2CB',
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600
                        }}
                    />

                    {/* Title */}
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 800,
                            fontSize: { xs: '2rem', md: '3rem' },
                            color: 'var(--foreground)',
                            lineHeight: 1.2,
                            mb: 3
                        }}
                    >
                        {blog.title}
                    </Typography>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                lineHeight: 1.8,
                                mb: 4
                            }}
                        >
                            {blog.excerpt}
                        </Typography>
                    )}

                    {/* Meta Info */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 4 }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        sx={{ color: 'var(--foreground)', opacity: 0.6 }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'var(--primary)' }}>
                                <User size="20" color="white" />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)' }}>
                                    {blog.author || 'Admin'}
                                </Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', opacity: 0.7 }}>
                                    ผู้เขียน
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, bgcolor: 'rgba(128,128,128,0.3)' }} />

                        <Stack direction="row" spacing={3}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Calendar size="18" color="var(--primary)" />
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>
                                    {formatDate(blog.publishedAt)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Eye size="18" color="var(--primary)" />
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>
                                    {blog.views.toLocaleString()} views
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Cover Image */}
            {blog.coverImage && (
                <Container maxWidth="lg" sx={{ mb: 8 }}>
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        height: { xs: 300, md: 500 },
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                    }}>
                        <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </Box>
                </Container>
            )}

            {/* Content */}
            <Container maxWidth="md">
                <Box
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        color: 'var(--foreground)',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 2,
                        '& p': { mb: 3 },
                        '& h2': {
                            fontSize: { xs: '1.5rem', md: '1.8rem' },
                            fontWeight: 700,
                            mt: 5,
                            mb: 3
                        },
                        '& h3': {
                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                            fontWeight: 600,
                            mt: 4,
                            mb: 2
                        },
                        '& ul, & ol': {
                            pl: 3,
                            mb: 3,
                            '& li': { mb: 1 }
                        },
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            my: 3
                        },
                        '& blockquote': {
                            borderLeft: '4px solid var(--primary)',
                            pl: 3,
                            py: 1,
                            my: 4,
                            fontStyle: 'italic',
                            opacity: 0.8
                        },
                        '& a': {
                            color: 'var(--primary)',
                            textDecoration: 'underline'
                        }
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                />

                {/* Share Section */}
                <Divider sx={{ my: 6, bgcolor: 'rgba(128,128,128,0.2)' }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: 'var(--foreground)' }}>
                        แชร์บทความนี้
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Share size="18" color="var(--primary)" />}
                            onClick={handleShare}
                            sx={{
                                borderColor: 'rgba(128,128,128,0.3)',
                                color: 'var(--foreground)',
                                fontFamily: 'var(--font-prompt)',
                                borderRadius: 2,
                                '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' }
                            }}
                        >
                            แชร์
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCopyLink}
                            sx={{
                                borderColor: 'rgba(128,128,128,0.3)',
                                color: 'var(--foreground)',
                                fontFamily: 'var(--font-prompt)',
                                borderRadius: 2,
                                minWidth: 'auto',
                                px: 2,
                                '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' }
                            }}
                        >
                            <Link21 size="18" color="var(--primary)" />
                        </Button>
                    </Stack>
                </Stack>

                {/* Back to Blog */}
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Button
                        component={Link}
                        href="/blog"
                        variant="contained"
                        startIcon={<ArrowLeft size="20" color="white" />}
                        sx={{
                            bgcolor: 'var(--primary)',
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 }
                        }}
                    >
                        ดูบทความทั้งหมด
                    </Button>
                </Box>
            </Container>

            {/* Snackbar for Copy Link */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }}
                >
                    ลิงก์ถูกคัดลอกแล้ว!
                </Alert>
            </Snackbar>
        </Box>
    );
}
