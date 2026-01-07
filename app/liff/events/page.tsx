'use client';

import { Container, Typography, Card, CardContent, Box, Stack, Chip, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Calendar, Location, TickCircle, Clock, ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';
import { initializeLiff, LiffProfile } from '@/lib/liff';

interface Event {
    id: string;
    eventName: string;
    eventDate: string;
    venue: string;
    status: string;
}

export default function LiffEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const profile = await initializeLiff();
                if (profile) {
                    const res = await fetch('/api/liff/events', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ lineUid: profile.userId }),
                    });
                    const data = await res.json();
                    setEvents(data.events || []);
                }
            } catch (error) {
                console.error('Events fetch error:', error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'confirmed':
                return { label: 'ยืนยันแล้ว', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' };
            case 'in-progress':
                return { label: 'กำลังดำเนินการ', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' };
            case 'completed':
                return { label: 'เสร็จสิ้น', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
            case 'draft':
                return { label: 'รอยืนยัน', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' };
            default:
                return { label: status, color: 'gray', bgColor: 'rgba(0,0,0,0.05)' };
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 3 }}>
                <Typography
                    sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 2 }}
                >
                    📋 งานทั้งหมด
                </Typography>
                <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 2 }} />
                    ))}
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Typography
                sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 2, color: 'var(--foreground)' }}
            >
                📋 งานทั้งหมด ({events.length})
            </Typography>

            {events.length === 0 ? (
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 1 }}>
                        ยังไม่มีงาน
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                        ทักแชทหาเราเพื่อสอบถามบริการ
                    </Typography>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {events.map((event) => {
                        const statusInfo = getStatusInfo(event.status);
                        return (
                            <Link
                                key={event.id}
                                href={`/liff/events/${event.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
                                                    pr: 1,
                                                }}
                                            >
                                                {event.eventName}
                                            </Typography>
                                            <Chip
                                                icon={<TickCircle size={14} variant="Bold" />}
                                                label={statusInfo.label}
                                                size="small"
                                                sx={{
                                                    bgcolor: statusInfo.bgColor,
                                                    color: statusInfo.color,
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.7rem',
                                                    height: 24,
                                                    '& .MuiChip-icon': { color: statusInfo.color },
                                                }}
                                            />
                                        </Box>

                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Calendar size={16} color="gray" variant="Bold" />
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                                    {event.eventDate
                                                        ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })
                                                        : 'ยังไม่กำหนดวัน'}
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

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                                            <ArrowRight2 size={18} color="var(--primary)" />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </Stack>
            )}
        </Container>
    );
}
