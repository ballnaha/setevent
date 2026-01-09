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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { SearchNormal1, Calendar, Location, User, Send2, Add } from 'iconsax-react';
import Link from 'next/link';
import TopSnackbar from '@/components/ui/TopSnackbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

// ตั้งค่า locale ให้เป็นภาษาไทย
dayjs.locale('th');

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

interface Customer {
    id: string;
    displayName: string | null;
    companyName: string | null;
    pictureUrl: string | null;
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'แบบร่าง', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
    confirmed: { label: 'ยืนยันแล้ว', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    completed: { label: 'เสร็จสิ้น', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    cancelled: { label: 'ยกเลิก', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

export default function EventsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Create Event States
    const [dialogOpen, setDialogOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [fetchingCustomers, setFetchingCustomers] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form Data
    const [eventName, setEventName] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [eventDate, setEventDate] = useState<Dayjs | null>(null);
    const [venue, setVenue] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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

    async function fetchCustomers() {
        if (customers.length > 0) return;
        setFetchingCustomers(true);
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setFetchingCustomers(false);
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

    const handleOpenDialog = () => {
        fetchCustomers();
        setEventName('');
        setCustomerId('');
        setEventDate(null);
        setVenue('');
        setDescription('');
        setNotes('');
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSave = async () => {
        if (!eventName || !customerId) {
            setSnackbar({ open: true, message: 'กรุณากรอกชื่องานและเลือกลูกค้า', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                eventName,
                customerId,
                eventDate: eventDate ? eventDate.toISOString() : null,
                venue,
                description,
                notes
            };

            const res = await fetch('/api/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSnackbar({ open: true, message: 'สร้างงาน Event สำเร็จ', severity: 'success' });
                handleCloseDialog();
                fetchEvents();
            } else {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create event');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
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
                <Button
                    variant="contained"
                    startIcon={<Add size={20} color="white" />}
                    onClick={handleOpenDialog}
                    sx={{
                        bgcolor: '#1a1a1a',
                        fontFamily: 'var(--font-prompt)',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                        '&:hover': {
                            bgcolor: '#333',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    สร้างงานใหม่
                </Button>
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

            {/* Create Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullScreen={isMobile}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: isMobile ? 0 : 3 }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        ➕ สร้างงานใหม่
                    </Box>
                    <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
                        <Add size={24} style={{ transform: 'rotate(45deg)' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                            <TextField
                                label="ชื่องาน Event"
                                fullWidth
                                required
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>ลูกค้า</InputLabel>
                                    <Select
                                        value={customerId}
                                        label="ลูกค้า"
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                        disabled={fetchingCustomers}
                                    >
                                        {customers.map((c) => (
                                            <MenuItem key={c.id} value={c.id} sx={{ fontFamily: 'var(--font-prompt)' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar src={c.pictureUrl || undefined} sx={{ width: 24, height: 24 }} />
                                                    {c.displayName || 'No Name'} {c.companyName ? `(${c.companyName})` : ''}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                                    <DatePicker
                                        label="วันที่จัดงาน"
                                        value={eventDate}
                                        onChange={(newValue) => setEventDate(newValue)}
                                        sx={{ width: '100%' }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                InputProps: { sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } },
                                                InputLabelProps: { sx: { fontFamily: 'var(--font-prompt)' } }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>

                        <Box>
                            <TextField
                                label="สถานที่จัดงาน"
                                fullWidth
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                InputProps={{
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Location size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />
                        </Box>

                        <Box>
                            <TextField
                                label="รายละเอียดงาน"
                                fullWidth
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />
                        </Box>

                        <Box>
                            <TextField
                                label="หมายเหตุ (ภายใน)"
                                fullWidth
                                multiline
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="บันทึกสำหรับทีมงาน (ลูกค้าไม่เห็น)"
                                InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2, px: 3 }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: '#1a1a1a',
                            borderRadius: 2,
                            px: 4,
                            '&:hover': { bgcolor: '#333' }
                        }}
                    >
                        {saving ? 'กำลังบันทึก...' : 'สร้างงาน'}
                    </Button>
                </DialogActions>
            </Dialog>

            <TopSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Box>
    );
}
