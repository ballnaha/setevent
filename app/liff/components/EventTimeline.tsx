'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Stack,
    Card,
    CardContent,
    Modal,
    IconButton,
} from '@mui/material';
import { EventData, ChatLog } from '../types';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ArrowLeft, ArrowDown2, Clock, Message, Send2, Image, CloseCircle, InfoCircle } from 'iconsax-react';
import { Drawer } from 'vaul';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface Props {
    event: EventData;
}

// Message type configurations
const messageTypeConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
    text: { label: 'ข้อความ', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: Message },
    image: { label: 'รูปภาพ', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: Image },
    flex: { label: 'อัพเดท', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)', icon: Send2 },
    sticker: { label: 'สติกเกอร์', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.1)', icon: Message },
};

// Status color config - matching events page
const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return { accent: '#10B981', bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.2)' };
        case 'in-progress': return { accent: '#F59E0B', bg: 'rgba(245, 158, 11, 0.05)', border: 'rgba(245, 158, 11, 0.2)' };
        case 'confirmed': return { accent: '#3B82F6', bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.2)' };
        case 'cancelled': return { accent: '#EF4444', bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.2)' };
        case 'draft': return { accent: '#6B7280', bg: 'rgba(107, 114, 128, 0.05)', border: 'rgba(107, 114, 128, 0.2)' };
        case 'pending': return { accent: '#F59E0B', bg: 'rgba(245, 158, 11, 0.05)', border: 'rgba(245, 158, 11, 0.2)' };
        default: return { accent: '#3B82F6', bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.2)' };
    }
};

