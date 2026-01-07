'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    Stack,
    Avatar,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import { SearchNormal1, Send2, Calendar, Location, User, Message, TickCircle, Image, CloseCircle } from 'iconsax-react';

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
    };
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'แบบร่าง', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
    confirmed: { label: 'ยืนยันแล้ว', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    completed: { label: 'เสร็จสิ้น', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    cancelled: { label: 'ยกเลิก', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

const updateTypes = [
    { value: 'status', label: 'อัพเดทสถานะ', icon: TickCircle },
    { value: 'text', label: 'ส่งข้อความ', icon: Message },
    { value: 'image', label: 'ส่งรูปภาพ', icon: Image },
];

export default function ProgressPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Send Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [updateType, setUpdateType] = useState('status');
    const [message, setMessage] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [sending, setSending] = useState(false);

    // Snackbar
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

    function filterEvents() {
        let result = events;

        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.eventName.toLowerCase().includes(searchLower) ||
                    e.customer.displayName?.toLowerCase().includes(searchLower)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter((e) => e.status === statusFilter);
        }

        setFilteredEvents(result);
    }

    function openSendDialog(event: Event) {
        setSelectedEvent(event);
        setUpdateType('status');
        setMessage('');
        setNewStatus('');
        setImageUrl('');
        setDialogOpen(true);
    }

    async function handleSend() {
        if (!selectedEvent) return;

        setSending(true);
        try {
            let body: any = {
                customerId: selectedEvent.customer.id,
            };

            if (updateType === 'status') {
                body = {
                    ...body,
                    type: 'status',
                    eventName: selectedEvent.eventName,
                    status: newStatus,
                    message: message || undefined,
                };
            } else if (updateType === 'text') {
                body = {
                    ...body,
                    type: 'text',
                    text: message,
                };
            } else if (updateType === 'image') {
                body = {
                    ...body,
                    type: 'image',
                    imageUrl,
                    previewUrl: imageUrl,
                };
            }

            const res = await fetch('/api/line/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setSnackbar({ open: true, message: 'ส่งข้อความสำเร็จ!', severity: 'success' });
                setDialogOpen(false);
            } else {
                const data = await res.json();
                setSnackbar({ open: true, message: `เกิดข้อผิดพลาด: ${data.error}`, severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการส่งข้อความ', severity: 'error' });
        } finally {
            setSending(false);
        }
    }

    function canSend(): boolean {
        if (updateType === 'status') return !!newStatus;
        if (updateType === 'text') return !!message.trim();
        if (updateType === 'image') return !!imageUrl.trim();
        return false;
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
                    📤 ส่งความคืบหน้าให้ลูกค้า
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                    เลือกงานและส่งอัพเดทความคืบหน้าผ่าน LINE
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
                                placeholder="ค้นหาชื่องาน หรือชื่อลูกค้า..."
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

            {/* Events List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : filteredEvents.length === 0 ? (
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                        ไม่พบงานที่ตรงกับการค้นหา
                    </Typography>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {filteredEvents.map((event) => (
                        <Box key={event.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(33.333% - 11px)' } }}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Customer Info */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar
                                            src={event.customer.pictureUrl || undefined}
                                            sx={{ width: 45, height: 45 }}
                                        >
                                            <User size={20} />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {event.customer.displayName || 'ไม่ระบุชื่อ'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: 'gray' }}>
                                                LINE User
                                            </Typography>
                                        </Box>
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
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Event Info */}
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            mb: 1.5,
                                            color: '#1a1a1a',
                                        }}
                                    >
                                        {event.eventName}
                                    </Typography>

                                    <Stack spacing={1} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Calendar size={16} color="gray" variant="Bold" />
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', color: 'gray' }}>
                                                {event.eventDate
                                                    ? new Date(event.eventDate).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : 'ยังไม่กำหนดวัน'}
                                            </Typography>
                                        </Box>
                                        {event.venue && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Location size={16} color="gray" variant="Bold" />
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.8rem',
                                                        color: 'gray',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {event.venue}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>

                                    {/* Action Button */}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<Send2 size={18} />}
                                        onClick={() => openSendDialog(event)}
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            bgcolor: 'var(--primary)',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                bgcolor: '#0d7472',
                                                boxShadow: '0 4px 15px rgba(10, 92, 90, 0.3)',
                                            },
                                        }}
                                    >
                                        ส่งอัพเดท
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Send Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                            📤 ส่งอัพเดทให้ลูกค้า
                        </Typography>
                        <IconButton onClick={() => setDialogOpen(false)} size="small">
                            <CloseCircle size={22} />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {selectedEvent && (
                        <Box>
                            {/* Selected Event Info */}
                            <Card sx={{ bgcolor: 'rgba(10, 92, 90, 0.05)', mb: 3, borderRadius: 2 }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={selectedEvent.customer.pictureUrl || undefined}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '0.9rem' }}
                                            >
                                                {selectedEvent.customer.displayName}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.8rem', color: 'gray' }}>
                                                {selectedEvent.eventName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Update Type Selection */}
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                                ประเภทการอัพเดท
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                                {updateTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = updateType === type.value;
                                    return (
                                        <Chip
                                            key={type.value}
                                            icon={<Icon size={16} variant={isSelected ? 'Bold' : 'Outline'} />}
                                            label={type.label}
                                            onClick={() => setUpdateType(type.value)}
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                bgcolor: isSelected ? 'var(--primary)' : 'transparent',
                                                color: isSelected ? '#fff' : 'gray',
                                                border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.1)'}`,
                                                '&:hover': {
                                                    bgcolor: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </Stack>

                            {/* Form Fields */}
                            {updateType === 'status' && (
                                <>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะใหม่</InputLabel>
                                        <Select
                                            value={newStatus}
                                            label="สถานะใหม่"
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                        >
                                            <MenuItem value="confirmed">✅ ยืนยันแล้ว</MenuItem>
                                            <MenuItem value="in-progress">🔄 กำลังดำเนินการ</MenuItem>
                                            <MenuItem value="completed">🎉 เสร็จสิ้น</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="ข้อความเพิ่มเติม (ไม่บังคับ)"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="เช่น ทีมงานเริ่มติดตั้งอุปกรณ์แล้ว..."
                                        InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                        InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                </>
                            )}

                            {updateType === 'text' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="ข้อความ"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="พิมพ์ข้อความที่ต้องการส่ง..."
                                    InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                    InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                />
                            )}

                            {updateType === 'image' && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="URL รูปภาพ"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                        InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                        sx={{ mb: 2 }}
                                    />
                                    {imageUrl && (
                                        <Box
                                            sx={{
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </Box>
                                    )}
                                </>
                            )}

                            {/* Preview */}
                            {(updateType === 'status' && newStatus) || (updateType === 'text' && message) ? (
                                <Box sx={{ mt: 3, p: 2, bgcolor: '#E7F8E9', borderRadius: 2, border: '1px solid #C6F0C9' }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: 'gray', mb: 1 }}>
                                        💬 Preview ข้อความที่จะส่ง
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', whiteSpace: 'pre-line' }}>
                                        {updateType === 'status' ? (
                                            <>
                                                {newStatus === 'confirmed' && '✅ ยืนยันการจองแล้ว'}
                                                {newStatus === 'in-progress' && '🔄 กำลังดำเนินการ'}
                                                {newStatus === 'completed' && '🎉 งานเสร็จสิ้น'}
                                                {'\n\n📋 งาน: '}
                                                {selectedEvent.eventName}
                                                {message && `\n\n${message}`}
                                            </>
                                        ) : (
                                            message
                                        )}
                                    </Typography>
                                </Box>
                            ) : null}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2.5, pt: 0 }}>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            color: 'gray',
                            textTransform: 'none',
                        }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Send2 size={18} />}
                        onClick={handleSend}
                        disabled={!canSend() || sending}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            bgcolor: 'var(--primary)',
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#0d7472',
                            },
                        }}
                    >
                        ส่งข้อความ
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ fontFamily: 'var(--font-prompt)' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
