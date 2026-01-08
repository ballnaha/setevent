'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Chip,
    Stack,
} from '@mui/material';
import { Calendar, Location, SearchStatus, Clock, ArrowLeft2, ArrowRight2, ArrowDown2 } from 'iconsax-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Drawer } from 'vaul';
import { EventData, EventTimeline as EventTimelineType } from '../types';

interface EventTimelineProps {
    event: EventData;
}

export default function EventTimeline({ event }: EventTimelineProps) {
    const [selectedTimeline, setSelectedTimeline] = useState<EventTimelineType | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    // Sync Swiper with selectedDate
    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.slideTo(selectedDate.getDate() - 1);
        }
    }, [selectedDate, swiperInstance]);

    // Date Logic
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const monthDates = Array.from({ length: daysInMonth }, (_, i) => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1));

    // Helper: Change Month
    const changeMonth = (offset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);
        // Ensure valid date (e.g. Jan 31 -> Feb 28/29) happens automatically in JS setMonth, 
        // but it might skip if overflow. E.g. Jan 31 + 1 month -> March 3 or 2.
        // If users prefer staying in "target month", we should clamp.
        // For simplicity in this "Agenda" view, JS behavior is often acceptable or we reset to 1.
        // Let's reset to day 1 to ensure we land in the correct month visibly.
        newDate.setDate(1);
        setSelectedDate(newDate);
    };

    // Filter Timelines
    const filteredTimelines = event.timelines.filter(t => {
        const tDate = new Date(t.completedAt || t.createdAt);
        return (t.status === 'completed' || t.status === 'in-progress') &&
            tDate.getDate() === selectedDate.getDate() &&
            tDate.getMonth() === selectedDate.getMonth() &&
            tDate.getFullYear() === selectedDate.getFullYear();
    }) || [];

    return (
        <Box sx={{ position: 'relative', zIndex: 10, mt: -4, px: 0 }}>
            {/* White Rounded Container for Content */}
            <Box
                sx={{
                    bgcolor: '#F8FAFC',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    minHeight: '80vh',
                    overflow: 'hidden',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                    pb: 10,
                }}
            >
                {/* Date Header & Picker */}
                <Box sx={{ p: 3, pb: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        {/* Interactive Month/Year Selector */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Prev Month */}
                            <Box
                                onClick={() => changeMonth(-1)}
                                sx={{
                                    width: 32, height: 32,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    '&:active': { bgcolor: '#F1F5F9' }
                                }}
                            >
                                <ArrowLeft2 size={20} color="#64748B" />
                            </Box>

                            {/* Month & Year Text with Hidden Input */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, position: 'relative' }}>
                                <Calendar size={24} color="#1E293B" variant="Bold" />
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: '1.25rem', color: '#1E293B', ml: 0.5 }}>
                                    {selectedDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                </Typography>
                                <ArrowDown2 size={16} color="#1E293B" />

                                <input
                                    type="month"
                                    value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
                                    onChange={(e) => {
                                        if (!e.target.value) return;
                                        const [y, m] = e.target.value.split('-');
                                        const newDate = new Date(selectedDate);
                                        newDate.setDate(1);
                                        newDate.setFullYear(parseInt(y));
                                        newDate.setMonth(parseInt(m) - 1);
                                        setSelectedDate(newDate);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                />
                            </Box>

                            {/* Next Month */}
                            <Box
                                onClick={() => changeMonth(1)}
                                sx={{
                                    width: 32, height: 32,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    '&:active': { bgcolor: '#F1F5F9' }
                                }}
                            >
                                <ArrowRight2 size={20} color="#64748B" />
                            </Box>
                        </Box>

                        <Typography
                            onClick={() => setSelectedDate(new Date())}
                            sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', fontWeight: 600, color: '#3B82F6', cursor: 'pointer' }}
                        >
                            Today
                        </Typography>
                    </Box>

                    {/* Date Horizontal List with Swiper */}
                    <Box sx={{ pb: 1 }}>
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={10}
                            slidesPerView={5.5}
                            centeredSlides={true}
                            onSwiper={setSwiperInstance}
                            initialSlide={new Date().getDate() - 1}
                            style={{ paddingBottom: '10px' }}
                        >
                            {monthDates.map((date) => {
                                const isSelected = date.getDate() === selectedDate.getDate();
                                const isToday = date.toDateString() === new Date().toDateString();

                                // Check if this date has any events
                                const hasEvent = event.timelines.some(t => {
                                    const tDate = new Date(t.completedAt || t.createdAt);
                                    return tDate.getDate() === date.getDate() &&
                                        tDate.getMonth() === date.getMonth() &&
                                        tDate.getFullYear() === date.getFullYear();
                                });

                                return (
                                    <SwiperSlide key={date.toISOString()}>
                                        <Box
                                            onClick={() => setSelectedDate(date)}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 3,
                                                bgcolor: isSelected ? '#3B82F6' : (isToday ? '#F1F5F9' : 'white'),
                                                border: isSelected ? 'none' : '1px solid #F1F5F9',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: isSelected ? '0 4px 10px rgba(59, 130, 246, 0.3)' : 'none',
                                                height: '100%',
                                                position: 'relative'
                                            }}
                                        >
                                            <Typography sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.75rem',
                                                color: isSelected ? 'white' : '#94A3B8',
                                                fontWeight: 600,
                                                mb: 0.5,
                                                textTransform: 'uppercase'
                                            }}>
                                                {date.toLocaleDateString('en-GB', { weekday: 'short' }).substring(0, 1)}
                                            </Typography>
                                            <Typography sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '1.1rem',
                                                color: isSelected ? 'white' : '#1E293B',
                                                fontWeight: 700
                                            }}>
                                                {date.getDate()}
                                            </Typography>

                                            {/* Event Indicator Dot */}
                                            {hasEvent && (
                                                <Box sx={{
                                                    width: 4,
                                                    height: 4,
                                                    borderRadius: '50%',
                                                    bgcolor: isSelected ? 'white' : '#EF4444',
                                                    mt: 0.5
                                                }} />
                                            )}
                                        </Box>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </Box>
                </Box>

                {/* Event Context Label */}
                <Box sx={{ px: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.1rem', color: '#64748B' }}>
                        {event.eventName}
                    </Typography>
                    <Chip
                        label={`${filteredTimelines.length} Tasks`}
                        size="small"
                        sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', height: 24, bgcolor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
                    />
                </Box>

                {/* Timeline Section */}
                <Stack spacing={0} sx={{ px: 3 }}>
                    {filteredTimelines.length > 0 ? (
                        filteredTimelines.map((timeline, index) => {
                            const isCompleted = timeline.status === 'completed';
                            const isActive = timeline.status === 'in-progress';
                            const isLast = index === filteredTimelines.length - 1;

                            // Timestamp
                            const dateObj = new Date(timeline.completedAt || timeline.createdAt);
                            const timeStr = dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
                            const [hour, min] = timeStr.split(':');
                            const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM'; // simplistic

                            // Status colors
                            const getTimelineStatusColor = () => {
                                if (isCompleted) return { bg: '#10b981', light: '#d1fae5', text: 'เสร็จสิ้น' };
                                return { bg: '#3b82f6', light: '#dbeafe', text: 'กำลังดำเนินการ' };
                            };
                            const statusColor = getTimelineStatusColor();

                            // Image handling
                            let images: string[] = [];
                            try {
                                images = JSON.parse(timeline.images || '[]');
                            } catch (e) {
                                if (timeline.images && !timeline.images.startsWith('[')) {
                                    images = [timeline.images];
                                }
                            }

                            return (
                                <Box
                                    key={timeline.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        position: 'relative',
                                        minHeight: 100, // Ensure visual space for line
                                    }}
                                >
                                    {/* Left Column: Time & Date */}
                                    <Box
                                        sx={{
                                            width: 50,
                                            flexShrink: 0,
                                            textAlign: 'center',
                                            pt: 0.5,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                color: '#1E293B',
                                                lineHeight: 1,
                                            }}
                                        >
                                            {timeStr}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.75rem',
                                                color: '#64748B',
                                            }}
                                        >
                                            {ampm}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.65rem',
                                                color: '#94A3B8',
                                                mt: 0.5,
                                            }}
                                        >
                                            {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </Typography>
                                    </Box>

                                    {/* Middle Column: Line & Dot */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Dot */}
                                        <Box
                                            sx={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: '50%',
                                                bgcolor: isActive ? '#3B82F6' : (isCompleted ? '#CBD5E1' : '#E2E8F0'), // Blue if active, Gray if done
                                                border: '3px solid #F8FAFC', // Match background to create ring effect
                                                boxShadow: isActive ? '0 0 0 2px #3B82F6' : 'none',
                                                zIndex: 2,
                                                mt: 0.5,
                                            }}
                                        />
                                        {/* Line */}
                                        {!isLast && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 20,
                                                    bottom: -10,
                                                    width: 2,
                                                    bgcolor: '#E2E8F0',
                                                    zIndex: 1,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* Right Column: Card Content */}
                                    <Box sx={{ flex: 1, pb: 4 }}>
                                        <Card
                                            onClick={() => {
                                                setSelectedTimeline(timeline);
                                                setDrawerOpen(true);
                                            }}
                                            sx={{
                                                boxShadow: 'none',
                                                bgcolor: 'white',
                                                borderRadius: 3,
                                                p: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                border: '1px solid #F1F5F9',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem',
                                                    color: '#1E293B',
                                                    mb: 0.5,
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                {timeline.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.8rem',
                                                    color: '#64748B',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                <Location size={14} variant="Bold" color="#64748B" />
                                                {event.venue || 'Event Location'}
                                            </Typography>

                                            {/* Progress Bar (Segmented) */}
                                            {timeline.progress !== null && timeline.progress !== undefined && (
                                                <Box sx={{ mt: 1.5, mb: 1.5 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', color: '#64748B' }}>
                                                            {timeline.progress}%
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        {[...Array(10)].map((_, i) => (
                                                            <Box
                                                                key={i}
                                                                sx={{
                                                                    flex: 1,
                                                                    height: 6,
                                                                    borderRadius: 4,
                                                                    bgcolor: (timeline.progress || 0) >= (i + 1) * 10
                                                                        ? (isCompleted ? '#10b981' : (isActive ? '#3b82f6' : '#9ca3af'))
                                                                        : '#E2E8F0'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Avatar / Attached Image at Bottom */}
                                            <Box sx={{ mt: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                {/* Start: Images as Avatars */}
                                                {images.length > 0 ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {images.slice(0, 3).map((img, i) => (
                                                            <Box
                                                                key={i}
                                                                component="img"
                                                                src={img}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    objectFit: 'cover',
                                                                    border: '2px solid white',
                                                                    ml: i > 0 ? -1 : 0,
                                                                }}
                                                            />
                                                        ))}
                                                        {images.length > 3 && (
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    bgcolor: '#F1F5F9',
                                                                    border: '2px solid white',
                                                                    ml: -1,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 600,
                                                                    color: '#64748B',
                                                                }}
                                                            >
                                                                +{images.length - 3}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    // Placeholder if no image, just to keep layout balanced or empty
                                                    <Box />
                                                )}

                                                {/* End: Status or Arrow */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusColor.bg }} />
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', color: statusColor.bg, fontWeight: 600 }}>
                                                        {statusColor.text}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Box>
                                </Box>
                            );
                        })
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                            <Box sx={{ bgcolor: 'white', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <SearchStatus size={28} color="#94A3B8" />
                            </Box>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontSize: '0.9rem' }}>
                                No activities found for this date
                            </Typography>
                        </Box>
                    )}
                </Stack>
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
                                    <Clock size={16} variant="Bold" color="#64748B" />
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
        </Box>
    );
}