export default function EventTimeline({ event }: Props) {
    // Sort chat logs by createdAt DESC (newest first)
    const sortedChatLogs = useMemo(() => {
        return [...(event.chatLogs || [])].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [event.chatLogs]);

    // State for selected date/month
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Filter logs by selected date
    const filteredChatLogs = useMemo(() => {
        return sortedChatLogs.filter(log => {
            const logDate = new Date(log.createdAt);
            return logDate.getDate() === selectedDate.getDate() &&
                logDate.getMonth() === selectedDate.getMonth() &&
                logDate.getFullYear() === selectedDate.getFullYear();
        });
    }, [sortedChatLogs, selectedDate]);

    // Selected chat log for details drawer
    const [selectedChatLog, setSelectedChatLog] = useState<ChatLog | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [shouldRestoreDrawer, setShouldRestoreDrawer] = useState(false);

    // Lightbox state for image gallery
    const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; initialSlide: number }>({
        open: false,
        images: [],
        initialSlide: 0,
    });

    const openLightbox = (images: string[], index: number) => {
        if (isDrawerOpen) {
            setShouldRestoreDrawer(true);
            setIsDrawerOpen(false);
        }
        setLightbox({ open: true, images, initialSlide: index });
    };

    const closeLightbox = () => {
        setLightbox({ open: false, images: [], initialSlide: 0 });
        if (shouldRestoreDrawer) {
            setIsDrawerOpen(true);
            setShouldRestoreDrawer(false);
        }
    };

    const openDrawer = (log: ChatLog) => {
        setSelectedChatLog(log);
        setIsDrawerOpen(true);
    };

    // Generate days for the selected month
    const daysInMonth = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const days = [];
        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [selectedDate]);

    // Ref for scrolling
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to today/selected date on mount/update
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
            if (activeEl) {
                const container = scrollContainerRef.current;
                const scrollLeft = activeEl.offsetLeft - (container.offsetWidth / 2) + (activeEl.offsetWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [selectedDate, daysInMonth]);

    // Parse message content - extract text, images, progress from JSON
    const parseMessage = (msg: string): { text: string; images: string[]; progress?: number; altText?: string } => {
        try {
            if (msg.trim().startsWith('{') || msg.trim().startsWith('[')) {
                const parsed = JSON.parse(msg);

                // Handle status update with images
                if (parsed.type === 'status') {
                    return {
                        text: parsed.message || 'อัพเดทสถานะ',
                        images: parsed.imageUrls || [],
                        progress: parsed.progress,
                    };
                }

                // Handle flex messages
                if (parsed.type === 'flex') {
                    return {
                        text: parsed.altText || parsed.text || 'Flex Message',
                        images: [],
                        altText: parsed.altText,
                    };
                }

                return {
                    text: parsed.altText || parsed.text || parsed.message || msg,
                    images: parsed.imageUrls || [],
                };
            }
            return { text: msg, images: [] };
        } catch {
            return { text: msg, images: [] };
        }
    };

    // Get time from createdAt
    const getTimeDisplay = (log: ChatLog) => {
        if (!log.createdAt) return { time: '--:--', period: '' };
        const date = new Date(log.createdAt);
        return {
            time: format(date, 'h:mm'),
            period: format(date, 'a').toLowerCase()
        };
    };

    return (
        <Box sx={{ pb: 10, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
            {/* Header Section */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                    pb: 6,
                }}
            >
                <Container maxWidth="sm" sx={{ py: 2.5 }}>
                    {/* Back Arrow & Title */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Box
                            onClick={() => window.location.href = '/liff'}
                            sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                p: 1,
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.15)',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                            }}
                        >
                            <ArrowLeft size={22} color="white" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, lineHeight: 1.2 }}>
                                {event.eventName}
                            </Typography>
                            {event.venue && (
                                <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                                    📍 {event.venue}
                                </Typography>
                            )}
                        </Box>
                        {/* Chat count badge */}
                        <Box
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                px: 2,
                                py: 0.75,
                                borderRadius: 3,
                            }}
                        >
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', fontWeight: 600 }}>
                                {sortedChatLogs.length} ข้อความ
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Month Year Selector */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                                    {format(selectedDate, 'MMMM yyyy')}
                                </Typography>
                                <ArrowDown2 size={18} color="white" />
                            </Stack>
                            <input
                                type="month"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                                onChange={(e) => {
                                    if (e.target.value) setSelectedDate(new Date(e.target.value));
                                }}
                            />
                        </Box>
                        <Box
                            component="button"
                            onClick={() => setSelectedDate(new Date())}
                            sx={{
                                border: 'none',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                px: 2,
                                py: 0.75,
                                borderRadius: 3,
                                color: 'white',
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            วันนี้
                        </Box>
                    </Stack>

                    {/* Scrollable Calendar Strip */}
                    <Box
                        ref={scrollContainerRef}
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 1,
                            pb: 1,
                            mx: -2,
                            px: 2,
                            '::-webkit-scrollbar': { display: 'none' },
                            scrollbarWidth: 'none'
                        }}
                    >
                        {daysInMonth.map((date, index) => {
                            const isSelected = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth();
                            const isToday = new Date().toDateString() === date.toDateString();

                            return (
                                <Stack
                                    key={index}
                                    data-active={isSelected}
                                    alignItems="center"
                                    spacing={0.3}
                                    onClick={() => setSelectedDate(new Date(date))}
                                    sx={{
                                        cursor: 'pointer',
                                        minWidth: 44,
                                        p: 1,
                                        borderRadius: 3,
                                        bgcolor: isSelected ? 'white' : (isToday ? 'rgba(255,255,255,0.15)' : 'transparent'),
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: isSelected ? 'white' : 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            color: isSelected ? '#3B82F6' : 'rgba(255,255,255,0.7)',
                                            fontWeight: 500,
                                            fontSize: '0.65rem'
                                        }}
                                    >
                                        {format(date, 'EEE')}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            color: isSelected ? '#3B82F6' : '#fff',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {format(date, 'd')}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            {/* Chat Timeline Section - with rounded top corners */}
            <Box
                sx={{
                    bgcolor: 'white',
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    mt: -5,
                    pt: 4,
                    minHeight: 'calc(100vh - 280px)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                    position: 'relative',
                    zIndex: 20,
                }}
            >
                <Container maxWidth="sm" sx={{ pb: 3 }}>
                    {filteredChatLogs.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                textAlign: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <Message size={36} color="#3B82F6" variant="Bulk" />
                            </Box>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                                ไม่มีข้อความในวันที่ {format(selectedDate, 'd MMM yyyy', { locale: th })}
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#94A3B8', fontSize: '0.9rem' }}>
                                ลองเลือกวันที่มีจุดเครื่องหมายหรือวันอื่น
                            </Typography>
                        </Box>
                    ) : (
                        <Stack spacing={0}>
                            {filteredChatLogs.map((log, index) => {
                                const { time, period } = getTimeDisplay(log);
                                const { text, images, progress } = parseMessage(log.message);
                                const msgType = messageTypeConfig[log.messageType] || messageTypeConfig.text;
                                const MsgIcon = msgType.icon;
                                // Use event status color for consistent theming
                                const colorScheme = getStatusColor(event.status);
                                const isLast = index === filteredChatLogs.length - 1;

                                return (
                                    <Box
                                        key={log.id}
                                        sx={{
                                            display: 'flex',
                                            gap: 0,
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Left Panel - Time */}
                                        <Box
                                            sx={{
                                                width: 50,
                                                flexShrink: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                pr: 2,
                                                pt: 2.5,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    color: '#1E293B',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {time}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.65rem',
                                                    color: '#94A3B8',
                                                }}
                                            >
                                                {period}
                                            </Typography>
                                        </Box>

                                        {/* Timeline Line & Dots */}
                                        <Box
                                            sx={{
                                                width: 24,
                                                flexShrink: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                pt: 2.5,
                                            }}
                                        >
                                            {/* Dot indicators */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                {[0, 1, 2, 3, 4].map((dotIndex) => (
                                                    <Box
                                                        key={dotIndex}
                                                        sx={{
                                                            width: dotIndex === 2 ? 10 : 6,
                                                            height: dotIndex === 2 ? 10 : 6,
                                                            borderRadius: '50%',
                                                            bgcolor: colorScheme.accent,
                                                            opacity: dotIndex === 2 ? 1 : 0.4,
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                            {/* Connecting line */}
                                            {!isLast && (
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        width: 2,
                                                        bgcolor: '#E2E8F0',
                                                        mt: 1,
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Right Panel - Card */}
                                        <Box sx={{ flex: 1, py: 1.5 }}>
                                            <Card
                                                onClick={() => openDrawer(log)}
                                                sx={{
                                                    borderRadius: 4,
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                                    border: `1px solid ${colorScheme.border}`,
                                                    bgcolor: 'white',
                                                    overflow: 'visible',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:active': { transform: 'scale(0.98)' },
                                                    '&:hover': {
                                                        boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                                        borderColor: colorScheme.accent,
                                                    }
                                                }}
                                            >
                                                {/* Accent stripe */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        right: -1,
                                                        top: 20,
                                                        bottom: 20,
                                                        width: 4,
                                                        bgcolor: colorScheme.accent,
                                                        borderTopLeftRadius: 4,
                                                        borderBottomLeftRadius: 4,
                                                    }}
                                                />

                                                <CardContent sx={{ p: 2.5, pb: '20px !important' }}>
                                                    {/* Message Text */}
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '1.05rem',
                                                            fontWeight: 600,
                                                            color: '#1E293B',
                                                            mb: 0.75,
                                                            lineHeight: 1.5,
                                                            whiteSpace: 'pre-wrap',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {text}
                                                    </Typography>

                                                    {/* Sender Name */}
                                                    <Typography
                                                        sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontWeight: 500,
                                                            fontSize: '0.85rem',
                                                            color: '#64748B',
                                                            mb: images.length > 0 || progress !== undefined ? 1.5 : 0,
                                                        }}
                                                    >
                                                        — {log.senderName || 'Admin'}
                                                    </Typography>

                                                    {/* Progress bar */}
                                                    {progress !== undefined && (
                                                        <Box sx={{ mb: 1.5 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', color: '#94A3B8' }}>
                                                                    ความคืบหน้า
                                                                </Typography>
                                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', color: colorScheme.accent, fontWeight: 600 }}>
                                                                    {progress}%
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ height: 6, bgcolor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                                                                <Box
                                                                    sx={{
                                                                        width: `${progress}%`,
                                                                        height: '100%',
                                                                        bgcolor: colorScheme.accent,
                                                                        borderRadius: 3,
                                                                        transition: 'width 0.3s ease',
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    {/* Images - Circular Avatars (max 4) */}
                                                    {images.length > 0 && (
                                                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
                                                            {images.slice(0, 4).map((url, idx) => (
                                                                <Box
                                                                    key={idx}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openLightbox(images, idx);
                                                                    }}
                                                                    sx={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        borderRadius: '50%',
                                                                        overflow: 'hidden',
                                                                        border: '2px solid white',
                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                                        transition: 'all 0.2s',
                                                                        marginLeft: idx > 0 ? '-8px' : 0,
                                                                        position: 'relative',
                                                                        zIndex: 5 - idx,
                                                                        cursor: 'pointer',
                                                                        '&:hover': {
                                                                            transform: 'scale(1.15)',
                                                                            zIndex: 10,
                                                                            borderColor: colorScheme.accent,
                                                                        }
                                                                    }}
                                                                >
                                                                    <Box
                                                                        component="img"
                                                                        src={url}
                                                                        alt={`Image ${idx + 1}`}
                                                                        sx={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                </Box>
                                                            ))}
                                                            {images.length > 4 && (
                                                                <Box
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openLightbox(images, 4);
                                                                    }}
                                                                    sx={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        borderRadius: '50%',
                                                                        bgcolor: colorScheme.bg,
                                                                        border: `2px solid ${colorScheme.accent}`,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        marginLeft: '-8px',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s',
                                                                        '&:hover': {
                                                                            transform: 'scale(1.1)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', color: colorScheme.accent, fontWeight: 700 }}>
                                                                        +{images.length - 4}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                </Container>
            </Box>

            {/* Lightbox Modal with Swiper */}
            <Modal
                open={lightbox.open}
                onClose={closeLightbox}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        bgcolor: 'rgba(0,0,0,0.95)',
                        outline: 'none',
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={closeLightbox}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.2)',
                            }
                        }}
                    >
                        <CloseCircle size={28} color="white" variant="Bold" />
                    </IconButton>

                    {/* Image Counter */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            zIndex: 10,
                            color: 'white',
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.9rem',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                        }}
                    >
                        {lightbox.images.length} รูป
                    </Box>

                    {/* Swiper Carousel */}
                    {lightbox.images.length > 0 && (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                '& .swiper': {
                                    width: '100%',
                                    height: '100%',
                                },
                                '& .swiper-button-next, & .swiper-button-prev': {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    '&::after': { fontSize: '0.8rem' },
                                    backdropFilter: 'blur(4px)',
                                    color: '#fff',
                                },
                                '& .swiper-pagination-bullet': {
                                    bgcolor: '#fff',
                                    opacity: 0.5,
                                    '&.swiper-pagination-bullet-active': {
                                        opacity: 1,
                                    }
                                }
                            }}
                        >
                            <Swiper
                                key={`swiper-${lightbox.images.length}-${lightbox.initialSlide}-${lightbox.open}`}
                                modules={[Navigation, Pagination, Zoom]}
                                navigation
                                pagination={{ clickable: true }}
                                zoom={{ maxRatio: 3 }}
                                initialSlide={lightbox.initialSlide}
                                spaceBetween={0}
                                slidesPerView={1}
                                observer={true}
                                observeParents={true}
                                grabCursor={true}
                                allowTouchMove={true}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff',
                                    '--swiper-navigation-size': '16px',
                                } as any}
                            >
                                {lightbox.images.map((url: string, idx: number) => (
                                    <SwiperSlide key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="swiper-zoom-container" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'transparent'
                                        }}>
                                            <Box
                                                component="img"
                                                src={url}
                                                alt={`Image ${idx + 1}`}
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain',
                                                    userSelect: 'none'
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Details Drawer (Vaul) */}
            <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
                    <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] h-[75vh] mt-24 fixed bottom-0 left-0 right-0 z-[101] outline-none">
                        <Box sx={{ p: 1, bgcolor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '100%' }}>
                            <Box sx={{ width: 40, height: 4, bgcolor: '#E2E8F0', borderRadius: 2, mx: 'auto', mt: 1.5, mb: 2 }} />

                            <Drawer.Title className="sr-only">รายละเอียดอัพเดท</Drawer.Title>
                            <Drawer.Description className="sr-only">แสดงข้อมูลรายละเอียดของข้อความ</Drawer.Description>

                            {selectedChatLog && (() => {
                                const { text, images, progress } = parseMessage(selectedChatLog.message);
                                const colorScheme = getStatusColor(event.status);

                                return (
                                    <Container maxWidth="sm" sx={{ pb: 4, height: 'calc(100% - 40px)', overflowY: 'auto' }}>
                                        <Stack spacing={3}>
                                            {/* Header */}
                                            <Box>
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '1.25rem', color: '#1E293B', mb: 1 }}>
                                                    รายละเอียดอัพเดท
                                                </Typography>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Box sx={{ p: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2, display: 'flex' }}>
                                                        <Clock size={16} color="#3B82F6" />
                                                    </Box>
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#64748B' }}>
                                                        {format(new Date(selectedChatLog.createdAt), 'd MMM yyyy, HH:mm น.', { locale: th })}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            {/* Sender Info */}
                                            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Box sx={{ width: 40, height: 40, bgcolor: colorScheme.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                        <Typography sx={{ fontWeight: 700 }}>{(selectedChatLog.senderName || 'A')[0].toUpperCase()}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '0.95rem', color: '#1E293B' }}>
                                                            {selectedChatLog.senderName || 'Admin'}
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: '#94A3B8' }}>
                                                            ผู้ดูแลโปรเจกต์
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>

                                            {/* Message Content */}
                                            <Box>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    color: '#1E293B',
                                                    lineHeight: 1.8,
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {text}
                                                </Typography>
                                            </Box>

                                            {/* Progress */}
                                            {progress !== undefined && (
                                                <Box sx={{ p: 2.5, bgcolor: '#F0F9FF', borderRadius: 4, border: `1px solid ${colorScheme.border}` }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#0369A1' }}>
                                                            ความคืบหน้างาน
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, color: '#0369A1', fontSize: '1.2rem' }}>
                                                            {progress}%
                                                        </Typography>
                                                    </Stack>
                                                    <Box sx={{ height: 8, bgcolor: 'rgba(3, 105, 161, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                                        <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: '#0369A1', borderRadius: 4 }} />
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Images Grid */}
                                            {images.length > 0 && (
                                                <Box>
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 2 }}>
                                                        รูปภาพ ({images.length})
                                                    </Typography>
                                                    <Stack spacing={2}>
                                                        {images.map((url, idx) => (
                                                            <Box
                                                                key={idx}
                                                                onClick={() => openLightbox(images, idx)}
                                                                sx={{
                                                                    width: '100%',
                                                                    borderRadius: 4,
                                                                    overflow: 'hidden',
                                                                    border: '1px solid #E2E8F0',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <Box
                                                                    component="img"
                                                                    src={url}
                                                                    alt={`Detail Image ${idx + 1}`}
                                                                    sx={{ width: '100%', display: 'block' }}
                                                                />
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Container>
                                );
                            })()}
                        </Box>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </Box>
    );
}
