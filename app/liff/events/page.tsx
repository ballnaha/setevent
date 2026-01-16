'use client';

import { Container, Typography, Card, CardContent, Box, Stack, Chip, Skeleton, TextField, InputAdornment, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { Calendar, Location, TickCircle, ArrowRight2, SearchNormal, CloseCircle, MagicStar, Screenmirroring, StatusUp, MirroringScreen, ArrowRight } from 'iconsax-react';
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
                    {filteredEvents.map((event, idx) => {
                        const getEventTheme = (status: string) => {
                            switch (status) {
                                case 'in-progress':
                                    return { bg: '#F59E0B', icon: <StatusUp size="28" color="rgba(255,255,255,0.95)" variant="Bold" />, label: 'กำลังดำเนินการ' };
                                case 'confirmed':
                                    return { bg: '#8e94f3', icon: <TickCircle size="28" color="rgba(255,255,255,0.95)" variant="Bold" />, label: 'ยืนยันรายละเอียด' };
                                case 'completed':
                                    return { bg: '#50c878', icon: <MagicStar size="28" color="rgba(255,255,255,0.95)" variant="Bold" />, label: 'เสร็จสมบูรณ์' };
                                case 'cancelled':
                                    return { bg: '#94a3b8', icon: <CloseCircle size="28" color="rgba(255,255,255,0.95)" variant="Bold" />, label: 'ยกเลิกงาน' };
                                default:
                                    return { bg: '#5da9e9', icon: <MirroringScreen size="28" color="rgba(255,255,255,0.95)" variant="Bold" />, label: 'งานใหม่' };
                            }
                        };

                        const theme = getEventTheme(event.status);

                        return (
                            <Box key={event.id}>
                                <Link
                                    href={`/liff?inviteCode=${event.inviteCode}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            borderRadius: event.isReviewed ? '20px 20px 0 0' : '20px',
                                            overflow: 'hidden',
                                            background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg}CC 100%)`,
                                            minHeight: 140,
                                            display: 'flex',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: 'none',
                                            boxShadow: event.isReviewed ? 'none' : `0 10px 30px ${theme.bg}50`,
                                            '&:active': {
                                                transform: 'scale(0.98)',
                                                opacity: 0.9
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                right: -30,
                                                top: -30,
                                                width: 120,
                                                height: 120,
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '50%',
                                                zIndex: 0
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                right: 40,
                                                bottom: -40,
                                                width: 100,
                                                height: 100,
                                                bgcolor: 'rgba(255,255,255,0.08)',
                                                borderRadius: '50%',
                                                zIndex: 0
                                            }
                                        }}
                                    >
                                        <CardContent sx={{
                                            p: 2.5,
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            position: 'relative',
                                            zIndex: 1,
                                            '&:last-child': { pb: 2.5 }
                                        }}>
                                            {/* Avatar/Icon Circle */}
                                            <Box sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: '50%',
                                                bgcolor: 'rgba(255,255,255,0.25)',
                                                backdropFilter: 'blur(8px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                border: '2px solid rgba(255,255,255,0.3)'
                                            }}>
                                                {theme.icon}
                                            </Box>

                                            {/* Content */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                {/* Event Name */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontWeight: 700,
                                                        fontSize: '1.1rem',
                                                        color: 'white',
                                                        lineHeight: 1.3,
                                                        mb: 0.3,
                                                        textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {event.eventName}
                                                </Typography>

                                                {/* Subtitle - Status */}
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.8rem',
                                                    color: 'rgba(255,255,255,0.85)',
                                                    fontWeight: 500,
                                                    mb: 1.5
                                                }}>
                                                    สถานะ: {theme.label}
                                                </Typography>

                                                {/* Stats Row */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: 2.5
                                                }}>
                                                    {/* Date Stat */}
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.95rem',
                                                            color: 'white',
                                                            fontWeight: 700
                                                        }}>
                                                            {event.eventDate ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                                day: 'numeric',
                                                                month: 'short'
                                                            }) : '-'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.8rem',
                                                            color: 'rgba(255,255,255,0.7)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 0.5
                                                        }}>
                                                            วันที่
                                                        </Typography>
                                                    </Box>

                                                    {/* Location Stat */}
                                                    <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                                                        <Typography sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.95rem',
                                                            color: 'white',
                                                            fontWeight: 700,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            {event.venue || 'TBD'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.8rem',
                                                            color: 'rgba(255,255,255,0.7)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 0.5
                                                        }}>
                                                            สถานที่
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Arrow Icon */}
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                bgcolor: 'rgba(255,255,255,0.15)',
                                                backdropFilter: 'blur(12px)'
                                            }}>
                                                <ArrowRight size={40} variant="Outline" color="white" />
                                            </Box>
                                        </CardContent>

                                        {/* Review Indicator */}
                                        {event.isReviewed && (
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                bgcolor: '#fbbf24',
                                                color: '#b45309',
                                                p: 0.5,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                zIndex: 2,
                                                border: '2px solid white'
                                            }}>
                                                <MagicStar size={12} variant="Bold" />
                                            </Box>
                                        )}
                                    </Card>
                                </Link>

                                {/* Review Comment Section */}
                                {event.isReviewed && (
                                    <Box
                                        sx={{
                                            bgcolor: '#fffbeb',
                                            borderRadius: '0 0 24px 24px',
                                            px: 2.5,
                                            py: 2,
                                            border: '1px solid #fde68a',
                                            borderTop: 'none',
                                            boxShadow: `0 8px 24px ${theme.bg}40`,
                                        }}
                                    >
                                        {/* Stars & Label */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box sx={{ display: 'flex', gap: 0.25 }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <MagicStar
                                                        key={star}
                                                        size={14}
                                                        variant={star <= (event.reviewRating || 0) ? "Bold" : "Outline"}
                                                        color={star <= (event.reviewRating || 0) ? "#f59e0b" : "#d1d5db"}
                                                    />
                                                ))}
                                            </Box>
                                            <Typography sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.7rem',
                                                color: '#92400e',
                                                fontWeight: 600
                                            }}>
                                                รีวิวจากลูกค้า
                                            </Typography>
                                        </Box>

                                        {/* Comment Text or System Message */}
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.85rem',
                                                color: event.reviewComment ? '#78350f' : '#92400e',
                                                lineHeight: 1.6,
                                                fontStyle: event.reviewComment ? 'normal' : 'italic',
                                                display: '-webkit-box',
                                                WebkitLineClamp: expandedReviews[event.id] ? 'unset' : 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {event.reviewComment
                                                ? `"${event.reviewComment}"`
                                                : event.reviewRating === 5 ? '⭐ ลูกค้าให้คะแนนยอดเยี่ยม!'
                                                    : event.reviewRating === 4 ? '😊 ลูกค้าพึงพอใจมาก'
                                                        : event.reviewRating === 3 ? '👍 ลูกค้าพึงพอใจ'
                                                            : event.reviewRating === 2 ? '😐 ลูกค้าให้คะแนนปานกลาง'
                                                                : '📝 ลูกค้าให้คะแนนแล้ว'
                                            }
                                        </Typography>

                                        {/* Show More Button if comment is long */}
                                        {event.reviewComment && event.reviewComment.length > 80 && (
                                            <Typography
                                                onClick={(e) => toggleReview(e, event.id)}
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.75rem',
                                                    color: '#d97706',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    mt: 0.5,
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {expandedReviews[event.id] ? 'ย่อ' : 'อ่านเพิ่มเติม...'}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Container>
    );
}
