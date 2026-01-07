'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
} from '@mui/material';
import { SearchNormal1, Calendar, Location, User, Send2 } from 'iconsax-react';
import Link from 'next/link';

interface Event {
    id: string;
    eventName: string;
    eventDate: string | null;
    venue: string | null;
    status: string;
    createdAt: string;
    customer: {
        id: string;
        displayName: string | null;
        pictureUrl: string | null;
    };
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'แบบร่าง', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
    confirmed: { label: 'ยืนยันแล้ว', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    completed: { label: 'เสร็จสิ้น', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    cancelled: { label: 'ยกเลิก', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, search, statusFilter]);

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
        let result = events;

        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.eventName.toLowerCase().includes(searchLower) ||
                    e.customer.displayName?.toLowerCase().includes(searchLower) ||
                    e.venue?.toLowerCase().includes(searchLower)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter((e) => e.status === statusFilter);
        }

        setFilteredEvents(result);
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        mb: 1,
                        color: '#1a1a1a',
                    }}
                >
                    📅 รายการ Events
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                    จัดการงาน Event ทั้งหมด
                </Typography>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="ค้นหาชื่องาน, ลูกค้า หรือสถานที่..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchNormal1 size={18} color="gray" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 },
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 200px' } }}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะ</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="สถานะ"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                >
                                    <MenuItem value="all">ทั้งหมด</MenuItem>
                                    {Object.entries(statusLabels).map(([key, val]) => (
                                        <MenuItem key={key} value={key}>
                                            {val.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.85rem',
                                    color: 'gray',
                                }}
                            >
                                พบ {filteredEvents.length} งาน
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>งาน</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ลูกค้า</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>วันที่จัดงาน</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานที่</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานะ</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }} align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEvents.map((event) => (
                                <TableRow key={event.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500 }}>
                                            {event.eventName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                src={event.customer.pictureUrl || undefined}
                                                sx={{ width: 32, height: 32 }}
                                            >
                                                <User size={16} />
                                            </Avatar>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                                {event.customer.displayName || 'ไม่ระบุชื่อ'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Calendar size={16} color="gray" />
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                                {event.eventDate
                                                    ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : 'ยังไม่กำหนด'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {event.venue ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Location size={16} color="gray" />
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.85rem',
                                                        maxWidth: 150,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {event.venue}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                                -
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusLabels[event.status]?.label || event.status}
                                            size="small"
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.7rem',
                                                bgcolor: statusLabels[event.status]?.bgColor || 'rgba(0,0,0,0.05)',
                                                color: statusLabels[event.status]?.color || '#666',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="ส่งอัพเดท">
                                            <IconButton
                                                component={Link}
                                                href="/admin/progress"
                                                size="small"
                                                sx={{
                                                    color: 'var(--primary)',
                                                    '&:hover': { bgcolor: 'rgba(10, 92, 90, 0.1)' },
                                                }}
                                            >
                                                <Send2 size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
