'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Skeleton, Chip, Stack } from '@mui/material';
import { Calendar, Location, TickCircle, Clock, ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';
import { initializeLiff, LiffProfile } from '@/lib/liff';

type UserStatus = 'loading' | 'new' | 'pending' | 'active';

interface Event {
    id: string;
    eventName: string;
    eventDate: string;
    venue: string;
    status: string;
}

export default function LiffHomePage() {
    const [status, setStatus] = useState<UserStatus>('loading');
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function init() {
            try {
                const userProfile = await initializeLiff();
                if (!userProfile) return;

                setProfile(userProfile);

                // Check user status
                const res = await fetch('/api/liff/check-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lineUid: userProfile.userId,
                        displayName: userProfile.displayName,
                        pictureUrl: userProfile.pictureUrl,
                    }),
                });

                const data = await res.json();
                setStatus(data.status);
                if (data.events) {
                    setEvents(data.events);
                }
            } catch (error) {
                console.error('Init error:', error);
            }
        }
        init();
    }, []);

    // Loading State
    if (status === 'loading') {
        return (
            <Container maxWidth="sm" sx={{ py: 3 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={80} />
            </Container>
        );
    }

    // New User - ยังไม่เคยทักแชท
    if (status === 'new') {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Box sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>👋</Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        สวัสดีครับ!
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 4 }}
                    >
                        กรุณาทักแชทหาเราเพื่อสอบถามบริการ
                        <br />
                        ทีมงานพร้อมให้คำปรึกษา
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Pending - รอทีมงาน
    if (status === 'pending') {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Box sx={{ py: 6 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'rgba(10, 92, 90, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        <Clock size={40} color="var(--primary)" variant="Bulk" />
                    </Box>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        รอทีมงานติดต่อกลับ
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', lineHeight: 1.8 }}
                    >
                        สวัสดีคุณ {profile?.displayName}
                        <br />
                        ทีมงานกำลังเตรียมข้อมูลงานของคุณ
                        <br />
                        เราจะแจ้งให้ทราบเมื่อพร้อม
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Active - มี Event แล้ว
    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            {/* Welcome Card */}
            <Card
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, var(--primary) 0%, #0d7472 100%)',
                    color: 'white',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem', opacity: 0.9, mb: 1 }}
                    >
                        ยินดีต้อนรับ
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}
                    >
                        {profile?.displayName}
                    </Typography>
                </CardContent>
            </Card>

            {/* Events List */}
            <Typography
                sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 600,
                    mb: 2,
                    color: 'var(--foreground)',
                }}
            >
                📋 งานของคุณ ({events.length})
            </Typography>

            <Stack spacing={2}>
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/liff/events/${event.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card
                            sx={{
                                borderRadius: 2,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            color: 'var(--foreground)',
                                            flex: 1,
                                        }}
                                    >
                                        {event.eventName}
                                    </Typography>
                                    <Chip
                                        icon={<TickCircle size={14} variant="Bold" />}
                                        label={event.status === 'confirmed' ? 'ยืนยันแล้ว' : event.status}
                                        size="small"
                                        sx={{
                                            bgcolor: event.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                            color: event.status === 'confirmed' ? '#10b981' : 'gray',
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.7rem',
                                            height: 24,
                                        }}
                                    />
                                </Box>

                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Calendar size={16} color="gray" variant="Bold" />
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                            {event.eventDate ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }) : 'ยังไม่กำหนด'}
                                        </Typography>
                                    </Box>
                                    {event.venue && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Location size={16} color="gray" variant="Bold" />
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                                {event.venue}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <ArrowRight2 size={18} color="var(--primary)" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>

            {events.length === 0 && (
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 4 }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                        ยังไม่มีงาน
                    </Typography>
                </Card>
            )}
        </Container>
    );
}
