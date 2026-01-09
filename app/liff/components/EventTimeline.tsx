'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Stack,
    Card,
    CardContent,
} from '@mui/material';
import { EventData } from '../types';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ArrowLeft, ArrowDown2 } from 'iconsax-react';

interface Props {
    event: EventData;
}

export default function EventTimeline({ event }: Props) {
    // Sort chat logs descending (Newest first)
    // The image implies chronological (7 AM -> 10 AM) but request context says descending. I'll stick to descending.
    const sortedLogs = useMemo(() => {
        return [...(event.chatLogs || [])].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [event.chatLogs]);

    // Helper to render message content (JSON parsing)
    // Supports highlighting logic if the card is "active"
    const renderMessageContent = (msg: string, isHighlighted: boolean) => {
        try {
            if (msg.trim().startsWith('{') || msg.trim().startsWith('[')) {
                const parsed = JSON.parse(msg);

                // Handle status update messages from Admin
                if (parsed.type === 'status') {
                    const imageUrls: string[] = parsed.imageUrls || [];
                    return (
                        <Box sx={{ mt: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    color: isHighlighted ? 'rgba(255,255,255,0.95)' : '#1E293B',
                                    fontWeight: 500,
                                    mb: 1
                                }}
                            >
                                {parsed.message || 'อัพเดทสถานะ'}
                            </Typography>
                            {parsed.progress !== undefined && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: imageUrls.length > 0 ? 1.5 : 0 }}>
                                    <Box sx={{
                                        flex: 1,
                                        height: 6,
                                        bgcolor: isHighlighted ? 'rgba(255,255,255,0.3)' : '#E2E8F0',
                                        borderRadius: 3,
                                        overflow: 'hidden'
                                    }}>
                                        <Box sx={{
                                            width: `${parsed.progress}%`,
                                            height: '100%',
                                            bgcolor: isHighlighted ? 'white' : '#3B82F6',
                                            borderRadius: 3,
                                            transition: 'width 0.3s'
                                        }} />
                                    </Box>
                                    <Typography variant="caption" sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        color: isHighlighted ? 'rgba(255,255,255,0.8)' : '#64748B',
                                        minWidth: 36
                                    }}>
                                        {parsed.progress}%
                                    </Typography>
                                </Box>
                            )}
                            {/* Image Thumbnails as small avatars */}
                            {imageUrls.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                    {imageUrls.map((url: string, idx: number) => (
                                        <Box
                                            key={idx}
                                            component="a"
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                border: isHighlighted ? '2px solid rgba(255,255,255,0.5)' : '2px solid #E2E8F0',
                                                flexShrink: 0,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, border-color 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    borderColor: isHighlighted ? 'white' : '#3B82F6'
                                                }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={url}
                                                alt={`รูปภาพ ${idx + 1}`}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </Box>
                                    ))}

                                </Box>
                            )}
                        </Box>
                    );
                }

                // Handle flex messages
                if (parsed.type === 'flex' && parsed.altText) {
                    return (
                        <Box sx={{ mt: 1, p: 1, bgcolor: isHighlighted ? 'rgba(255,255,255,0.2)' : '#F1F5F9', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: isHighlighted ? 'white' : '#1E293B', fontWeight: 500 }}>
                                {parsed.altText}
                            </Typography>
                        </Box>
                    );
                }

                // Generic JSON with altText or text
                return (
                    <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: isHighlighted ? 'rgba(255,255,255,0.9)' : '#64748B', fontStyle: 'italic' }}>
                        {parsed.altText || parsed.text || parsed.message || 'System Message'}
                    </Typography>
                );
            }

            // Regular Text (most chat messages)
            return (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        color: isHighlighted ? 'rgba(255,255,255,0.9)' : '#64748B',
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {msg}
                </Typography>
            );
        } catch (e) {
            // If JSON parsing fails, show as plain text
            return (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        color: isHighlighted ? 'rgba(255,255,255,0.9)' : '#64748B',
                        mt: 0.5
                    }}
                >
                    {msg}
                </Typography>
            );
        }
    };

    // Mock Calendar Dates (Current Week) for Visual Fidelity
    // In a real app, this might dynamically sync with the selected logs.
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        // Start from 3 days ago
        d.setDate(today.getDate() - 3 + i);
        return d;
    });

    // State for selected date/month
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Generate days for the selected month to show in swiper (or just a range around today)
    // Let's show the whole month in the swiper for the selected month
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
            // Find the active/selected day element
            // We'll give it a data-active attribute
            const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
            if (activeEl) {
                const container = scrollContainerRef.current;
                const scrollLeft = activeEl.offsetLeft - (container.offsetWidth / 2) + (activeEl.offsetWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [selectedDate, daysInMonth]);

    // Handle back
    const handleBack = () => {
        // Use window.history or Next.js router
        window.history.back();
        // Or strictly redirect to list: router.push('/liff');
        // But since we are likely in a separate route or state, window.back is safer if came from list.
        // Actually, better to use router.push to '/liff' to ensure we go to list state.
        // window.location.href = '/liff'; 
    };

    return (
        <Box sx={{ pb: 10, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Header Section */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #F1F5F9'
                }}
            >
                <Container maxWidth="sm" sx={{ py: 2 }}>
                    {/* Back Arrow & Title */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Box
                            onClick={() => window.location.href = '/liff'}
                            sx={{ cursor: 'pointer', display: 'flex' }}
                        >
                            <ArrowLeft size={24} color="#1E293B" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, lineHeight: 1.2 }}>
                                {event.eventName}
                            </Typography>
                            {event.venue && (
                                <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', display: 'block' }}>
                                    {event.venue}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {/* Month Year Selector */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1E293B' }}>
                                    {format(selectedDate, 'MMMM yyyy')}
                                </Typography>
                                <ArrowDown2 size={20} color="#1E293B" />
                            </Stack>
                            {/* Hidden Date Input for Native Picker */}
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
                        {/* Maybe a Today button? */}
                        <Box
                            component="button"
                            onClick={() => setSelectedDate(new Date())}
                            sx={{
                                border: 'none',
                                bgcolor: '#F1F5F9',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                color: '#64748B',
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            Today
                        </Box>
                    </Stack>

                    {/* Scrollable Calendar Strip (Swiper) */}
                    <Box
                        ref={scrollContainerRef}
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 1.5,
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
                                    spacing={0.5}
                                    onClick={() => setSelectedDate(new Date(date))}
                                    sx={{
                                        cursor: 'pointer',
                                        minWidth: 48,
                                        p: 1,
                                        borderRadius: 3,
                                        bgcolor: isSelected ? '#3B82F6' : (isToday ? '#F1F5F9' : 'transparent'),
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            color: isSelected ? 'rgba(255,255,255,0.8)' : '#94A3B8',
                                            fontWeight: 500
                                        }}
                                    >
                                        {format(date, 'EEE')}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            color: isSelected ? '#fff' : '#1E293B'
                                        }}
                                    >
                                        {format(date, 'd')}
                                    </Typography>
                                    {/* Dot for events? Optional */}
                                </Stack>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            {/* Timeline Section */}
            <Container maxWidth="sm" sx={{ pt: 3 }}>
                <Box sx={{ position: 'relative', pl: 2 }}>
                    {/* Vertical Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 23,
                            top: 10,
                            bottom: 0,
                            width: 2,
                            bgcolor: '#E2E8F0',
                            zIndex: 0
                        }}
                    />

                    <Stack spacing={3}>
                        {sortedLogs.length === 0 ? (
                            <Box sx={{ pl: 6, py: 2 }}>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#94A3B8' }}>No updates yet.</Typography>
                            </Box>
                        ) : (
                            sortedLogs.map((log, index) => {
                                const isLatest = index === 0;
                                const isHighlighted = isLatest;

                                return (
                                    <Box key={log.id} sx={{ position: 'relative', zIndex: 1, display: 'flex', gap: 3 }}>
                                        {/* Timeline Dot */}
                                        <Box
                                            sx={{
                                                minWidth: 16,
                                                pt: 2,
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '50%',
                                                    border: isHighlighted ? '4px solid #3B82F6' : '2px solid #CBD5E1',
                                                    bgcolor: 'white',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </Box>

                                        {/* Card */}
                                        <Card
                                            sx={{
                                                flex: 1,
                                                borderRadius: 4,
                                                boxShadow: isHighlighted ? '0 10px 30px -10px rgba(59, 130, 246, 0.4)' : 'none',
                                                bgcolor: isHighlighted ? '#3B82F6' : '#F8FAFC',
                                                color: isHighlighted ? 'white' : 'inherit',
                                                border: isHighlighted ? 'none' : '1px solid #F1F5F9',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <CardContent sx={{ p: '20px !important' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 1 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontWeight: 700,
                                                            fontSize: '1rem',
                                                            color: isHighlighted ? 'white' : '#1E293B'
                                                        }}
                                                    >
                                                        {log.senderName || 'System Update'}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            color: isHighlighted ? 'rgba(255,255,255,0.8)' : '#94A3B8',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {format(new Date(log.createdAt), 'h:mm a')}
                                                    </Typography>
                                                </Stack>

                                                {renderMessageContent(log.message, isHighlighted)}


                                            </CardContent>
                                        </Card>
                                    </Box>
                                );
                            })
                        )}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
