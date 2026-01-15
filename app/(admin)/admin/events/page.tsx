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
    useMediaQuery,
    Collapse,
    ButtonBase
} from '@mui/material';
import { SearchNormal1, Calendar, Location, User, Send2, Add, Edit, Trash, FilterSearch, ArrowDown2, ArrowUp2, DocumentFilter } from 'iconsax-react';
import Link from 'next/link';
import TopSnackbar from '@/components/ui/TopSnackbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
    description: string | null;
    notes: string | null;
    createdAt: string;
    customer: {
        id: string;
        displayName: string | null;
        companyName: string | null;
        pictureUrl: string | null;
    };
    sales: {
        id: string;
        name: string | null;
    } | null;
}

interface Staff {
    id: string;
    name: string | null;
    role: string;
}

interface Customer {
    id: string;
    displayName: string | null;
    companyName: string | null;
    pictureUrl: string | null;
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'งานใหม่', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    completed: { label: 'เสร็จสิ้น', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
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
    const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());

    // Create Event States
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [fetchingCustomers, setFetchingCustomers] = useState(false);
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [fetchingStaffs, setFetchingStaffs] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

    // Form Data
    const [eventName, setEventName] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [eventDate, setEventDate] = useState<Dayjs | null>(null);
    const [venue, setVenue] = useState('');
    const [status, setStatus] = useState('draft');
    const [salesId, setSalesId] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, search, statusFilter, yearFilter]);

    async function fetchEvents() {
        try {
            const res = await fetch('/api/admin/events');
            const data = await res.json();
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                console.warn('API response is not an array:', data);
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
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

    async function fetchStaffs() {
        if (staffs.length > 0) return;
        setFetchingStaffs(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            // Filter only sales and admins who can manage events
            setStaffs(data.filter((u: any) => u.role === 'sales' || u.role === 'admin'));
        } catch (error) {
            console.error('Failed to fetch staffs', error);
        } finally {
            setFetchingStaffs(false);
        }
    }

    function filterEvents() {
        if (!Array.isArray(events)) {
            setFilteredEvents([]);
            return;
        }
        let result = [...events];

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

        if (yearFilter !== 'all') {
            result = result.filter((e) => {
                const date = e.eventDate ? new Date(e.eventDate) : new Date(e.createdAt);
                return date.getFullYear().toString() === yearFilter;
            });
        }

        setFilteredEvents(result);
    }

    const handleOpenDialog = () => {
        fetchCustomers();
        fetchStaffs();
        setSelectedEvent(null);
        setEventName('');
        setCustomerId('');
        setSalesId('');
        setEventDate(null);
        setVenue('');
        setStatus('draft');
        setDescription('');
        setNotes('');
        setDialogOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        fetchCustomers();
        fetchStaffs();
        setSelectedEvent(event);
        setEventName(event.eventName);
        setCustomerId(event.customer.id);
        setSalesId(event.sales?.id || '');
        setEventDate(event.eventDate ? dayjs(event.eventDate) : null);
        setVenue(event.venue || '');
        setStatus(event.status || 'draft');
        setDescription(event.description || '');
        setNotes(event.notes || '');
        setDialogOpen(true);
    };

    const handleViewEvent = (event: Event) => {
        setSelectedEvent(event);
        setViewDialogOpen(true);
    };

    const handleDeleteClick = (event: Event) => {
        setSelectedEvent(event);
        setDeleteConfirmOpen(true);
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
                salesId: salesId || null,
                eventDate: eventDate ? eventDate.toISOString() : null,
                venue,
                status,
                description,
                notes
            };

            const url = selectedEvent ? `/api/admin/events/${selectedEvent.id}` : '/api/admin/events';
            const method = selectedEvent ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSnackbar({ open: true, message: selectedEvent ? 'แก้ไขงานสำเร็จ' : 'สร้างงาน Event สำเร็จ', severity: 'success' });
                handleCloseDialog();
                fetchEvents();
            } else {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save event');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedEvent) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/events/${selectedEvent.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setSnackbar({ open: true, message: 'ลบงานสำเร็จ', severity: 'success' });
                setDeleteConfirmOpen(false);
                fetchEvents();
            } else {
                throw new Error('Failed to delete event');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 700,
                            mb: 1,
                            color: '#1a1a1a',
                        }}
                    >
                        รายการ Events
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                        จัดการงาน Event ทั้งหมด
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Mobile Filter Toggle */}
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outlined"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 2,
                            borderColor: '#ddd',
                            color: '#666',
                            minWidth: 'auto',
                            px: 1.5
                        }}
                    >
                        <DocumentFilter size={20} color="black" />
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add size={20} color="white" />}
                        onClick={handleOpenDialog}
                        sx={{
                            bgcolor: '#1a1a1a',
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 2,
                            px: { xs: 2, md: 3 },
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
                        <span style={{ display: isMobile ? 'none' : 'inline' }}>สร้างงานใหม่</span>
                        <span style={{ display: isMobile ? 'inline' : 'none' }}>สร้าง</span>
                    </Button>
                </Box>
            </Box>

            {/* Filters */}
            <Collapse in={!isMobile || showFilters}>
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' } }}>
                                <TextField
                                    id="search-events-input"
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
                            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 150px' } }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>ปี</InputLabel>
                                    <Select
                                        value={yearFilter}
                                        label="ปี"
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                    >
                                        <MenuItem value="all">ทั้งหมด</MenuItem>
                                        {Array.from(new Set([
                                            new Date().getFullYear(),
                                            new Date().getFullYear() + 1,
                                            ...events.map(e => e.eventDate ? new Date(e.eventDate).getFullYear() : new Date(e.createdAt).getFullYear())
                                        ])).sort((a, b) => b - a).map(year => (
                                            <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 200px' } }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะ</InputLabel>
                                    <Select
                                        id="status-filter-select"
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
            </Collapse>

            {/* Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : isMobile ? (
                /* Mobile View: Card List */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredEvents.map((event) => (
                        <Card key={event.id} sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                            <CardContent sx={{ p: 2 }}>
                                {/* Header: Customer + Status */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                            src={event.customer.pictureUrl || undefined}
                                            sx={{ width: 40, height: 40, border: '1px solid #eee' }}
                                        >
                                            <User size={20} color="var(--primary)" />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '0.9rem' }}>
                                                {event.customer.displayName || 'ไม่ระบุชื่อ'}
                                                {event.customer.companyName && (
                                                    <Typography component="span" sx={{ fontSize: '0.8rem', color: '#666', ml: 0.5, fontWeight: normal => 400 }}>
                                                        ({event.customer.companyName})
                                                    </Typography>
                                                )}
                                            </Typography>
                                            <Chip
                                                label={statusLabels[event.status]?.label || event.status}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.65rem',
                                                    height: 20,
                                                    mt: 0.5,
                                                    bgcolor: statusLabels[event.status]?.bgColor || 'rgba(0,0,0,0.05)',
                                                    color: statusLabels[event.status]?.color || '#666',
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Event Details */}
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.1rem', mb: 1.5 }}>
                                    {event.eventName}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Calendar size={18} color="var(--primary)" variant="Bulk" />
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#666' }}>
                                            {event.eventDate ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            }) : 'ไม่ระบุวันที่'}
                                        </Typography>
                                    </Box>
                                    {event.venue && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Location size={18} color="var(--primary)" variant="Bulk" />
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#666' }}>
                                                {event.venue}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* Actions Row - Separated Buttons */}
                                <Box sx={{
                                    display: 'flex',
                                    borderTop: '1px solid #f0f0f0',
                                    mx: -2,
                                    mb: -2,
                                    mt: 2
                                }}>
                                    <Button
                                        onClick={() => handleViewEvent(event)}
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 0,
                                            color: 'var(--primary)',
                                            fontFamily: 'var(--font-prompt)',
                                            borderRight: '1px solid #f0f0f0'
                                        }}
                                        startIcon={<SearchNormal1 size={18} color="var(--primary)" />}
                                    >
                                        ดู
                                    </Button>
                                    <Button
                                        component={Link}
                                        href="/admin/progress"
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 0,
                                            color: '#3B82F6',
                                            fontFamily: 'var(--font-prompt)',
                                            borderRight: '1px solid #f0f0f0'
                                        }}
                                        startIcon={<Send2 size={18} color="#3B82F6" />}
                                    >
                                        ส่งอัพเดท
                                    </Button>
                                    <Button
                                        onClick={() => handleEditEvent(event)}
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 0,
                                            color: '#F59E0B',
                                            fontFamily: 'var(--font-prompt)',
                                            borderRight: '1px solid #f0f0f0'
                                        }}
                                        startIcon={<Edit size={18} color="#F59E0B" />}
                                    >
                                        แก้ไข
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteClick(event)}
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 0,
                                            color: '#EF4444',
                                            fontFamily: 'var(--font-prompt)'
                                        }}
                                        startIcon={<Trash size={18} color="#EF4444" />}
                                    >
                                        ลบ
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredEvents.length === 0 && (
                        <Typography sx={{ textAlign: 'center', color: '#999', py: 4, fontFamily: 'var(--font-prompt)' }}>
                            ไม่พบข้อมูล
                        </Typography>
                    )}
                </Box>
            ) : (
                /* Desktop View: Table */
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>งาน</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ลูกค้า</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ผู้ดูแล (Sales)</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>วันที่จัดงาน</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานที่</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานะ</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }} align="center">อัพเดทงาน</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }} align="center">
                                    จัดการ
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
                                                <User size={16} color="var(--primary)" />
                                            </Avatar>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                                {event.customer.displayName || 'ไม่ระบุชื่อ'}
                                                {event.customer.companyName && (
                                                    <Typography component="span" sx={{ fontSize: '0.75rem', color: '#666', display: 'block' }}>
                                                        {event.customer.companyName}
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: event.sales ? '#1a1a1a' : '#999' }}>
                                            {event.sales?.name || 'ไม่ระบุ'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Calendar size={16} color="var(--primary)" />
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                                {event.eventDate
                                                    ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                    : 'ยังไม่กำหนด'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {event.venue ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Location size={16} color="var(--primary)" />
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
                                        <Tooltip title="หน้าอัพเดทสถานะ">
                                            <IconButton
                                                component={Link}
                                                href="/admin/progress"
                                                size="small"
                                                sx={{
                                                    color: '#3B82F6',
                                                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' },
                                                }}
                                            >
                                                <Send2 size={20} color="#3B82F6" variant="Bulk" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="ดูรายละเอียด">
                                            <IconButton
                                                onClick={() => handleViewEvent(event)}
                                                size="small"
                                                sx={{
                                                    color: 'var(--primary)',
                                                    '&:hover': { bgcolor: 'rgba(10, 92, 90, 0.1)' },
                                                }}
                                            >
                                                <SearchNormal1 size={18} color="var(--primary)" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="แก้ไข">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditEvent(event)}
                                                sx={{
                                                    color: '#F59E0B',
                                                    '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' },
                                                }}
                                            >
                                                <Edit size={18} color="#F59E0B" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="ลบ">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(event)}
                                                sx={{
                                                    color: '#EF4444',
                                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                                                }}
                                            >
                                                <Trash size={18} color="#EF4444" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* View Details Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                fullScreen={isMobile}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: isMobile ? 0 : 3 }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        📋 รายละเอียดงาน
                    </Box>
                    <IconButton edge="end" color="inherit" onClick={() => setViewDialogOpen(false)} aria-label="close">
                        <Add size={24} style={{ transform: 'rotate(45deg)' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedEvent && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={selectedEvent.customer.pictureUrl || undefined}
                                    sx={{ width: 56, height: 56, border: '2px solid var(--primary)' }}
                                />
                                <Box>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.1rem' }}>
                                        {selectedEvent.customer.displayName || 'ไม่ระบุชื่อ'}
                                    </Typography>
                                    <Chip
                                        label={statusLabels[selectedEvent.status]?.label || selectedEvent.status}
                                        size="small"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.7rem',
                                            height: 22,
                                            mt: 0.5,
                                            bgcolor: statusLabels[selectedEvent.status]?.bgColor,
                                            color: statusLabels[selectedEvent.status]?.color,
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#888', fontSize: '0.85rem' }}>ชื่องาน</Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '1.1rem', fontWeight: 500 }}>{selectedEvent.eventName}</Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#888', fontSize: '0.85rem' }}>วันที่จัดงาน</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Calendar size={18} color="var(--primary)" variant="Bulk" />
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {selectedEvent.eventDate
                                                ? new Date(selectedEvent.eventDate).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : '-'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#888', fontSize: '0.85rem' }}>สถานที่</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Location size={18} color="var(--primary)" variant="Bulk" />
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {selectedEvent.venue || '-'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#888', fontSize: '0.85rem', mb: 0.5 }}>รายละเอียด</Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', whiteSpace: 'pre-line' }}>
                                    {selectedEvent.description || '-'}
                                </Typography>
                            </Box>

                            {/* Internal Notes Section - Highlighted */}
                            <Box sx={{ bgcolor: '#FFF7ED', p: 2, borderRadius: 2, border: '1px dashed #F59E0B' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#B45309', fontSize: '0.85rem', fontWeight: 600 }}>
                                        🔒 หมายเหตุภายใน (Internal Only)
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', whiteSpace: 'pre-line', color: '#B45309' }}>
                                    {selectedEvent.notes || '-'}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setViewDialogOpen(false)}
                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2, px: 3, color: '#666' }}
                    >
                        ปิด
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setViewDialogOpen(false);
                            if (selectedEvent) handleEditEvent(selectedEvent);
                        }}
                        size="large"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: '#F59E0B',
                            borderRadius: 2,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#D97706' }
                        }}
                        startIcon={<Edit size={20} color="white" />}
                    >
                        แก้ไข
                    </Button>
                </DialogActions>
            </Dialog>

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
                        {selectedEvent ? '✏️ แก้ไขงาน' : '➕ สร้างงานใหม่'}
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
                                    <DateTimePicker
                                        label="วันที่และเวลาเริ่มงาน"
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
                                        ampm={false} // Use 24-hour format
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>ผู้ดูแล (Sales)</InputLabel>
                                    <Select
                                        value={salesId}
                                        label="ผู้ดูแล (Sales)"
                                        onChange={(e) => setSalesId(e.target.value)}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                        disabled={fetchingStaffs}
                                        startAdornment={
                                            <InputAdornment position="start" sx={{ ml: 1 }}>
                                                <User size={20} color="#999" />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            <em>ไม่ระบุผู้ดูแล</em>
                                        </MenuItem>
                                        {staffs.map((s) => (
                                            <MenuItem key={s.id} value={s.id} sx={{ fontFamily: 'var(--font-prompt)' }}>
                                                {s.name} ({s.role === 'admin' ? 'Admin' : 'Sales'})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: 1 }}>
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
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะงาน</InputLabel>
                                    <Select
                                        value={status}
                                        label="สถานะงาน"
                                        onChange={(e) => setStatus(e.target.value)}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                        disabled={!selectedEvent}
                                    >
                                        {!selectedEvent ? (
                                            <MenuItem value="draft" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusLabels['draft'].color }} />
                                                    {statusLabels['draft'].label}
                                                </Box>
                                            </MenuItem>
                                        ) : (
                                            Object.entries(statusLabels).map(([key, val]) => (
                                                <MenuItem key={key} value={key} sx={{ fontFamily: 'var(--font-prompt)' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: val.color }} />
                                                        {val.label}
                                                    </Box>
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: 1 }} />
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
                        {saving ? 'กำลังบันทึก...' : (selectedEvent ? 'บันทึกการแก้ไข' : 'สร้างงาน')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)' }}>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณต้องการลบงาน "{selectedEvent?.eventName}" ใช่หรือไม่?
                        <br />
                        การกระทำนี้ไม่สามารถย้อนกลับได้
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        sx={{ fontFamily: 'var(--font-prompt)', color: '#666' }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        disabled={deleting}
                        autoFocus
                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                    >
                        {deleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
                    </Button>
                </DialogActions>
            </Dialog>

            <TopSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Box >
    );
}
