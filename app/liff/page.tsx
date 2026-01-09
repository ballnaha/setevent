'use client';

import { useEffect, useState, Suspense } from 'react';
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
import { ArrowRight2, Clock, ArrowUp2, Instagram } from 'iconsax-react';
import Link from 'next/link';
import { initializeLiff, LiffProfile } from '@/lib/liff';
import LiffHeader from './components/LiffHeader';
import EventTimeline from './components/EventTimeline';
import { EventData, EventSummary, EventTimeline as EventTimelineType } from './types';
import { format } from 'date-fns';


type PageStatus = 'loading' | 'new' | 'pending' | 'no-events' | 'select-event' | 'show-event' | 'not-found' | 'unauthorized';

function LiffContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Default to 'LAUNCH002' if no code provided (Dev Mode)
    const eventCode = searchParams.get('inviteCode');

    const [status, setStatus] = useState<PageStatus>('loading');
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [event, setEvent] = useState<EventData | null>(null);
    const [events, setEvents] = useState<EventSummary[]>([]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = events.filter(evt =>
        evt.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evt.venue && evt.venue.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        async function init() {
            try {
                // Initialize LIFF and get profile
                const userProfile = await initializeLiff();
                if (!userProfile) {
                    console.error('Failed to get LIFF profile');
                    // In production you might want to show error or redirect
                    // For now, let's just proceed to allow testing if possible or show generic error
                    // But actually if liff fails we can't do much.
                    // return; 
                    // Let's assume on localhost we might not get profile if not mocked correctly,
                    // but our lib handles mock.
                }
                setProfile(userProfile);

                // Case 1: มี event code ใน URL → ไปงานนั้นตรงๆ
                if (eventCode) {
                    await loadEventByCode(eventCode, userProfile?.userId || 'mock-id'); // Fallback for safety
                    return;
                }

                // Case 2: ไม่มี code (เปิดจาก Rich Menu) → ดึงรายการงานจาก LINE UID
                if (userProfile?.userId) {
                    await loadMyEvents(userProfile.userId);
                }

            } catch (error) {
                console.error('Init error:', error);
            }
        }
        init();
    }, [eventCode]);

    // Load event by invite code
    async function loadEventByCode(code: string, lineUid: string) {
        const res = await fetch(`/api/liff/event-by-code?inviteCode=${code}&lineUid=${lineUid}`);
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

        // Has events - Always show list first as requested
        setEvents(data.events);
        setStatus('select-event');
    }

    // Helper functions for Status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return { bg: '#10B981', text: '#fff' };   // Green
            case 'in-progress': return { bg: '#F59E0B', text: '#fff' }; // Orange
            case 'confirmed': return { bg: '#3B82F6', text: '#fff' };   // Blue
            case 'cancelled': return { bg: '#EF4444', text: '#fff' };   // Red
            case 'draft': return { bg: '#6B7280', text: '#fff' };       // Gray
            case 'pending': return { bg: '#F59E0B', text: '#fff' };     // Orange (if used)
            default: return { bg: '#94A3B8', text: '#fff' };            // Default Gray
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'จบงานแล้ว';
            case 'in-progress': return 'กำลังดำเนินการ';
            case 'confirmed': return 'ยืนยันแล้ว';
            case 'pending': return 'รอตรวจสอบ';
            default: return 'ทั่วไป';
        }
    };

    // Dashboard (My Projects + Progress)
    if (status === 'select-event') {
        const today = new Date();
        const days = Array.from({ length: 5 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() + i);
            return d;
        });

        return (
            <>
                <LiffHeader onSearch={setSearchTerm} />
                <Container maxWidth="sm" sx={{ pb: 10, bgcolor: '#FFFFFF' }}>

                    {/* My Project Section */}
                    <Box sx={{ mb: 4, pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                My Project
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#3B82F6', cursor: 'pointer', fontWeight: 600 }}>
                                See All &gt;
                            </Typography>
                        </Box>

                        {/* Horizontal Scroll Container */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                pb: 2,
                                px: 3, // Inner padding to align with container
                                mx: -2, // Negative margin to allow full bleed scroll
                                '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
                                scrollbarWidth: 'none'
                            }}
                        >
                            {filteredEvents.map((evt, index) => {
                                // Color based on status
                                const color = getStatusColor(evt.status).bg;
                                return (
                                    <Link key={evt.id} href={`/liff?inviteCode=${evt.inviteCode}`} style={{ textDecoration: 'none' }}>
                                        <Card
                                            sx={{
                                                minWidth: 260,
                                                borderRadius: 4,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                                border: 'none',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(0.98)' }
                                            }}
                                        >
                                            {/* Colored Small Strip Indicator */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 28,
                                                    height: 40,
                                                    width: 4,
                                                    bgcolor: color,
                                                    borderTopRightRadius: 4,
                                                    borderBottomRightRadius: 4
                                                }}
                                            />

                                            <CardContent sx={{ p: 2.5, pl: 3 }}>
                                                {/* Title & Menu */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontWeight: 700,
                                                            color: '#1E293B',
                                                            lineHeight: 1.3,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            maxWidth: '85%'
                                                        }}
                                                    >
                                                        {evt.eventName}
                                                    </Typography>
                                                    <Box sx={{ color: '#CBD5E1', mt: -0.5 }}>•••</Box>
                                                </Box>

                                                {/* Venue - Optional (kept subtle) */}
                                                {evt.venue && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            color: '#94A3B8',
                                                            display: 'block',
                                                            mb: 1,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                    >
                                                        📍 {evt.venue}
                                                    </Typography>
                                                )}

                                                <Box sx={{ height: 1.5, bgcolor: '#E2E8F0', my: 1.5 }} />

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    {/* Avatar (Left) */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {evt.customerPictureUrl ? (
                                                            <Box
                                                                component="img"
                                                                src={evt.customerPictureUrl}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    bgcolor: '#F1F5F9',
                                                                    border: '2px solid white',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    bgcolor: '#F1F5F9',
                                                                    border: '2px solid white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#94A3B8',
                                                                    fontSize: '14px'
                                                                }}
                                                            >
                                                                <Instagram size={18} variant="Bold" color="#CBD5E1" />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* Info Stack (Right) */}
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                                                        {/* Date */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
                                                            <Clock size={14} variant="Outline" color="#94A3B8" />
                                                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', lineHeight: 1 }}>
                                                                {evt.eventDate ? format(new Date(evt.eventDate), 'dd/MM/yyyy') : '-'}
                                                            </Typography>
                                                        </Box>
                                                        {/* Tasks */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
                                                            <Clock size={14} variant="Outline" color="#94A3B8" />
                                                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', lineHeight: 1 }}>
                                                                {evt.tasksCount || 0} Task
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Progress Section */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                Progress
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer' }}>
                                <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B' }}>
                                    All Stats
                                </Typography>
                                <ArrowRight2 size={14} color="#64748B" />
                            </Stack>
                        </Box>

                        {/* Featured Card */}
                        <Card
                            sx={{
                                borderRadius: 5,
                                boxShadow: 'none',
                                // Try to match the blurry/glassy look in image if possible, but simple gradient is safer
                                background: 'linear-gradient(160deg, #F0F4FF 0%, #FFFFFF 60%, #FFF1F2 100%)',
                                mb: 4,
                                p: 1
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                    <ArrowUp2 size={24} color="#CBD5E1" variant="Bold" />
                                </Box>
                                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B', mb: 1 }}>
                                    Create and Check<br />Daily Task
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#94A3B8', mb: 3, maxWidth: '90%', lineHeight: 1.5 }}>
                                    You can control the execution of a task by a command in the application
                                </Typography>

                                <Box sx={{ height: 1, bgcolor: '#F1F5F9', my: 3 }} />

                                {/* Calendar Strip (Pills) */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 3 }}>
                                    {days.map((date, i) => {
                                        const isSelected = i === 0; // Select first day as example
                                        return (
                                            <Box
                                                key={i}
                                                sx={{
                                                    flex: 1,
                                                    bgcolor: isSelected ? '#3B82F6' : '#FFFFFF',
                                                    borderRadius: 4,
                                                    py: 1.5,
                                                    textAlign: 'center',
                                                    boxShadow: isSelected ? '0 8px 16px rgba(59, 130, 246, 0.25)' : 'none',
                                                    color: isSelected ? 'white' : '#1E293B',
                                                    border: isSelected ? 'none' : '1px solid #F8FAFC'
                                                }}
                                            >
                                                <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, display: 'block', mb: 0.5, opacity: isSelected ? 0.9 : 0.5, fontSize: '0.65rem' }}>
                                                    {format(date, 'EEE').toUpperCase()}
                                                </Typography>
                                                <Box sx={{ width: 12, height: 2, bgcolor: isSelected ? 'rgba(255,255,255,0.4)' : '#F1F5F9', mx: 'auto', mb: 0.5, borderRadius: 1 }} />
                                                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, lineHeight: 1 }}>
                                                    {format(date, 'd')}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                {/* Avatar Footer */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    {['#F472B6', '#FB923C', '#2DD4BF', '#A78BFA', '#F87171'].map((bg, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                bgcolor: bg,
                                                border: '2px solid white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <Box component="img" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} sx={{ width: 24, height: 24 }} />
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </>
        );
    }

    // Not Found State
    if (status === 'not-found') {
        return (
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Box sx={{ py: 6 }}>
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>❓</Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        ไม่พบงาน
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 3, lineHeight: 1.6 }}
                    >
                        รหัสงานไม่ถูกต้อง
                        <br />
                        กรุณาตรวจสอบลิงก์ หรือติดต่อเจ้าหน้าที่
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
    if (status === 'show-event' && event) {
        return <EventTimeline event={event} />;
    }

    return null;
}


export default function LiffPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
                <LiffContent />
            </Box>
        </Suspense>
    );
}
