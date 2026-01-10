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
import { ArrowRight2, Clock, ArrowUp2, Instagram, DocumentText, Call, Gallery, User, Music, MagicStar, Monitor } from 'iconsax-react';
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
        setStatus('loading');
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
                <LiffHeader
                    onSearch={setSearchTerm}
                    searchValue={searchTerm}
                    onClear={() => setSearchTerm('')}
                />
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

                        {/* No Results State */}
                        {filteredEvents.length === 0 && searchTerm ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 6,
                                    px: 3,
                                }}
                            >
                                {/* Search Not Found Illustration */}
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                    }}
                                >
                                    <Typography sx={{ fontSize: '2.5rem' }}>🔍</Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        color: '#1E293B',
                                        mb: 1,
                                    }}
                                >
                                    ไม่พบโปรเจกต์
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.9rem',
                                        color: '#94A3B8',
                                        textAlign: 'center',
                                        mb: 3,
                                    }}
                                >
                                    ไม่พบผลลัพธ์สำหรับ "<strong style={{ color: '#3B82F6' }}>{searchTerm}</strong>"
                                    <br />
                                    ลองค้นหาด้วยคำอื่น
                                </Typography>

                                {/* Clear Search Button */}
                                <Box
                                    onClick={() => setSearchTerm('')}
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 3,
                                        bgcolor: '#3B82F6',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)',
                                        }
                                    }}
                                >
                                    ✕ ล้างการค้นหา
                                </Box>
                            </Box>
                        ) : (
                            /* Horizontal Scroll Container */
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
                                                                    {evt.tasksCount || 0} Messages
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
                        )}
                    </Box>

                    {/* Quick Services Menu - NEW Section */}
                    <Box sx={{ mb: 4, px: 2 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B', mb: 2, px: 1 }}>
                            Quick Actions
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 2,
                                bgcolor: 'white',
                                p: 2,
                                borderRadius: 4,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                            }}
                        >
                            {[
                                { icon: <DocumentText size={24} variant="Bulk" color="#3B82F6" />, label: 'ขอใบเสนอราคา', bg: '#EFF6FF' },
                                { icon: <Call size={24} variant="Bulk" color="#10B981" />, label: 'ติดต่อเรา', bg: '#ECFDF5' },
                                { icon: <Gallery size={24} variant="Bulk" color="#F59E0B" />, label: 'ผลงาน', bg: '#FFFBEB' },
                                { icon: <User size={24} variant="Bulk" color="#8B5CF6" />, label: 'โปรไฟล์', bg: '#F5F3FF' },
                            ].map((item, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:active': { transform: 'scale(0.95)' }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            bgcolor: item.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 0.5
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.7rem',
                                            color: '#64748B',
                                            textAlign: 'center',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Service Highlights - NEW Section */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 3 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                Our Services
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#3B82F6', fontWeight: 600 }}>
                                View All &gt;
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                px: 3,
                                mx: -2,
                                pb: 2,
                                '::-webkit-scrollbar': { display: 'none' },
                                scrollbarWidth: 'none'
                            }}
                        >
                            {[
                                { title: 'Sound System', desc: 'เครื่องเสียงคุณภาพสูง', icon: <Music size={24} color="white" />, color: '#00C2CB' },
                                { title: 'Lighting', desc: 'ระบบแสง สี เสียง', icon: <MagicStar size={24} color="white" />, color: '#F2A900' },
                                { title: 'LED Screen', desc: 'จอภาพคมชัด', icon: <Monitor size={24} color="white" />, color: '#E94560' },
                            ].map((service, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        minWidth: 160,
                                        p: 2,
                                        borderRadius: 4,
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                        cursor: 'pointer',
                                        border: '1px solid #F8FAFC'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: service.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 4px 10px ${service.color}40`
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>
                                            {service.title}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: '#94A3B8' }}>
                                            {service.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
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

    // No Events State - Professional Empty State
    if (status === 'no-events' || status === 'new' || status === 'pending') {
        return (
            <>
                <LiffHeader onSearch={setSearchTerm} />
                <Container maxWidth="sm" sx={{ pb: 10, bgcolor: '#FFFFFF' }}>
                    <Box
                        sx={{
                            minHeight: 'calc(100vh - 200px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            px: 3,
                        }}
                    >
                        {/* Animated Illustration Container */}
                        <Box
                            sx={{
                                position: 'relative',
                                width: 200,
                                height: 200,
                                mb: 4,
                            }}
                        >
                            {/* Background Glow */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 180,
                                    height: 180,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)',
                                    filter: 'blur(30px)',
                                    animation: 'pulse 3s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.6 },
                                        '50%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 0.8 },
                                    },
                                }}
                            />

                            {/* Main Card Illustration */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 140,
                                    height: 100,
                                    borderRadius: 4,
                                    background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 25px rgba(59, 130, 246, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    animation: 'float 4s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0px)' },
                                        '50%': { transform: 'translate(-50%, -50%) translateY(-10px)' },
                                    },
                                }}
                            >
                                {/* Calendar Icon */}
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                                        mb: 1,
                                    }}
                                >
                                    <Clock size={24} color="#FFFFFF" variant="Bold" />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#E2E8F0' }} />
                                    <Box sx={{ width: 20, height: 4, borderRadius: 2, bgcolor: '#F1F5F9' }} />
                                </Box>
                            </Box>

                            {/* Floating Decorative Elements */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #F472B6 0%, #FB7185 100%)',
                                    boxShadow: '0 4px 12px rgba(244, 114, 182, 0.4)',
                                    animation: 'floatSmall 3s ease-in-out infinite 0.5s',
                                    '@keyframes floatSmall': {
                                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                                        '50%': { transform: 'translateY(-8px) rotate(10deg)' },
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 30,
                                    left: 15,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                                    animation: 'floatSmall 3.5s ease-in-out infinite 1s',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 50,
                                    left: 25,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                                    animation: 'floatSmall 4s ease-in-out infinite 0.2s',
                                }}
                            />
                        </Box>

                        {/* Welcome Message */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                color: '#1E293B',
                                mb: 1.5,
                                background: 'linear-gradient(135deg, #1E293B 0%, #3B82F6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {status === 'new' ? 'ยินดีต้อนรับ! 🎉' : status === 'pending' ? 'กำลังตรวจสอบ...' : 'ยังไม่มีโปรเจกต์'}
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: '#64748B',
                                fontSize: '0.95rem',
                                lineHeight: 1.7,
                                maxWidth: 280,
                                mb: 4,
                            }}
                        >
                            {status === 'new'
                                ? 'ขอบคุณที่สนใจบริการของเรา ทีมงานจะติดต่อกลับเร็วๆ นี้'
                                : status === 'pending'
                                    ? 'เรากำลังตรวจสอบข้อมูลของคุณ กรุณารอสักครู่'
                                    : 'คุณยังไม่มีโปรเจกต์ที่กำลังดำเนินการ เมื่อมีงานใหม่จะแสดงที่นี่'}
                        </Typography>

                        {/* Status Card */}
                        <Card
                            sx={{
                                width: '100%',
                                maxWidth: 320,
                                borderRadius: 4,
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    height: 4,
                                    background: status === 'pending'
                                        ? 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)'
                                        : 'linear-gradient(90deg, #3B82F6, #8B5CF6, #3B82F6)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 2s linear infinite',
                                    '@keyframes shimmer': {
                                        '0%': { backgroundPosition: '200% 0' },
                                        '100%': { backgroundPosition: '-200% 0' },
                                    },
                                }}
                            />
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            background: status === 'pending'
                                                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)'
                                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {status === 'pending' ? (
                                            <Clock size={24} color="#F59E0B" variant="Bulk" />
                                        ) : (
                                            <Instagram size={24} color="#3B82F6" variant="Bulk" />
                                        )}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                color: '#1E293B',
                                                mb: 0.5,
                                            }}
                                        >
                                            {status === 'pending' ? 'รอการยืนยัน' : 'พร้อมเริ่มต้น'}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.8rem',
                                                color: '#94A3B8',
                                            }}
                                        >
                                            {status === 'pending' ? 'ทีมงานกำลังดำเนินการ' : 'ติดตามงานได้ที่นี่'}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={status === 'pending' ? 'รอดำเนินการ' : 'ใหม่'}
                                        size="small"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            height: 24,
                                            bgcolor: status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: status === 'pending' ? '#F59E0B' : '#3B82F6',
                                            border: 'none',
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.8rem',
                                color: '#94A3B8',
                                mt: 4,
                            }}
                        >
                            มีคำถาม? ติดต่อเราได้ตลอดเวลา 💬
                        </Typography>
                    </Box>
                </Container>
            </>
        );
    }


    // Show Event - แสดงรายละเอียดงาน + Timeline
    if (status === 'show-event' && event) {
        return <EventTimeline event={event} />;
    }

    // Loading State - Professional Skeleton UI
    if (status === 'loading') {
        const isDetailLoading = !!eventCode;

        if (isDetailLoading) {
            return (
                <Box sx={{ pb: 10, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
                    {/* Header Skeleton */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                            pb: 6,
                        }}
                    >
                        <Container maxWidth="sm" sx={{ py: 2.5 }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                <Skeleton variant="rounded" width={38} height={38} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                    <Skeleton variant="text" width="40%" height={18} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                </Box>
                                <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
                            </Stack>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                                <Skeleton variant="rounded" width={60} height={32} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
                            </Stack>

                            <Box sx={{ display: 'flex', gap: 1, overflowX: 'hidden', mx: -2, px: 2 }}>
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <Skeleton key={i} variant="rounded" width={44} height={50} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                                ))}
                            </Box>
                        </Container>
                    </Box>

                    {/* Content Skeleton */}
                    <Box
                        sx={{
                            bgcolor: 'white',
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            mt: -5,
                            pt: 4,
                            minHeight: 'calc(100vh - 280px)',
                            position: 'relative',
                            zIndex: 20,
                        }}
                    >
                        <Container maxWidth="sm">
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <Box sx={{ width: 50, pt: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Skeleton variant="text" width={40} height={20} />
                                        <Skeleton variant="text" width={30} height={14} />
                                    </Box>
                                    <Box sx={{ width: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Skeleton variant="circular" width={10} height={10} />
                                        <Box sx={{ flex: 1, width: 2, bgcolor: '#F1F5F9', my: 1 }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #F1F5F9' }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                                                <Skeleton variant="text" width="90%" height={18} />
                                                <Skeleton variant="text" width="70%" height={18} />
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>
                            ))}
                        </Container>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                {/* Skeleton Header */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #EBF4FF 0%, #F0F7FF 50%, #FDF2F8 100%)',
                        pt: 4,
                        pb: 3,
                        px: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Skeleton
                            variant="circular"
                            width={56}
                            height={56}
                            sx={{ bgcolor: 'rgba(255,255,255,0.6)' }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton
                                variant="text"
                                width="60%"
                                height={24}
                                sx={{ bgcolor: 'rgba(255,255,255,0.6)', mb: 0.5 }}
                            />
                            <Skeleton
                                variant="text"
                                width="40%"
                                height={18}
                                sx={{ bgcolor: 'rgba(255,255,255,0.6)' }}
                            />
                        </Box>
                    </Box>
                    <Skeleton
                        variant="rounded"
                        height={44}
                        sx={{ bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 3 }}
                    />
                </Box>

                <Container maxWidth="sm" sx={{ pb: 10, bgcolor: '#FFFFFF' }}>
                    {/* My Projects Section Skeleton */}
                    <Box sx={{ mb: 4, pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                            <Skeleton variant="text" width={120} height={28} />
                            <Skeleton variant="text" width={60} height={20} />
                        </Box>

                        {/* Project Cards Skeleton */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'hidden',
                                pb: 2,
                                px: 1,
                            }}
                        >
                            {[1, 2].map((i) => (
                                <Card
                                    key={i}
                                    sx={{
                                        minWidth: 260,
                                        borderRadius: 4,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        {/* Title Skeleton */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
                                                <Skeleton variant="text" width="50%" height={18} />
                                            </Box>
                                        </Box>

                                        <Skeleton variant="rectangular" height={1} sx={{ my: 1.5 }} />

                                        {/* Footer Skeleton */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Skeleton variant="circular" width={32} height={32} />
                                            <Box>
                                                <Skeleton variant="text" width={80} height={16} sx={{ mb: 0.5 }} />
                                                <Skeleton variant="text" width={60} height={16} />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>

                    {/* Progress Section Skeleton */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                            <Skeleton variant="text" width={100} height={28} />
                            <Skeleton variant="text" width={70} height={20} />
                        </Box>

                        {/* Featured Card Skeleton */}
                        <Card
                            sx={{
                                borderRadius: 5,
                                boxShadow: 'none',
                                background: 'linear-gradient(160deg, #F0F4FF 0%, #FFFFFF 60%, #FFF1F2 100%)',
                                mb: 4,
                                p: 1,
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Skeleton variant="circular" width={24} height={24} />
                                </Box>

                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Skeleton variant="text" width="60%" height={28} sx={{ mx: 'auto', mb: 1 }} />
                                    <Skeleton variant="text" width="80%" height={18} sx={{ mx: 'auto' }} />
                                    <Skeleton variant="text" width="70%" height={18} sx={{ mx: 'auto' }} />
                                </Box>

                                <Skeleton variant="rectangular" height={1} sx={{ my: 3 }} />

                                {/* Calendar Strip Skeleton */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 3 }}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton
                                            key={i}
                                            variant="rounded"
                                            sx={{
                                                flex: 1,
                                                height: 70,
                                                borderRadius: 4,
                                            }}
                                        />
                                    ))}
                                </Box>

                                {/* Avatar Row Skeleton */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton
                                            key={i}
                                            variant="circular"
                                            width={36}
                                            height={36}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Loading Indicator */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4,
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                border: '3px solid #E2E8F0',
                                borderTopColor: '#3B82F6',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                },
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: '#94A3B8',
                                fontSize: '0.9rem',
                                mt: 2,
                            }}
                        >
                            กำลังโหลด...
                        </Typography>
                    </Box>
                </Container>
            </>
        );
    }


    {/* Quick Services Menu - NEW Section */ }
    <Box sx={{ mb: 4, px: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B', mb: 2, px: 1 }}>
            Quick Actions
        </Typography>
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                bgcolor: 'white',
                p: 2,
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
        >
            {[
                { icon: <DocumentText size={24} variant="Bulk" color="#3B82F6" />, label: 'ขอใบเสนอราคา', bg: '#EFF6FF' },
                { icon: <Call size={24} variant="Bulk" color="#10B981" />, label: 'ติดต่อเรา', bg: '#ECFDF5' },
                { icon: <Gallery size={24} variant="Bulk" color="#F59E0B" />, label: 'ผลงาน', bg: '#FFFBEB' },
                { icon: <User size={24} variant="Bulk" color="#8B5CF6" />, label: 'โปรไฟล์', bg: '#F5F3FF' },
            ].map((item, idx) => (
                <Box
                    key={idx}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:active': { transform: 'scale(0.95)' }
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: item.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 0.5
                        }}
                    >
                        {item.icon}
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.7rem',
                            color: '#64748B',
                            textAlign: 'center',
                            lineHeight: 1.2
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    </Box>

    {/* Service Highlights - NEW Section */ }
    <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                Our Services
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#3B82F6', fontWeight: 600 }}>
                View All &gt;
            </Typography>
        </Box>

        <Box
            sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                px: 3,
                mx: -2,
                pb: 2,
                '::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none'
            }}
        >
            {[
                { title: 'Sound System', desc: 'เครื่องเสียงคุณภาพสูง', icon: <Music size={24} color="white" />, color: '#00C2CB' },
                { title: 'Lighting', desc: 'ระบบแสง สี เสียง', icon: <MagicStar size={24} color="white" />, color: '#F2A900' },
                { title: 'LED Screen', desc: 'จอภาพคมชัด', icon: <Monitor size={24} color="white" />, color: '#E94560' },
            ].map((service, idx) => (
                <Box
                    key={idx}
                    sx={{
                        minWidth: 160,
                        p: 2,
                        borderRadius: 4,
                        bgcolor: 'white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        cursor: 'pointer',
                        border: '1px solid #F8FAFC'
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: service.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 10px ${service.color}40`
                        }}
                    >
                        {service.icon}
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>
                            {service.title}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: '#94A3B8' }}>
                            {service.desc}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>

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
