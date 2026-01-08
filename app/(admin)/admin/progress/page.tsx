'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Chip,
    Stack,
    Avatar,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
    IconButton,
    Fade,
} from '@mui/material';
import { SearchNormal1, Calendar, Location, User, Clock, TickCircle, AddCircle, ArrowRight2 } from 'iconsax-react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

interface Event {
    id: string;
    eventName: string;
    eventDate: string | null;
    venue: string | null;
    status: string;
    customer: {
        id: string;
        displayName: string | null;
        pictureUrl: string | null;
        lineUid: string;
        companyName: string | null;
    };
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string; gradient: string }> = {
    draft: { label: 'ร่าง', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)', gradient: 'linear-gradient(135deg, #6B7280, #4B5563)' },
    confirmed: { label: 'ยืนยันแล้ว', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
    completed: { label: 'ปิดงาน', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    cancelled: { label: 'ยกเลิก', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)' },
};

// Tab definitions
const tabConfig = [
    {
        key: 'in-progress',
        label: 'กำลังดำเนินการ',
        shortLabel: 'ดำเนินการ',
        icon: Clock,
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        statuses: ['in-progress', 'confirmed']
    },
    {
        key: 'new',
        label: 'ลูกค้าใหม่',
        shortLabel: 'ใหม่',
        icon: AddCircle,
        color: '#3B82F6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        statuses: ['draft']
    },
    {
        key: 'completed',
        label: 'จบงานแล้ว',
        shortLabel: 'จบแล้ว',
        icon: TickCircle,
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        statuses: ['completed']
    },
];

export default function ProgressPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [selectedYear, setSelectedYear] = useState('2026');

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, search, activeTab, selectedYear]);

    // Derived state for years
    const availableYears = Array.from(new Set([
        2026,
        new Date().getFullYear(),
        ...events
            .map(e => e.eventDate ? new Date(e.eventDate).getFullYear() : 0)
            .filter(y => y > 0)
    ])).sort((a, b) => b - a).map(String);

    async function fetchEvents() {
        try {
            const res = await fetch('/api/admin/events');
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }

    function filterEvents() {
        const currentTab = tabConfig[activeTab];
        let result = events.filter(e => currentTab.statuses.includes(e.status));

        // Filter by Year
        if (selectedYear !== 'all') {
            result = result.filter(e => {
                if (!e.eventDate) return false;
                return new Date(e.eventDate).getFullYear().toString() === selectedYear;
            });
        }

        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.eventName.toLowerCase().includes(searchLower) ||
                    e.customer.displayName?.toLowerCase().includes(searchLower) ||
                    e.customer.companyName?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredEvents(result);
    }

    // Get count for each tab
    function getTabCount(tabIndex: number) {
        const tab = tabConfig[tabIndex];
        return events.filter(e => tab.statuses.includes(e.status)).length;
    }

    return (
        <Box sx={{ pb: { xs: 10, md: 4 }, maxWidth: '100%', overflowX: 'hidden' }}>
            {/* Header - Compact for mobile */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                        color: '#1a1a1a',
                        mb: 0.5,
                    }}
                >
                    ส่งอัพเดทลูกค้า
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#999', fontSize: '0.9rem' }}>
                    {events.length} งานทั้งหมด
                </Typography>
            </Box>

            {/* Tab Pills - Swiper for mobile/overflow */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: { xs: 'calc(100vw - 32px)', md: '100%' }, // Explicit constraint for mobile
                    mx: 'auto',
                    '& .swiper': {
                        width: '100%',
                        padding: '4px 4px 12px 4px !important',
                    },
                    '& .swiper-slide': {
                        width: 'auto',
                    }
                }}
            >
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={12}
                    freeMode={true}
                    modules={[FreeMode]}
                    grabCursor={true}
                    observer={true}
                    observeParents={true}
                >
                    {tabConfig.map((tab, index) => {
                        const Icon = tab.icon;
                        const count = getTabCount(index);
                        const isActive = activeTab === index;
                        return (
                            <SwiperSlide key={tab.key}>
                                <Box
                                    onClick={() => setActiveTab(index)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 1, sm: 1.2 },
                                        px: { xs: 2, sm: 2.5 },
                                        py: { xs: 1, sm: 1.5 },
                                        borderRadius: { xs: 3, sm: 4 },
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        bgcolor: isActive ? tab.color : 'white',
                                        color: isActive ? 'white' : '#666',
                                        boxShadow: isActive ? `0 8px 20px ${tab.color}40` : '0 2px 10px rgba(0,0,0,0.04)',
                                        border: isActive ? 'none' : '1px solid #f0f0f0',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: isActive ? `0 10px 25px ${tab.color}50` : '0 4px 15px rgba(0,0,0,0.06)',
                                        },
                                        '&:active': {
                                            transform: 'scale(0.95)',
                                        }
                                    }}
                                >
                                    <Icon size={18} color={isActive ? 'white' : tab.color} variant={isActive ? 'Bold' : 'Outline'} />
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        display: { xs: 'none', sm: 'block' }
                                    }}>
                                        {tab.label}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        display: { xs: 'block', sm: 'none' }
                                    }}>
                                        {tab.shortLabel}
                                    </Typography>
                                    <Box sx={{
                                        bgcolor: isActive ? 'rgba(255,255,255,0.25)' : tab.bgColor,
                                        color: isActive ? 'white' : tab.color,
                                        px: { xs: 0.8, sm: 1.2 },
                                        py: { xs: 0.2, sm: 0.4 },
                                        borderRadius: 2,
                                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                        fontWeight: 700,
                                        minWidth: { xs: 20, sm: 24 },
                                        textAlign: 'center'
                                    }}>
                                        {count}
                                    </Box>
                                </Box>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Box>

            {/* Search and Year Filter */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="ค้นหาชื่องาน หรือลูกค้า..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: 3,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            border: 'none',
                            '& fieldset': { border: '1px solid #f0f0f0' },
                            '&:hover fieldset': { borderColor: '#ddd' },
                            '&.Mui-focused fieldset': { borderColor: tabConfig[activeTab].color, borderWidth: 1 },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchNormal1 size={20} color="#999" />
                            </InputAdornment>
                        ),
                        sx: { fontFamily: 'var(--font-prompt)', py: 0.5 },
                    }}
                />

                <TextField
                    select
                    size="small"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    SelectProps={{ native: true }}
                    sx={{
                        width: 100,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: 3,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            border: 'none',
                            '& fieldset': { border: '1px solid #f0f0f0' },
                            '&:hover fieldset': { borderColor: '#ddd' },
                            '&.Mui-focused fieldset': { borderColor: tabConfig[activeTab].color, borderWidth: 1 },
                        },
                        '& select': {
                            fontFamily: 'var(--font-prompt)',
                            py: '10.5px !important'
                        }
                    }}
                >
                    <option value="all">ทุกปี</option>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </TextField>
            </Box>

            {/* Events List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: tabConfig[activeTab].color }} />
                </Box>
            ) : filteredEvents.length === 0 ? (
                <Fade in>
                    <Card sx={{
                        borderRadius: 4,
                        textAlign: 'center',
                        py: 8,
                        px: 3,
                        bgcolor: 'white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: tabConfig[activeTab].bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                        }}>
                            {activeTab === 0 && <Clock size={36} color={tabConfig[0].color} variant="Bulk" />}
                            {activeTab === 1 && <AddCircle size={36} color={tabConfig[1].color} variant="Bulk" />}
                            {activeTab === 2 && <TickCircle size={36} color={tabConfig[2].color} variant="Bulk" />}
                        </Box>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#1a1a1a', fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
                            {search ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีงาน'}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#999', fontSize: '0.9rem' }}>
                            {search ? 'ลองค้นหาด้วยคำอื่น' : `ในหมวด${tabConfig[activeTab].label}`}
                        </Typography>
                    </Card>
                </Fade>
            ) : (
                <Stack spacing={{ xs: 1, md: 2 }}>
                    {filteredEvents.map((event, index) => (
                        <Fade in timeout={150 + index * 50} key={event.id}>
                            <Card
                                onClick={() => router.push(`/admin/progress/${event.id}`)}
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    border: '1px solid #f5f5f5',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: { xs: 'none', md: 'translateX(4px)' },
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                                        borderColor: tabConfig[activeTab].color + '40',
                                    },
                                    '&:active': {
                                        transform: 'scale(0.98)',
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex' }}>
                                    {/* Left color bar - match active tab color */}
                                    <Box sx={{
                                        width: 4,
                                        bgcolor: tabConfig[activeTab].color,
                                        flexShrink: 0,
                                    }} />

                                    <CardContent sx={{ flex: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                        {/* Top row: Customer + Status */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar
                                                src={event.customer.pictureUrl || undefined}
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    border: '2px solid #f5f5f5',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                <User size={20} />
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        color: '#1a1a1a',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {event.customer.displayName || 'ไม่ระบุชื่อ'}
                                                </Typography>
                                                {event.customer.companyName && (
                                                    <Typography sx={{
                                                        fontSize: '0.75rem',
                                                        color: '#999',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {event.customer.companyName}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Chip
                                                label={statusLabels[event.status]?.label || event.status}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    height: 24,
                                                    bgcolor: tabConfig[activeTab].bgColor,
                                                    color: tabConfig[activeTab].color,
                                                }}
                                            />
                                        </Box>

                                        {/* Event name */}
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                color: '#1a1a1a',
                                                mb: 1.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {event.eventName}
                                        </Typography>

                                        {/* Bottom row: Date & Venue */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <Calendar size={14} color="#bbb" variant="Bold" />
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: '#999' }}>
                                                        {event.eventDate
                                                            ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                            })
                                                            : 'ไม่ระบุ'}
                                                    </Typography>
                                                </Box>
                                                {event.venue && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
                                                        <Location size={14} color="#bbb" variant="Bold" />
                                                        <Typography
                                                            sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.75rem',
                                                                color: '#999',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {event.venue}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <IconButton size="small" sx={{ ml: 1 }}>
                                                <ArrowRight2 size={18} color="#ccc" />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Card>
                        </Fade>
                    ))}
                </Stack>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 3 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
