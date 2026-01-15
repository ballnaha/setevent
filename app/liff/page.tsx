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
    IconButton,
    Divider,
    Snackbar,
    Alert,
    Rating,
    TextField,
    Button,
} from '@mui/material';
import { ArrowRight2, Clock, ArrowUp2, Instagram, DocumentText, Call, Gallery, User, Music, MagicStar, Monitor, CloseCircle, Sms, Map, Facebook, SearchNormal, TickCircle, Calendar, Location } from 'iconsax-react';
import Link from 'next/link';
import { initializeLiff, LiffProfile } from '@/lib/liff';
import LiffHeader from './components/LiffHeader';
import EventTimeline from './components/EventTimeline';
import { EventData, EventSummary, EventTimeline as EventTimelineType } from './types';
import { format } from 'date-fns';
import { Drawer as VaulDrawer } from 'vaul';


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

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
        open: false,
        message: '',
        severity: 'info'
    });

    // Review Drawer state
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewData, setReviewData] = useState({
        step: 'form',
        candidates: [] as EventSummary[],
        eventId: '',
        rating: 5,
        comment: '',
        eventName: ''
    });
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
    const [promotions, setPromotions] = useState<any[]>([]);
    const [selectedPromo, setSelectedPromo] = useState<any>(null);
    const [promoOpen, setPromoOpen] = useState(false);

    const filteredEvents = events.filter(evt =>
        evt.status !== 'completed' &&
        (evt.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (evt.venue && evt.venue.toLowerCase().includes(searchTerm.toLowerCase())))
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

                // Fetch promotions for the main screen
                loadPromotions();

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

    async function loadPromotions() {
        try {
            const res = await fetch('/api/promotions');
            if (res.ok) {
                const data = await res.json();
                setPromotions(data);
            }
        } catch (error) {
            console.error('Failed to load promotions:', error);
        }
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

    // Contact Drawer State
    const [contactOpen, setContactOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState<any>(null);

    const handleContactClick = async () => {
        setContactOpen(true);
        try {
            const res = await fetch('/api/settings/contact');
            const data = await res.json();
            setContactInfo(data);
        } catch (error) {
            console.error('Failed to fetch contact info', error);
        }
    };

    // Contact Drawer JSX (inline variable, not a component to prevent remounting)
    const contactDrawerJSX = (
        <VaulDrawer.Root open={contactOpen} onOpenChange={setContactOpen}>
            <VaulDrawer.Portal>
                <VaulDrawer.Overlay
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 1300,
                    }}
                />
                <VaulDrawer.Content
                    style={{
                        backgroundColor: 'white',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        maxHeight: '90vh',
                        outline: 'none',
                        zIndex: 1300,
                        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
                    }}
                >
                    <VaulDrawer.Title className="sr-only">
                        ติดต่อเรา
                    </VaulDrawer.Title>
                    <Box sx={{ p: 3, pt: 1, pb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#E2E8F0' }} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                ติดต่อเรา
                            </Typography>
                            <IconButton onClick={() => setContactOpen(false)} size="small" sx={{ color: '#94A3B8' }}>
                                <CloseCircle size={24} />
                            </IconButton>
                        </Box>

                        {contactInfo ? (
                            <Stack spacing={2.5}>
                                {/* Phone */}
                                {contactInfo.phone && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Call size={24} variant="Bulk" color="#10B981" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>เบอร์โทรศัพท์</Typography>
                                            <Typography
                                                component="a"
                                                href={`tel:${contactInfo.phone}`}
                                                sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
                                            >
                                                {contactInfo.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* LINE */}
                                {contactInfo.line && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#ecfccb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Box
                                                component="svg"
                                                viewBox="0 0 24 24"
                                                sx={{ width: 24, height: 24, fill: '#06c755' }}
                                            >
                                                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>LINE Official</Typography>
                                            <Typography
                                                component="a"
                                                href={contactInfo.lineUrl || `https://line.me/R/oaMessage/@setevent`}
                                                target="_blank"
                                                sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
                                            >
                                                {contactInfo.line}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Email */}
                                {contactInfo.email && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Sms size={24} variant="Bulk" color="#3B82F6" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>อีเมล</Typography>
                                            <Typography
                                                component="a"
                                                href={`mailto:${contactInfo.email}`}
                                                sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}
                                            >
                                                {contactInfo.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Facebook */}
                                {contactInfo.facebook && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Facebook size={24} variant="Bulk" color="#1877F2" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>Facebook</Typography>
                                            <Typography
                                                component="a"
                                                href={contactInfo.facebook}
                                                target="_blank"
                                                sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', display: 'block' }}
                                            >
                                                {contactInfo.facebook.replace('https://facebook.com/', '').replace('https://www.facebook.com/', '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Instagram */}
                                {contactInfo.instagram && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Instagram size={24} variant="Bold" color="#fff" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>Instagram</Typography>
                                            <Typography
                                                component="a"
                                                href={contactInfo.instagram}
                                                target="_blank"
                                                sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', display: 'block' }}
                                            >
                                                {contactInfo.instagram.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* TikTok */}
                                {contactInfo.tiktok && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>♪</Box>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>TikTok</Typography>
                                            <Typography
                                                component="a"
                                                href={contactInfo.tiktok}
                                                target="_blank"
                                                sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', display: 'block' }}
                                            >
                                                {contactInfo.tiktok.replace('https://tiktok.com/', '').replace('https://www.tiktok.com/', '')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Divider sx={{ my: 1 }} />

                                {/* Address */}
                                {contactInfo.address && (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Map size={24} variant="Bulk" color="#64748b" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.85rem' }}>ที่อยู่</Typography>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#1E293B', lineHeight: 1.6 }}>
                                                {contactInfo.address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Map Embed (Simple Link for now or actual embed if provided) */}
                                {contactInfo.mapUrl && (
                                    <Box
                                        component="a"
                                        href={contactInfo.mapUrl}
                                        target="_blank"
                                        sx={{
                                            mt: 2,
                                            height: 120,
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            display: 'block',
                                            bgcolor: '#f1f5f9'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg" // Placeholder or static map
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            <Box sx={{ bgcolor: 'white', px: 2, py: 1, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Map size={16} color="#1E293B" />
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', fontWeight: 600 }}>ดูแผนที่</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                            </Stack>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#94A3B8' }}>กำลังโหลดข้อมูล...</Typography>
                            </Box>
                        )}
                    </Box>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </VaulDrawer.Root>
    );

    const reviewDrawerJSX = (
        <VaulDrawer.Root
            open={reviewOpen}
            onOpenChange={setReviewOpen}
            shouldScaleBackground={false}
        >
            <VaulDrawer.Portal>
                <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 z-[9999]" />
                <VaulDrawer.Content className="bg-white flex flex-col rounded-t-[24px] mt-24 fixed bottom-0 left-0 right-0 z-[10000] focus:outline-none max-h-[90vh]">
                    <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                        <VaulDrawer.Title>ให้คะแนนงาน</VaulDrawer.Title>
                    </Box>
                    <Box
                        sx={{
                            width: 32,
                            height: 4,
                            bgcolor: '#E2E8F0',
                            borderRadius: 10,
                            alignSelf: 'center',
                            my: 2
                        }}
                    />

                    <Box sx={{ p: 3, pt: 1, pb: 4, overflowy: 'auto' }}>
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 3 }}>
                            {reviewData.step === 'select' ? 'เลือกงานที่ต้องการรีวิว' : 'ให้คะแนนงาน 🎉'}
                        </Typography>

                        {reviewData.step === 'select' ? (
                            <Stack spacing={2}>
                                {reviewData.candidates.map((evt) => (
                                    <Box
                                        key={evt.id}
                                        onClick={() => setReviewData({
                                            ...reviewData,
                                            step: 'form',
                                            eventId: evt.id,
                                            eventName: evt.eventName
                                        })}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            border: '1px solid #E2E8F0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:active': { bgcolor: '#F8FAFC', transform: 'scale(0.98)' }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: '#FEF3C7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#F59E0B'
                                        }}>
                                            <MagicStar size={20} variant="Bulk" />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1E293B' }}>
                                                {evt.eventName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#94A3B8' }}>
                                                {evt.eventDate ? format(new Date(evt.eventDate), 'dd MMM yyyy') : '-'}
                                            </Typography>
                                        </Box>
                                        <ArrowRight2 size={16} color="#CBD5E1" />
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <>
                                <Box sx={{ mb: 4, textAlign: 'center' }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', mb: 1 }}>
                                        {reviewData.eventName}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                        <Rating
                                            name="event-rating"
                                            value={reviewData.rating}
                                            onChange={(_, newValue) => {
                                                setReviewData({ ...reviewData, rating: newValue || 5 });
                                            }}
                                            size="large"
                                            sx={{ fontSize: '3rem' }}
                                        />
                                    </Box>
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="ความคิดเห็นเพิ่มเติม (ไม่บังคับ)"
                                    variant="outlined"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        sx: { fontFamily: 'var(--font-prompt)', borderRadius: 3 }
                                    }}
                                    InputLabelProps={{
                                        sx: { fontFamily: 'var(--font-prompt)' }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={isReviewSubmitting}
                                    onClick={async () => {
                                        setIsReviewSubmitting(true);
                                        try {
                                            const res = await fetch('/api/liff/review', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    eventId: reviewData.eventId,
                                                    rating: reviewData.rating,
                                                    comment: reviewData.comment
                                                }),
                                            });

                                            if (!res.ok) throw new Error('Failed to save review');

                                            setSnackbar({ open: true, message: 'ขอบคุณสำหรับคะแนนครับ! 🙏', severity: 'success' });
                                            setReviewOpen(false);
                                        } catch (error) {
                                            console.error(error);
                                            setSnackbar({ open: true, message: 'เกิดข้อผิดพลาด กรุณาลองใหม่', severity: 'error' });
                                        } finally {
                                            setIsReviewSubmitting(false);
                                        }
                                    }}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontFamily: 'var(--font-prompt)',
                                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                                    }}
                                >
                                    {isReviewSubmitting ? 'กำลังส่ง...' : 'ส่งคะแนน'}
                                </Button>
                            </>
                        )}
                    </Box>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </VaulDrawer.Root>
    );

    // Promotion Detail Drawer JSX
    const promotionDrawerJSX = (
        <VaulDrawer.Root open={promoOpen} onOpenChange={setPromoOpen}>
            <VaulDrawer.Portal>
                <VaulDrawer.Overlay
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 1300,
                        backdropFilter: 'blur(4px)'
                    }}
                />
                <VaulDrawer.Content
                    style={{
                        backgroundColor: '#1E293B',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        maxHeight: '94vh',
                        outline: 'none',
                        zIndex: 1300,
                        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
                        color: 'white'
                    }}
                >
                    <VaulDrawer.Title className="sr-only">
                        รายละเอียดโปรโมชั่น
                    </VaulDrawer.Title>
                    <Box sx={{ overflowY: 'auto', maxHeight: '94vh', pb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
                            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                        </Box>

                        <Box sx={{ position: 'relative', px: 3, pt: 1, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                                โปรโมชั่นพิเศษ
                            </Typography>
                            <IconButton onClick={() => setPromoOpen(false)} size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                <CloseCircle size={28} />
                            </IconButton>
                        </Box>

                        {selectedPromo && (
                            <Box sx={{ px: 3 }}>
                                {/* Promo Image */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxHeight: 450,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        mb: 3,
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                        bgcolor: '#0f172a', // Dark background for contained images
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={selectedPromo.image || '/api/placeholder/promo_placeholder.png'}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: 450,
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>

                                {/* Title & Price */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                        {selectedPromo.period && (
                                            <Chip
                                                label={selectedPromo.period}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#3B82F6',
                                                    color: 'white',
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600
                                                }}
                                            />
                                        )}
                                        <Chip
                                            label="SET EVENT"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                color: '#60A5FA',
                                                borderColor: 'rgba(96, 165, 250, 0.3)',
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 500
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                                        {selectedPromo.title}
                                    </Typography>
                                    {selectedPromo.price && (
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '1.5rem',
                                            color: '#F59E0B',
                                            fontWeight: 800
                                        }}>
                                            ฿{selectedPromo.price}
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                                {/* Description */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1rem' }}>
                                        {selectedPromo.description}
                                    </Typography>
                                </Box>

                                {/* Features Grid */}
                                {selectedPromo.features && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 2, fontSize: '1rem', color: 'white' }}>
                                            สิ่งที่คุณจะได้รับ ✨
                                        </Typography>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 2
                                        }}>
                                            {(() => {
                                                try {
                                                    const features = typeof selectedPromo.features === 'string'
                                                        ? JSON.parse(selectedPromo.features)
                                                        : selectedPromo.features;

                                                    return Array.isArray(features) && features.map((f: any, idx: number) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                bgcolor: 'rgba(255,255,255,0.05)',
                                                                p: 2,
                                                                borderRadius: 3,
                                                                border: '1px solid rgba(255,255,255,0.08)'
                                                            }}
                                                        >
                                                            <Typography sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.7rem',
                                                                color: 'rgba(255,255,255,0.5)',
                                                                mb: 0.5
                                                            }}>
                                                                {f.label}
                                                            </Typography>
                                                            <Typography sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.95rem',
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}>
                                                                {f.value}
                                                            </Typography>
                                                        </Box>
                                                    ));
                                                } catch (e) {
                                                    return null;
                                                }
                                            })()}
                                        </Box>
                                    </Box>
                                )}

                                {/* Call to Action */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        setPromoOpen(false);
                                        handleContactClick();
                                    }}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: 4,
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                                        mt: 2
                                    }}
                                >
                                    สนใจจองโปรโมชั่นนี้
                                </Button>
                            </Box>
                        )}
                    </Box>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </VaulDrawer.Root>
    );

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
                                    <SearchNormal size={40} variant="Bulk" color="#3B82F6" />
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
                                    const getEventTheme = (status: string) => {
                                        switch (status) {
                                            case 'in-progress':
                                                return { bg: '#f17a4c', icon: <MagicStar size="42" color="rgba(255,255,255,0.8)" variant="Outline" />, label: 'กำลังดำเนินการ' };
                                            case 'confirmed':
                                                return { bg: '#8e94f3', icon: <TickCircle size="42" color="rgba(255,255,255,0.8)" variant="Outline" />, label: 'ยืนยันรายละเอียด' };
                                            case 'completed':
                                                return { bg: '#50c878', icon: <MagicStar size="42" color="rgba(255,255,255,0.8)" variant="Bold" />, label: 'เสร็จสมบูรณ์' };
                                            case 'cancelled':
                                                return { bg: '#94a3b8', icon: <CloseCircle size="42" color="rgba(255,255,255,0.8)" variant="Outline" />, label: 'ยกเลิกงาน' };
                                            default:
                                                return { bg: '#5da9e9', icon: <SearchNormal size="42" color="rgba(255,255,255,0.8)" variant="Outline" />, label: 'งานใหม่' };
                                        }
                                    };

                                    const theme = getEventTheme(evt.status);

                                    return (
                                        <Link key={evt.id} href={`/liff?inviteCode=${evt.inviteCode}`} style={{ textDecoration: 'none' }}>
                                            <Card
                                                sx={{
                                                    minWidth: 280,
                                                    height: 120,
                                                    borderRadius: 6,
                                                    bgcolor: theme.bg,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    border: 'none',
                                                    boxShadow: `0 8px 24px ${theme.bg}40`,
                                                    '&:active': {
                                                        transform: 'scale(0.96)',
                                                        opacity: 0.9
                                                    },
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        right: -15,
                                                        top: -15,
                                                        width: 110,
                                                        height: 130,
                                                        bgcolor: 'rgba(255,255,255,0.15)',
                                                        borderRadius: '50%',
                                                        zIndex: 0
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{
                                                    p: 2.5,
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                    '&:last-child': { pb: 2.5 }
                                                }}>
                                                    <Box sx={{ flex: 1, pr: 1 }}>
                                                        <Typography
                                                            sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontWeight: 700,
                                                                fontSize: '1.1rem',
                                                                color: 'white',
                                                                lineHeight: 1.2,
                                                                mb: 0.5,
                                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                            }}
                                                        >
                                                            {evt.eventName}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <Calendar size="12" color="rgba(255,255,255,0.7)" variant="Bold" />
                                                                <Typography sx={{
                                                                    fontFamily: 'var(--font-prompt)',
                                                                    fontSize: '0.75rem',
                                                                    color: 'rgba(255,255,255,0.85)',
                                                                    fontWeight: 500
                                                                }}>
                                                                    {evt.eventDate ? format(new Date(evt.eventDate), 'dd MMM yy') : 'ไม่ระบุวันที่'}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>•</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
                                                                <Location size="12" color="rgba(255,255,255,0.7)" variant="Bold" />
                                                                <Typography sx={{
                                                                    fontFamily: 'var(--font-prompt)',
                                                                    fontSize: '0.75rem',
                                                                    color: 'rgba(255,255,255,0.8) ',
                                                                    fontWeight: 500,
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    maxWidth: 100
                                                                }}>
                                                                    {evt.venue || 'ไม่ระบุสถานที่'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        {/* Status Chip */}
                                                        <Box sx={{
                                                            mt: 1.5,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            bgcolor: 'rgba(255,255,255,0.2)',
                                                            px: 1.2,
                                                            py: 0.4,
                                                            borderRadius: 10,
                                                            backdropFilter: 'blur(4px)'
                                                        }}>
                                                            <Typography sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.6rem',
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                letterSpacing: 0.5
                                                            }}>
                                                                {theme.label.toUpperCase()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: -1
                                                    }}>
                                                        {theme.icon}
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
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 2,
                                bgcolor: 'white',
                                p: 2,
                                borderRadius: 4,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                            }}
                        >
                            {/* Website */}
                            <Box
                                component="a"
                                href="https://seteventthailand.com"
                                target="_blank"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    transition: 'transform 0.2s',
                                    '&:active': { transform: 'scale(0.95)' }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        bgcolor: '#F0FDF4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <Monitor size={24} variant="Bulk" color="#22C55E" />
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
                                    เว็บไซต์
                                </Typography>
                            </Box>

                            {/* Contact Us */}
                            <Box
                                onClick={handleContactClick}
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
                                        bgcolor: '#EFF6FF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <Call size={24} variant="Bulk" color="#3B82F6" />
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
                                    ติดต่อเรา
                                </Typography>
                            </Box>

                            {/* Review/Rate */}
                            <Box
                                onClick={() => {
                                    // Find unreviewed completed events
                                    const candidates = events.filter(e => e.status === 'completed' && !e.isReviewed);

                                    if (candidates.length === 0) {
                                        setSnackbar({ open: true, message: 'ยังไม่มีงานที่เสร็จสมบูรณ์ให้รีวิว (หรือรีวิวครบแล้ว)', severity: 'warning' });
                                    } else if (candidates.length === 1) {
                                        setReviewData({
                                            step: 'form',
                                            candidates: [],
                                            eventId: candidates[0].id,
                                            rating: 5,
                                            comment: '',
                                            eventName: candidates[0].eventName
                                        });
                                        setReviewOpen(true);
                                    } else {
                                        // Multiple candidates - show selection
                                        setReviewData({
                                            step: 'select',
                                            candidates: candidates,
                                            eventId: '',
                                            rating: 5,
                                            comment: '',
                                            eventName: ''
                                        });
                                        setReviewOpen(true);
                                    }
                                }}
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
                                        bgcolor: '#FEF3C7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <MagicStar size={24} variant="Bulk" color="#F59E0B" />
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
                                    ให้คะแนน
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Promotions Section - Dynamic from DB */}
                    {promotions.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 3 }}>
                                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                    โปรโมชั่นพิเศษ 🎁
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
                                {promotions.map((promo, idx) => (
                                    <Box
                                        key={promo.id || idx}
                                        onClick={() => {
                                            setSelectedPromo(promo);
                                            setPromoOpen(true);
                                        }}
                                        sx={{
                                            minWidth: 240,
                                            height: 180,
                                            borderRadius: 5,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {/* Work Image */}
                                        <Box
                                            component="img"
                                            src={promo.image || '/api/placeholder/promo_placeholder.png'}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        />

                                        {/* Gradient Overlay */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '70%',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                p: 2.5
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{
                                                        display: 'inline-flex',
                                                        bgcolor: 'rgba(30, 41, 59, 0.7)',
                                                        color: '#60A5FA',
                                                        px: 1,
                                                        py: 0.3,
                                                        borderRadius: 1.5,
                                                        fontSize: '0.6rem',
                                                        fontWeight: 800,
                                                        fontFamily: 'var(--font-prompt)',
                                                        textTransform: 'uppercase',
                                                        mb: 1,
                                                        letterSpacing: 1,
                                                        border: '1px solid rgba(96, 165, 250, 0.2)',
                                                        backdropFilter: 'blur(4px)'
                                                    }}>
                                                        {promo.period || 'Special Offer'}
                                                    </Typography>
                                                    <Typography sx={{
                                                        color: 'white',
                                                        fontWeight: 700,
                                                        fontSize: '1.05rem',
                                                        fontFamily: 'var(--font-prompt)',
                                                        lineHeight: 1.2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}>
                                                        {promo.title}
                                                    </Typography>
                                                    <Typography sx={{
                                                        color: 'rgba(255,255,255,0.7)',
                                                        fontSize: '0.875rem',
                                                        fontFamily: 'var(--font-prompt)',
                                                        mt: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}>
                                                        {promo.description}
                                                    </Typography>
                                                </Box>
                                                {promo.price && (
                                                    <Box sx={{ bgcolor: '#F59E0B', px: 1.5, py: 0.5, borderRadius: 2, ml: 1 }}>
                                                        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'var(--font-prompt)' }}>
                                                            ฿{promo.price}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>

                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                </Container>
                {contactDrawerJSX}
                {reviewDrawerJSX}
                {promotionDrawerJSX}

                {/* Snackbar for notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{ top: { xs: 16, sm: 24 } }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{
                            width: '100%',
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
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

    // No Events State - Show Promotions & Quick Actions, but empty My Projects
    if (status === 'no-events' || status === 'new' || status === 'pending') {
        return (
            <>
                <LiffHeader onSearch={setSearchTerm} />
                <Container maxWidth="sm" sx={{ pb: 10, bgcolor: '#FFFFFF' }}>

                    {/* My Project Section - Empty State */}
                    <Box sx={{ mb: 4, pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                My Project
                            </Typography>
                        </Box>

                        {/* Empty State Card */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 5,
                                px: 3,
                                mx: 1,
                                borderRadius: 4,
                                background: 'linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%)',
                                border: '1px dashed #E2E8F0',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <Clock size={28} color="#3B82F6" variant="Bulk" />
                            </Box>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: '#1E293B',
                                    mb: 0.5,
                                }}
                            >
                                {status === 'new' ? 'ยินดีต้อนรับ! 🎉' : status === 'pending' ? 'กำลังตรวจสอบ...' : 'ยังไม่มีโปรเจกต์'}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.85rem',
                                    color: '#94A3B8',
                                    textAlign: 'center',
                                }}
                            >
                                {status === 'new'
                                    ? 'ขอบคุณที่สนใจบริการของเรา ทีมงานจะติดต่อกลับเร็วๆ นี้'
                                    : status === 'pending'
                                        ? 'เรากำลังตรวจสอบข้อมูลของคุณ กรุณารอสักครู่'
                                        : 'เมื่อมีงานใหม่จะแสดงที่นี่'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Quick Actions Section */}
                    <Box sx={{ mb: 4, px: 1 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B', mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
                            {/* Portfolio */}
                            <Box
                                component="a"
                                href="/portfolio"
                                target="_blank"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    transition: 'transform 0.2s',
                                    '&:active': { transform: 'scale(0.95)' }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        bgcolor: '#F0FDF4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <Gallery size={24} variant="Bulk" color="#22C55E" />
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
                                    ผลงาน
                                </Typography>
                            </Box>

                            {/* Quotation */}
                            <Box
                                component="a"
                                href="https://line.me/R/oaMessage/@setevent"
                                target="_blank"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    transition: 'transform 0.2s',
                                    '&:active': { transform: 'scale(0.95)' }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        bgcolor: '#FDF4FF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <DocumentText size={24} variant="Bulk" color="#A855F7" />
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
                                    ขอใบเสนอราคา
                                </Typography>
                            </Box>

                            {/* Contact */}
                            <Box
                                onClick={handleContactClick}
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
                                        bgcolor: '#EFF6FF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <Call size={24} variant="Bulk" color="#3B82F6" />
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
                                    ติดต่อเรา
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Promotions Section */}
                    {promotions.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 3 }}>
                                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                    โปรโมชั่นพิเศษ 🎁
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
                                {promotions.map((promo, idx) => (
                                    <Box
                                        key={promo.id || idx}
                                        onClick={() => {
                                            setSelectedPromo(promo);
                                            setPromoOpen(true);
                                        }}
                                        sx={{
                                            minWidth: 240,
                                            height: 180,
                                            borderRadius: 5,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={promo.image || '/api/placeholder/promo_placeholder.png'}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                                                p: 2,
                                                pt: 4
                                            }}
                                        >
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: 'white', fontSize: '0.95rem', lineHeight: 1.3 }}>
                                                {promo.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.3, borderRadius: 2 }}>
                                                    <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '0.7rem', fontFamily: 'var(--font-prompt)' }}>
                                                        {promo.period}
                                                    </Typography>
                                                </Box>
                                                {promo.price && (
                                                    <Box sx={{ bgcolor: '#F59E0B', px: 1.5, py: 0.5, borderRadius: 2, ml: 1 }}>
                                                        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'var(--font-prompt)' }}>
                                                            ฿{promo.price}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                </Container>
                {contactDrawerJSX}
                {promotionDrawerJSX}

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{ top: { xs: 16, sm: 24 } }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{
                            width: '100%',
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 3,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
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
                {/* Skeleton Header - Matches LiffHeader */}
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
                            width={48}
                            height={48}
                            sx={{ bgcolor: 'rgba(255,255,255,0.6)' }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton
                                variant="text"
                                width="50%"
                                height={20}
                                sx={{ bgcolor: 'rgba(255,255,255,0.6)', mb: 0.5 }}
                            />
                            <Skeleton
                                variant="text"
                                width="30%"
                                height={16}
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
                    {/* My Project Section Skeleton */}
                    <Box sx={{ mb: 4, pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                            <Skeleton variant="text" width={100} height={28} />
                        </Box>

                        {/* Project Cards Skeleton - Horizontal scroll */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'hidden',
                                pb: 2,
                                px: 3,
                                mx: -2,
                            }}
                        >
                            {[1, 2].map((i) => (
                                <Card
                                    key={i}
                                    sx={{
                                        minWidth: 260,
                                        borderRadius: 4,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Skeleton variant="text" width="75%" height={24} sx={{ mb: 1 }} />
                                        <Skeleton variant="text" width="50%" height={16} sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Skeleton variant="text" width={80} height={14} />
                                            <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 2 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>

                    {/* Quick Actions Section Skeleton */}
                    <Box sx={{ mb: 4, px: 1 }}>
                        <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            {[1, 2, 3, 4].map((i) => (
                                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 3 }} />
                                    <Skeleton variant="text" width={50} height={14} />
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Promotions Section Skeleton */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ px: 3, mb: 2 }}>
                            <Skeleton variant="text" width={140} height={28} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'hidden',
                                px: 3,
                                mx: -2,
                            }}
                        >
                            {[1, 2].map((i) => (
                                <Skeleton
                                    key={i}
                                    variant="rounded"
                                    sx={{
                                        minWidth: 240,
                                        height: 180,
                                        borderRadius: 5,
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </Box>
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
