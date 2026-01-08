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
import { ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';
import { initializeLiff, LiffProfile } from '@/lib/liff';
import LiffHeader from './components/LiffHeader';
import EventTimeline from './components/EventTimeline';
import { EventData, EventSummary, EventTimeline as EventTimelineType } from './types';


type PageStatus = 'loading' | 'new' | 'pending' | 'no-events' | 'select-event' | 'show-event' | 'not-found' | 'unauthorized';

function LiffContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Default to 'LAUNCH002' if no code provided (Dev Mode)
    const eventCode = searchParams.get('code') || 'LAUNCH002';

    const [status, setStatus] = useState<PageStatus>('loading');
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [event, setEvent] = useState<EventData | null>(null);
    const [events, setEvents] = useState<EventSummary[]>([]);

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

    // Helper functions for Status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return { bg: '#10B981', text: '#fff' };
            case 'in-progress': return { bg: '#3B82F6', text: '#fff' };
            case 'pending': return { bg: '#F59E0B', text: '#fff' };
            default: return { bg: '#94A3B8', text: '#fff' };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in-progress': return 'In Progress';
            case 'pending': return 'Pending';
            default: return 'Draft';
        }
    };

    // Loading State
    if (status === 'loading') {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4, mb: 4 }} />
                <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
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
                        ยินดีต้อนรับ!
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 4 }}
                    >
                        คุณยังไม่มีรายการงานที่เกี่ยวข้อง
                        <br />
                        กรุณาติดต่อเจ้าหน้าที่เพื่อลงทะเบียน
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
                    <Typography sx={{ fontSize: '4rem', mb: 2 }}>⏳</Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2 }}
                    >
                        รอการยืนยัน
                    </Typography>
                    <Typography
                        sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 4 }}
                    >
                        เจ้าหน้าที่ได้รับข้อมูลของคุณแล้ว
                        <br />
                        กรุณารอการตรวจสอบสักครู่...
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
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Box sx={{ position: 'relative', zIndex: 10, mt: -4 }}>
                    <Box
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 4,
                            p: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            textAlign: 'center'
                        }}
                    >
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {events.map((evt) => (
                                <Link key={evt.id} href={`/liff?code=${evt.inviteCode}`} style={{ textDecoration: 'none' }}>
                                    <Card
                                        sx={{
                                            boxShadow: 'none',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: 3,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: '#3B82F6',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="body1" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1E293B' }}>
                                                    {evt.eventName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B' }}>
                                                    {evt.venue || 'No location'}
                                                </Typography>
                                            </Box>
                                            <ArrowRight2 size={20} color="#94A3B8" />
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Container>
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
                <LiffHeader />
                <LiffContent />
            </Box>
        </Suspense>
    );
}
