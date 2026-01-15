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
                <Card sx={{ borderRadius: 4, textAlign: 'center', py: 8, bgcolor: 'rgba(0,0,0,0.02)', boxShadow: 'none', border: '1px dashed rgba(0,0,0,0.1)' }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748b', mb: 1 }}>
                        ไม่พบข้อมูลงานในระบบ
                    </Typography>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {filteredEvents.map((event) => {
                        const getEventTheme = (status: string) => {
                            switch (status) {
                                case 'in-progress':
                                    return { bg: '#f17a4c', icon: <MagicStar size="48" color="rgba(255,255,255,0.9)" variant="Outline" />, label: 'กำลังดำเนินการ' };
                                case 'confirmed':
                                    return { bg: '#8e94f3', icon: <TickCircle size="48" color="rgba(255,255,255,0.9)" variant="Outline" />, label: 'ยืนยันรายละเอียด' };
                                case 'completed':
                                    return { bg: '#50c878', icon: <MagicStar size="48" color="rgba(255,255,255,0.9)" variant="Bold" />, label: 'เสร็จสมบูรณ์' };
                                case 'cancelled':
                                    return { bg: '#94a3b8', icon: <CloseCircle size="48" color="rgba(255,255,255,0.9)" variant="Outline" />, label: 'ยกเลิกงาน' };
                                default:
                                    return { bg: '#5da9e9', icon: <SearchNormal size="48" color="rgba(255,255,255,0.9)" variant="Outline" />, label: 'งานใหม่' };
                            }
                        };

                        const theme = getEventTheme(event.status);

                        return (
                            <Link
                                key={event.id}
                                href={`/liff?inviteCode=${event.inviteCode}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Card
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 6,
                                        overflow: 'hidden',
                                        bgcolor: theme.bg,
                                        height: 120,
                                        display: 'flex',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: 'none',
                                        boxShadow: `0 8px 24px ${theme.bg}40`,
                                        '&:active': {
                                            transform: 'scale(0.98)',
                                            opacity: 0.9
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            right: -20,
                                            top: -20,
                                            width: 140,
                                            height: 160,
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }
                                    }}
                                >
                                    <CardContent sx={{
                                        p: 3,
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        '&:last-child': { pb: 3 }
                                    }}>
                                        <Box sx={{ flex: 1, pr: 2 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 700,
                                                    fontSize: '1.25rem',
                                                    color: 'white',
                                                    lineHeight: 1.2,
                                                    mb: 0.5,
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {event.eventName}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(255,255,255,0.85)',
                                                    fontWeight: 500
                                                }}>
                                                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: '2-digit'
                                                    }) : 'ไม่ระบุวันที่'}
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>•</Typography>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(255,255,255,0.85)',
                                                    fontWeight: 500,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: 120
                                                }}>
                                                    {event.venue || 'ไม่ระบุสถานที่'}
                                                </Typography>
                                            </Stack>

                                            {/* Status Badge inside card - optional but helpful */}
                                            <Box sx={{
                                                mt: 1.5,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 10,
                                                backdropFilter: 'blur(4px)'
                                            }}>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.65rem',
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
                                            mr: 1
                                        }}>
                                            {theme.icon}
                                        </Box>
                                    </CardContent>

                                    {/* Review Indicator Overlay if reviewed */}
                                    {event.isReviewed && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            bgcolor: '#fbbf24',
                                            color: '#b45309',
                                            p: 0.5,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            zIndex: 2,
                                            border: '2px solid white'
                                        }}>
                                            <MagicStar size={12} variant="Bold" />
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
