'use client';

import { Container, Typography, Card, CardContent, Box, Stack, Chip, Skeleton, TextField, InputAdornment, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { Calendar, Location, TickCircle, ArrowRight2, SearchNormal, CloseCircle, MagicStar } from 'iconsax-react';
import Link from 'next/link';
import { initializeLiff } from '@/lib/liff';

interface Event {
    id: string;
    eventName: string;
    eventDate: string;
    venue: string;
    status: string;
    inviteCode: string;
    isReviewed?: boolean;
    reviewRating?: number;
    reviewComment?: string | null;
}

export default function LiffEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    // Default to Current Year and 'in-progress'
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedStatus, setSelectedStatus] = useState<string>('in-progress');
    const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

    const toggleReview = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
    };

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

    // Extract available years from events
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        const currentYear = new Date().getFullYear().toString();
        years.add(currentYear); // Ensure current year is always available for default

        events.forEach(event => {
            if (event.eventDate) {
                const year = new Date(event.eventDate).getFullYear().toString();
                years.add(year);
            }
        });
        return ['All', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
    }, [events]);

    // Extract available statuses
    const availableStatuses = useMemo(() => {
        const statuses = new Set<string>();
        statuses.add('in-progress'); // Ensure default status is available

        events.forEach(event => statuses.add(event.status));
        return ['All', ...Array.from(statuses)];
    }, [events]);

    // Filter events
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.toLowerCase());
        const eventYear = event.eventDate ? new Date(event.eventDate).getFullYear().toString() : 'Unknown';
        const matchesYear = selectedYear === 'All' || eventYear === selectedYear;
        const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus;
        return matchesSearch && matchesYear && matchesStatus;
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'confirmed':
                return { label: 'ยืนยัน', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' }; // Blue
            case 'in-progress':
                return { label: 'กำลังทำ', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' }; // Orange
            case 'completed':
                return { label: 'ปิดงานแล้ว', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' }; // Green
            case 'draft':
                return { label: 'งานใหม่', color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.1)' }; // Gray
            case 'cancelled':
                return { label: 'ยกเลิก', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }; // Red
            default:
                return { label: status, color: 'gray', bgColor: 'rgba(0,0,0,0.05)' };
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 3, pb: 12 }}>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 2 }}>
                    📋 งานทั้งหมด
                </Typography>
                <Skeleton variant="rounded" height={40} sx={{ mb: 2, borderRadius: 2 }} />
                <Stack spacing={2}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 2 }} />
                    ))}
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 3, pb: 12 }}>
            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 2, color: '#1e293b' }}>
                📋 งานทั้งหมด ({filteredEvents.length})
            </Typography>

            {/* Search Bar */}
            <TextField
                fullWidth
                placeholder="ค้นหางาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'white',
                        fontFamily: 'var(--font-prompt)',
                        color: '#1e293b',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
                        '&:hover fieldset': { borderColor: 'var(--primary)' },
                        '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                    },
                    '& .MuiInputBase-input': { color: '#1e293b' },
                    '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 1 }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchNormal size={20} color="#94a3b8" />
                        </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setSearchQuery('')} size="small">
                                <CloseCircle size={18} color="#94a3b8" variant="Bold" />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            {/* Filters Row */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                {/* Year Select */}
                <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Year' }}
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                            fontFamily: 'var(--font-prompt)',
                            color: '#1e293b',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        }}
                    >
                        {availableYears.map((year) => (
                            <MenuItem key={year} value={year} sx={{ fontFamily: 'var(--font-prompt)' }}>
                                {year === 'All' ? 'ทุกปี' : year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Status Select */}
                <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Status' }}
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                            fontFamily: 'var(--font-prompt)',
                            color: '#1e293b',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        }}
                        renderValue={(selected) => {
                            if (selected === 'All') return 'ทุกสถานะ';
                            const info = getStatusInfo(selected as string);
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: info.color }} />
                                    {info.label}
                                </Box>
                            );
                        }}
                    >
                        {availableStatuses.map((status) => {
                            const info = getStatusInfo(status);
                            return (
                                <MenuItem key={status} value={status} sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    {status === 'All' ? (
                                        'ทุกสถานะ'
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: info.color }} />
                                            {info.label}
                                        </Box>
                                    )}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>

            {filteredEvents.length === 0 ? (
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 6, bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748b', mb: 1 }}>
                        ไม่พบงานที่คุณค้นหา
                    </Typography>
                </Card>
            ) : (
                <Stack spacing={1.5}>
                    {filteredEvents.map((event) => {
                        const statusInfo = getStatusInfo(event.status);
                        return (
                            <Link
                                key={event.id}
                                href={`/liff?inviteCode=${event.inviteCode}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Card
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 2.5,
                                        overflow: 'hidden',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s',
                                        bgcolor: 'white',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                        },
                                    }}
                                >
                                    {/* Status Strip Indicator */}
                                    <Box sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 4,
                                        bgcolor: statusInfo.color
                                    }} />

                                    <CardContent sx={{ p: 1.5, pl: 2.5, display: 'flex', alignItems: 'center', gap: 2, '&:last-child': { pb: 1.5 } }}>
                                        {/* Date Badge (Compact) */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'rgba(0,0,0,0.03)',
                                            borderRadius: 1.5,
                                            width: 46,
                                            height: 48,
                                            flexShrink: 0
                                        }}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1, mb: 0.2 }}>
                                                {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }) : '-'}
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '1rem', color: '#1e293b', fontWeight: 700, lineHeight: 1 }}>
                                                {event.eventDate ? new Date(event.eventDate).getDate() : '-'}
                                            </Typography>
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: '#1e293b',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {event.eventName}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                                                    {event.isReviewed && (
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            bgcolor: '#FEF3C7',
                                                            color: '#D97706',
                                                            px: 0.8,
                                                            py: 0.2,
                                                            borderRadius: 1,
                                                            height: 20
                                                        }}>
                                                            <MagicStar size={10} variant="Bold" color="#D97706" />
                                                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, fontFamily: 'var(--font-prompt)', lineHeight: 1 }}>
                                                                รีวิวแล้ว
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    <Chip
                                                        label={statusInfo.label}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: statusInfo.bgColor,
                                                            color: statusInfo.color,
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.6rem',
                                                            fontWeight: 600,
                                                            height: 20,
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {event.venue && (
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                                        <Location size={12} variant="Bold" color="#64748b" />
                                                        {event.venue}
                                                    </Typography>
                                                )}
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Calendar size={12} variant="Bold" color="#64748b" />
                                                    {event.eventDate ? new Date(event.eventDate).getFullYear() : '-'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                    {/* Review Comment Section */}
                                    {event.isReviewed && event.reviewComment && (
                                        <Box sx={{ px: 2.5, pb: 2, pt: 0 }}>
                                            <Box sx={{
                                                p: 1.5,
                                                bgcolor: '#F8FAFC',
                                                borderRadius: 2,
                                                border: '1px dashed #E2E8F0',
                                                position: 'relative'
                                            }}>
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.8rem',
                                                        color: '#475569',
                                                        lineHeight: 1.5,
                                                        display: expandedReviews[event.id] ? 'block' : '-webkit-box',
                                                        WebkitLineClamp: expandedReviews[event.id] ? 'none' : 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <span style={{ color: '#D97706', fontWeight: 600 }}>ความเห็น: </span>
                                                    {event.reviewComment}
                                                </Typography>

                                                {event.reviewComment.length > 80 && (
                                                    <Typography
                                                        component="span"
                                                        onClick={(e) => toggleReview(e, event.id)}
                                                        sx={{
                                                            display: 'inline-block',
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.75rem',
                                                            color: '#3B82F6',
                                                            fontWeight: 600,
                                                            mt: 0.5,
                                                            cursor: 'pointer',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        {expandedReviews[event.id] ? 'แสดงน้อยลง' : '... อ่านเพิ่มเติม'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </Card>
                            </Link>
                        );
                    })}
                </Stack>
            )}
        </Container>
    );
}
