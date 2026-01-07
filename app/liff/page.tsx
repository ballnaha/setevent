'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Skeleton,
    Chip,
    Stack,
} from '@mui/material';
import { Calendar, Location, TickCircle, ArrowRight2, Clock } from 'iconsax-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import { initializeLiff, LiffProfile } from '@/lib/liff';
import { Drawer } from 'vaul';

interface EventTimeline {
    id: string;
    title: string;
    description: string | null;
    images: string | null;
    progress: number | null;
    status: string;
    order: number;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
}

interface EventData {
    id: string;
    eventName: string;
    inviteCode: string;
    eventDate: string | null;
    venue: string | null;
    description: string | null;
    status: string;
    timelines: EventTimeline[];
}

interface EventSummary {
    id: string;
    eventName: string;
    inviteCode: string;
    eventDate: string | null;
    venue: string | null;
    status: string;
}

type PageStatus = 'loading' | 'new' | 'pending' | 'no-events' | 'select-event' | 'show-event' | 'not-found' | 'unauthorized';

export default function LiffHomePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Default to 'LAUNCH002' if no code provided (Dev Mode)
    const eventCode = searchParams.get('code') || 'LAUNCH002';

    const [status, setStatus] = useState<PageStatus>('loading');
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [event, setEvent] = useState<EventData | null>(null);
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [selectedTimeline, setSelectedTimeline] = useState<EventTimeline | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                // Initialize LIFF and get profile
                const userProfile = await initializeLiff();
                if (!userProfile) {
                    console.error('Failed to get LIFF profile');
                    return;
                }
                setProfile(userProfile);

                // Case 1: มี event code ใน URL → ไปงานนั้นตรงๆ
                if (eventCode) {
                    await loadEventByCode(eventCode, userProfile.userId);
                    return;
                }

                // Case 2: ไม่มี code (เปิดจาก Rich Menu) → ดึงรายการงานจาก LINE UID
                await loadMyEvents(userProfile.userId);

            } catch (error) {
                console.error('Init error:', error);
            }
        }
        init();
    }, [eventCode]);

    // Load event by invite code
    async function loadEventByCode(code: string, lineUid: string) {
        const res = await fetch(`/api/liff/event-by-code?code=${code}&lineUid=${lineUid}`);
        const data = await res.json();

        if (res.status === 404) {
            setStatus('not-found');
            return;
        }

        if (res.status === 403) {
            setStatus('unauthorized');
            return;
        }

        if (data.success && data.event) {
            setEvent(data.event);
            setStatus('show-event');
        }
    }

    // Load my events from LINE UID
    async function loadMyEvents(lineUid: string) {
        const res = await fetch(`/api/liff/my-events?lineUid=${lineUid}`);
        const data = await res.json();

        if (data.status === 'new') {
            setStatus('new');
            return;
        }

        if (data.status === 'pending') {
            setStatus('pending');
            return;
        }

        if (data.status === 'no-events') {
            setStatus('no-events');
            return;
        }

        // Has events
        if (data.events.length === 1) {
            // มีงานเดียว → auto redirect ไปงานนั้น
            router.replace(`/liff?code=${data.events[0].inviteCode}`);
            return;
        }

        // มีหลายงาน → แสดงรายการให้เลือก
        setEvents(data.events);
        setStatus('select-event');
    }

    // Get active step for stepper
    const getActiveStep = () => {
        if (!event?.timelines) return 0;
        const inProgressIndex = event.timelines.findIndex(t => t.status === 'in-progress');
        if (inProgressIndex !== -1) return inProgressIndex;
        const lastCompleted = event.timelines.filter(t => t.status === 'completed').length;
        return lastCompleted;
    };

    // Loading State
    if (status === 'loading') {
        return (
            <Container maxWidth="sm" sx={{ py: 3 }}>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2, borderRadius: 3 }} />
                <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
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
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 4, lineHeight: 1.8 }}
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

    // No Events
    if (status === 'no-events') {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Box sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>📋</Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        ยังไม่มีงาน
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', lineHeight: 1.8 }}
                    >
                        ทักแชทหาเราเพื่อเริ่มวางแผนงานอีเว้นท์
                        <br />
                        ทีมงานพร้อมให้บริการ
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Select Event - มีหลายงานให้เลือก
    if (status === 'select-event') {
        return (
            <Container maxWidth="sm" sx={{ py: 3 }}>
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mb: 2,
                        color: 'var(--foreground)',
                    }}
                >
                    📋 งานของคุณ ({events.length})
                </Typography>

                <Stack spacing={2}>
                    {events.map((evt) => (
                        <Link
                            key={evt.id}
                            href={`/liff?code=${evt.inviteCode}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    transition: 'all 0.2s',
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
                                            {evt.eventName}
                                        </Typography>
                                        <Chip
                                            label={getStatusLabel(evt.status)}
                                            size="small"
                                            sx={{
                                                bgcolor: getStatusColor(evt.status).bg,
                                                color: getStatusColor(evt.status).text,
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.7rem',
                                                height: 24,
                                            }}
                                        />
                                    </Box>

                                    <Stack spacing={1}>
                                        {evt.eventDate && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Calendar size={16} color="gray" variant="Bold" />
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                                    {new Date(evt.eventDate).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </Typography>
                                            </Box>
                                        )}
                                        {evt.venue && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Location size={16} color="gray" variant="Bold" />
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                                    {evt.venue}
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
            </Container>
        );
    }

    // Not Found State
    if (status === 'not-found') {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Box sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>❌</Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        ไม่พบงานนี้
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}
                    >
                        รหัสงานไม่ถูกต้องหรือถูกลบแล้ว
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Unauthorized State
    if (status === 'unauthorized') {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Box sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>🔒</Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        ไม่มีสิทธิ์เข้าถึง
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}
                    >
                        งานนี้ไม่ได้ลงทะเบียนกับบัญชี LINE ของคุณ
                    </Typography>
                </Box>
            </Container>
        );
    }

    // Show Event - แสดงรายละเอียดงาน + Timeline
    return (
        <Container maxWidth="sm" sx={{ py: 2, px: 2.5 }}>
            {/* Back button for multiple events */}
            {events.length > 1 && (
                <Link href="/liff" style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.85rem',
                            color: 'var(--primary)',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        ← กลับไปรายการงาน
                    </Typography>
                </Link>
            )}

            {/* Event Date Display */}
            {event?.eventDate && (
                <Box sx={{ mb: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.85rem',
                            color: 'rgba(0,0,0,0.5)',
                        }}
                    >
                        {new Date(event.eventDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Typography>
                </Box>
            )}

            {/* Event Name */}
            <Typography
                variant="h4"
                sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    mb: 2,
                    lineHeight: 1.2,
                }}
            >
                {event?.eventName}
            </Typography>

            {/* Event Info Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip
                    icon={<TickCircle size={14} variant="Bold" color="currentColor" />}
                    label={getStatusLabel(event?.status || '')}
                    size="small"
                    sx={{
                        bgcolor: getStatusColor(event?.status || '').bg,
                        color: getStatusColor(event?.status || '').text,
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                    }}
                />
                {event?.venue && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Location size={16} color="rgba(0,0,0,0.4)" variant="Bold" />
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>
                            {event.venue}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Timeline Section - Card Based with Drawer */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#1a1a1a',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    📋 ความคืบหน้างาน
                </Typography>

                {/* Timeline Items - แสดงเฉพาะ completed และ in-progress */}
                <Box sx={{ position: 'relative' }}>
                    {event?.timelines
                        .filter(t => t.status === 'completed' || t.status === 'in-progress')
                        .map((timeline, index, filteredArr) => {
                            const isCompleted = timeline.status === 'completed';
                            const isActive = timeline.status === 'in-progress';
                            const isLast = index === filteredArr.length - 1;

                            // Status colors
                            const getTimelineStatusColor = () => {
                                if (isCompleted) return { bg: '#10b981', light: '#d1fae5', text: 'เสร็จสิ้น' };
                                return { bg: '#3b82f6', light: '#dbeafe', text: 'กำลังดำเนินการ' };
                            };
                            const statusColor = getTimelineStatusColor();

                            // Get timestamp
                            const timestamp = timeline.completedAt || timeline.createdAt;

                            return (
                                <Box
                                    key={timeline.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        mb: isLast ? 0 : 2,
                                    }}
                                >
                                    {/* Left - Time */}
                                    <Box
                                        sx={{
                                            width: 45,
                                            flexShrink: 0,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                color: isCompleted || isActive ? '#1a1a1a' : 'rgba(0,0,0,0.4)',
                                                lineHeight: 1,
                                            }}
                                        >
                                            {new Date(timestamp).toLocaleTimeString('th-TH', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.65rem',
                                                color: 'rgba(0,0,0,0.4)',
                                                lineHeight: 1.2,
                                                mt: 0.25,
                                            }}
                                        >
                                            {new Date(timestamp).toLocaleDateString('th-TH', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </Typography>
                                    </Box>

                                    {/* Dot + Line */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            pt: 0.5,
                                        }}
                                    >
                                        {/* Dot with ring for active */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: isActive ? 18 : 12,
                                                height: isActive ? 18 : 12,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {isActive && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        borderRadius: '50%',
                                                        border: '2px solid',
                                                        borderColor: statusColor.bg,
                                                        opacity: 0.3,
                                                    }}
                                                />
                                            )}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: isActive ? 10 : 12,
                                                    height: isActive ? 10 : 12,
                                                    borderRadius: '50%',
                                                    bgcolor: statusColor.bg,
                                                }}
                                            />
                                        </Box>
                                        {/* Vertical Line */}
                                        {!isLast && (
                                            <Box
                                                sx={{
                                                    width: 2,
                                                    flex: 1,
                                                    bgcolor: '#e5e7eb',
                                                    mt: 0.5,
                                                    minHeight: 40,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Card - Clickable */}
                                    <Card
                                        onClick={() => {
                                            setSelectedTimeline(timeline);
                                            setDrawerOpen(true);
                                        }}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                            border: '1px solid',
                                            borderColor: 'rgba(0,0,0,0.06)',
                                            borderLeft: '4px solid',
                                            borderLeftColor: statusColor.bg,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                transform: 'scale(0.99)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                {/* Main Content */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    {/* Title + Chip */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <Typography
                                                            sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontWeight: 600,
                                                                fontSize: '0.9rem',
                                                                color: '#1a1a1a',
                                                                lineHeight: 1.3,
                                                                flex: 1,
                                                            }}
                                                            noWrap
                                                        >
                                                            {timeline.title}
                                                        </Typography>
                                                        <Chip
                                                            label={statusColor.text}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.6rem',
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontWeight: 600,
                                                                bgcolor: statusColor.bg,
                                                                color: 'white',
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Description - truncated */}
                                                    {timeline.description && (
                                                        <Typography
                                                            sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.75rem',
                                                                color: 'rgba(0,0,0,0.5)',
                                                                lineHeight: 1.4,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {timeline.description}
                                                        </Typography>
                                                    )}

                                                    {/* Progress indicator dots */}
                                                    {timeline.progress !== null && timeline.progress !== undefined && (
                                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                                                            {[...Array(10)].map((_, i) => (
                                                                <Box
                                                                    key={i}
                                                                    sx={{
                                                                        width: 6,
                                                                        height: 6,
                                                                        borderRadius: '50%',
                                                                        bgcolor: (i + 1) * 10 <= timeline.progress!
                                                                            ? statusColor.bg
                                                                            : '#e5e7eb',
                                                                    }}
                                                                />
                                                            ))}
                                                            <Typography
                                                                sx={{
                                                                    fontFamily: 'var(--font-prompt)',
                                                                    fontSize: '0.65rem',
                                                                    color: statusColor.bg,
                                                                    fontWeight: 600,
                                                                    ml: 0.5,
                                                                }}
                                                            >
                                                                {timeline.progress}%
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Thumbnail Image */}
                                                {(timeline.images || []).length > 0 && (() => {
                                                    let images: string[] = [];
                                                    try {
                                                        images = JSON.parse(timeline.images || '[]');
                                                    } catch (e) {
                                                        // Fallback for non-JSON string
                                                        if (timeline.images && !timeline.images.startsWith('[')) {
                                                            images = [timeline.images];
                                                        }
                                                    }

                                                    if (images.length === 0) return null;

                                                    return (
                                                        <Box
                                                            sx={{
                                                                position: 'relative',
                                                                width: 60,
                                                                height: 60,
                                                                borderRadius: 1.5,
                                                                overflow: 'hidden',
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <Box
                                                                component="img"
                                                                src={images[0]}
                                                                alt={timeline.title}
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            {images.length > 1 && (
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        inset: 0,
                                                                        bgcolor: 'rgba(0,0,0,0.5)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            color: 'white',
                                                                            fontFamily: 'var(--font-prompt)',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.85rem',
                                                                        }}
                                                                    >
                                                                        +{images.length - 1}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    );
                                                })()}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            );
                        })}
                </Box>
            </Box>

            {/* Vaul Drawer for Timeline Detail */}
            <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
                <Drawer.Portal>
                    <Drawer.Overlay
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            zIndex: 99999,
                        }}
                    />
                    <Drawer.Content
                        style={{
                            backgroundColor: 'white',
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            maxHeight: '90vh',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            zIndex: 100000,
                            outline: 'none',
                        }}
                    >
                        {/* Hidden title for accessibility */}
                        <Drawer.Title style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                            รายละเอียดความคืบหน้า
                        </Drawer.Title>
                        {/* Handle */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                pt: 1.5,
                                pb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                }}
                            />
                        </Box>

                        {selectedTimeline && (
                            <Box
                                sx={{
                                    px: 3,
                                    pb: 4,
                                    maxHeight: 'calc(90vh - 40px)',
                                    overflowY: 'auto',
                                }}
                            >
                                {/* Status Chip */}
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={
                                            selectedTimeline.status === 'completed' ? 'เสร็จสิ้น' :
                                                selectedTimeline.status === 'in-progress' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'
                                        }
                                        size="small"
                                        sx={{
                                            height: 26,
                                            fontSize: '0.75rem',
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            bgcolor: selectedTimeline.status === 'completed' ? '#10b981' :
                                                selectedTimeline.status === 'in-progress' ? '#3b82f6' : '#9ca3af',
                                            color: 'white',
                                        }}
                                    />
                                </Box>

                                {/* Title */}
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        fontSize: '1.25rem',
                                        color: '#1a1a1a',
                                        mb: 1,
                                    }}
                                >
                                    {selectedTimeline.title}
                                </Typography>

                                {/* Timestamp */}
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.85rem',
                                        color: 'rgba(0,0,0,0.5)',
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}
                                >
                                    <Clock size={16} variant="Bold" />
                                    {new Date(selectedTimeline.completedAt || selectedTimeline.createdAt).toLocaleDateString('th-TH', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                    {' '}
                                    {new Date(selectedTimeline.completedAt || selectedTimeline.createdAt).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} น.
                                </Typography>

                                {/* Description */}
                                {selectedTimeline.description && (
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.95rem',
                                            color: 'rgba(0,0,0,0.7)',
                                            lineHeight: 1.6,
                                            mb: 2,
                                        }}
                                    >
                                        {selectedTimeline.description}
                                    </Typography>
                                )}

                                {/* Progress Bar */}
                                {selectedTimeline.progress !== null && selectedTimeline.progress !== undefined && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(0,0,0,0.6)',
                                                }}
                                            >
                                                ความคืบหน้า
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 700,
                                                    color: selectedTimeline.status === 'completed' ? '#10b981' :
                                                        selectedTimeline.status === 'in-progress' ? '#3b82f6' : '#9ca3af',
                                                }}
                                            >
                                                {selectedTimeline.progress}%
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                height: 10,
                                                bgcolor: '#e5e7eb',
                                                borderRadius: 5,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: `${selectedTimeline.progress}%`,
                                                    height: '100%',
                                                    bgcolor: selectedTimeline.status === 'completed' ? '#10b981' :
                                                        selectedTimeline.status === 'in-progress' ? '#3b82f6' : '#9ca3af',
                                                    borderRadius: 5,
                                                    transition: 'width 0.5s ease',
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {/* Images - Swiper Gallery */}
                                {(() => {
                                    let images: string[] = [];
                                    try {
                                        images = JSON.parse(selectedTimeline.images || '[]');
                                    } catch (e) {
                                        if (selectedTimeline.images && !selectedTimeline.images.startsWith('[')) {
                                            images = [selectedTimeline.images];
                                        }
                                    }

                                    if (images.length === 0) return null;

                                    return (
                                        <Box sx={{
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            bgcolor: '#f9fafb',
                                            '& .swiper-pagination-bullet-active': {
                                                bgcolor: selectedTimeline.status === 'completed' ? '#10b981' :
                                                    selectedTimeline.status === 'in-progress' ? '#3b82f6' : '#9ca3af',
                                            }
                                        }}>
                                            <Swiper
                                                modules={[Pagination]}
                                                spaceBetween={10}
                                                slidesPerView={1}
                                                pagination={{ clickable: true }}
                                                style={{ width: '100%', paddingBottom: images.length > 1 ? 30 : 0 }}
                                            >
                                                {images.map((img, i) => (
                                                    <SwiperSlide key={i}>
                                                        <Box
                                                            onClick={() => window.open(img, '_blank')}
                                                            sx={{
                                                                width: '100%',
                                                                aspectRatio: '4/3',
                                                                cursor: 'pointer',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <Box
                                                                component="img"
                                                                src={img}
                                                                alt={`Evidence ${i + 1}`}
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    bottom: 8,
                                                                    right: 8,
                                                                    bgcolor: 'rgba(0,0,0,0.6)',
                                                                    color: 'white',
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontSize: '0.7rem',
                                                                    fontFamily: 'var(--font-prompt)',
                                                                }}
                                                            >
                                                                🔍 แตะเพื่อขยาย
                                                            </Box>
                                                        </Box>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </Box>
                                    );
                                })()}
                            </Box>
                        )}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </Container>
    );
}

// Helper functions
function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        'draft': 'แบบร่าง',
        'confirmed': 'ยืนยันแล้ว',
        'in-progress': 'กำลังดำเนินการ',
        'completed': 'เสร็จสิ้น',
        'cancelled': 'ยกเลิก',
    };
    return labels[status] || status;
}

function getStatusColor(status: string): { bg: string; text: string } {
    const colors: Record<string, { bg: string; text: string }> = {
        'draft': { bg: 'rgba(156, 163, 175, 0.2)', text: '#6b7280' },
        'confirmed': { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
        'in-progress': { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
        'completed': { bg: 'rgba(10, 92, 90, 0.2)', text: 'var(--primary)' },
        'cancelled': { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
    };
    return colors[status] || { bg: 'rgba(156, 163, 175, 0.2)', text: '#6b7280' };
}
