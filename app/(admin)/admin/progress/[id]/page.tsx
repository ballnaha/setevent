'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
    Slider,
    Divider,
    Avatar,
    Stack,
    Chip,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme,
    Paper,
    Collapse,
    Menu
} from '@mui/material';
import { ArrowLeft, Trash, Image as ImageIcon, FolderOpen, User, Location, Calendar, Add, Minus, TickCircle, ArrowDown2 } from 'iconsax-react';
import TopSnackbar from '@/components/ui/TopSnackbar';

// Status Configuration
const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    completed: { label: 'ปิดงาน', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    cancelled: { label: 'ยกเลิก', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

function CollapsibleSection({ title, children, defaultExpanded = true }: { title: string, children: React.ReactNode, defaultExpanded?: boolean }) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    return (
        <Box sx={{ mb: 2 }}>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mb: 2 }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography variant="h6" sx={{ color: '#002e7b', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-prompt)' }}>{title}</Typography>
                {expanded ? <Minus size="20" color="#aaa" /> : <Add size="20" color="#aaa" />}
            </Box>
            <Collapse in={expanded}>
                <Box>
                    {children}
                </Box>
            </Collapse>
            <Divider sx={{ mt: 2, borderColor: '#f5f5f5' }} />
        </Box>
    )
}

function StatusFlexPreview({ eventName, status, message, imageUrls, progress, senderName, venue, eventDate }: { eventName: string, status: string, message: string, imageUrls: string[], progress?: number, senderName?: string, venue?: string, eventDate?: string }) {
    const config = statusLabels[status] || statusLabels['in-progress'];

    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: '2-digit' });
    const timeStr = now.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' });

    // Format event date for preview
    let formattedEventDate = eventDate;
    if (eventDate) {
        try {
            const d = new Date(eventDate);
            if (!isNaN(d.getTime())) {
                formattedEventDate = d.toLocaleDateString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric' });
                const timePart = d.toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' });
                if (timePart !== '00:00') {
                    formattedEventDate += ` ${timePart}`;
                }
            }
        } catch (e) { }
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 350, mx: 'auto', pointerEvents: 'none', fontFamily: 'var(--font-prompt)' }}>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 2 }}>
                {/* 1. Color Bar at Top */}
                <Box sx={{ height: 6, bgcolor: config.color }} />

                {/* 2. Main Content Area */}
                <Box sx={{ p: '20px' }}>
                    {/* Header Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography sx={{ color: config.color, fontWeight: 'bold', fontSize: '0.65rem', textTransform: 'uppercase' }}>{config.label}</Typography>
                        <Typography sx={{ color: '#bbb', fontSize: '0.65rem' }}>{dateStr} {timeStr}</Typography>
                    </Box>

                    {/* Title */}
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1a1a1a', mb: 2, lineHeight: 1.3 }}>{eventName}</Typography>

                    {/* Details section (Date, Venue) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, bgcolor: '#f9fafb', p: 1.5, borderRadius: 2 }}>
                        {formattedEventDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Calendar size="16" color="#666" variant="Bold" />
                                <Typography sx={{ fontSize: '0.75rem', color: '#444' }}>{formattedEventDate}</Typography>
                            </Box>
                        )}
                        {venue && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Location size="16" color="#666" variant="Bold" />
                                <Typography sx={{ fontSize: '0.75rem', color: '#444' }}>{venue}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Progress */}
                    {progress !== undefined && (
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 'bold' }}>Progress</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: progress === 100 ? '#10B981' : config.color, fontWeight: 'bold' }}>{progress}%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 6, bgcolor: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: progress === 100 ? '#10B981' : config.color, borderRadius: 3 }} />
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ my: 2, borderColor: '#f0f0f0' }} />

                    {/* Message */}
                    {message && (
                        <Typography sx={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.6, mb: imageUrls.length > 0 ? 2 : 0 }}>{message}</Typography>
                    )}

                    {/* Images Grid */}
                    {imageUrls.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                            {imageUrls.map((url, i) => (
                                <Box key={i} sx={{ position: 'relative', paddingTop: '75%', borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                                    <img src={url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Footer */}
                    {senderName && (
                        <Typography sx={{ fontSize: '0.6rem', color: '#ccc', textAlign: 'center', mt: 3 }}>
                            Updated by {senderName}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [event, setEvent] = useState<any>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [chatLogs, setChatLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [sendMode, setSendMode] = useState<'status' | 'chat'>('status'); // 'status' or 'chat'
    const [newStatus, setNewStatus] = useState('in-progress');
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [selectedImages, setSelectedImages] = useState<{ file: File, url: string }[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<{ file: File, name: string, size: number }[]>([]);
    const [sending, setSending] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });
    const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);

    useEffect(() => {
        fetchEventDetails();
    }, []);

    async function fetchEventDetails() {
        try {
            const res = await fetch(`/api/admin/events/${id}`);
            const data = await res.json();
            if (data.event) {
                setEvent(data.event);
                setChatLogs(data.chatLogs || []);
                setNewStatus(data.event.status === 'confirmed' || data.event.status === 'draft' ? 'in-progress' : data.event.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;
        const files = Array.from(e.target.files);

        // Client-side validation (e.g. max 5 images total)
        if (selectedImages.length + files.length > 5) {
            setSnackbar({ open: true, message: 'สามารถเลือกรูปภาพได้สูงสุด 5 รูป', severity: 'error' });
            return;
        }

        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
        e.target.value = ''; // Reset input
    }

    function handleRemoveImage(index: number) {
        setSelectedImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].url); // Cleanup memory
            newImages.splice(index, 1);
            return newImages;
        });
    }

    // Work File Handlers
    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;
        const files = Array.from(e.target.files);

        if (selectedFiles.length + files.length > 5) {
            setSnackbar({ open: true, message: 'สามารถเลือกไฟล์งานได้สูงสุด 5 ไฟล์', severity: 'error' });
            return;
        }

        const newFiles = files.map(file => ({
            file,
            name: file.name,
            size: file.size
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    }

    function handleRemoveFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }


    function handleSendClick() {
        // Validate: MUST have a message
        if (!message.trim()) {
            setSnackbar({ open: true, message: 'กรุณาใส่ข้อความ', severity: 'error' });
            return;
        }

        setConfirmDialogOpen(true);
    }

    async function executeSend() {
        if (!event) return;

        // Only set sending true here if we are NOT skipping dialog (or we handle it)
        // But since executeSend does async work, it's fine.
        setSending(true);
        setConfirmDialogOpen(false);

        try {
            // 0. Update Status in DB (If Status Mode)
            if (sendMode === 'status') {
                const res = await fetch(`/api/admin/events/${event.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (!res.ok) throw new Error('Failed to update status');
            }

            // 1. Upload Images
            let finalImageUrls: string[] = [];
            if (selectedImages.length > 0) {
                const uploadPromises = selectedImages.map(async (img) => {
                    const formData = new FormData();
                    formData.append('file', img.file);
                    formData.append('eventId', event.id); // For folder organization
                    formData.append('type', 'image');

                    const res = await fetch('/api/upload/files', { method: 'POST', body: formData });
                    const data = await res.json();
                    if (!data.success) throw new Error(data.error || 'Failed to upload image');
                    return `${window.location.origin}${data.url}`;
                });
                finalImageUrls = await Promise.all(uploadPromises);
            }

            // 2. Upload Work Files
            let finalFiles: { name: string, url: string, size: number }[] = [];
            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(async (f) => {
                    const formData = new FormData();
                    formData.append('file', f.file);
                    formData.append('eventId', event.id);
                    formData.append('type', 'file');

                    const res = await fetch('/api/upload/files', { method: 'POST', body: formData });
                    const data = await res.json();
                    if (!data.success) throw new Error(data.error || 'Failed to upload file');
                    return {
                        name: data.originalName,
                        url: `${window.location.origin}${data.url}`,
                        size: data.size
                    };
                });
                finalFiles = await Promise.all(uploadPromises);
            }

            // 3. Send LINE Message
            let body: any;

            if (sendMode === 'status') {
                body = {
                    customerId: event.customerId,
                    eventId: event.id,
                    type: 'status',
                    eventName: event.eventName,
                    status: newStatus,
                    message: message || undefined,
                    progress: newStatus === 'in-progress' && progress > 0 ? progress : undefined,
                    imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
                    files: finalFiles.length > 0 ? finalFiles : undefined,
                    senderName: session?.user?.name || 'Admin',
                    venue: event.venue, // Pass venue
                    eventDate: event.eventDate // Pass eventDate
                };
            } else {
                // Chat mode - plain text message
                body = {
                    customerId: event.customerId,
                    eventId: event.id,
                    type: 'chat',
                    message: message || undefined,
                    imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
                    files: finalFiles.length > 0 ? finalFiles : undefined,
                    senderName: session?.user?.name || 'Admin',
                    venue: event.venue, // Venue context
                    eventDate: event.eventDate // Date context
                };
            }

            const res = await fetch('/api/line/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });


            if (res.ok) {
                setSnackbar({ open: true, message: 'ส่งอัพเดทเรียบร้อยแล้ว', severity: 'success' });
                fetchEventDetails(); // Refresh history
                setMessage('');
                setSelectedImages([]);
                setSelectedFiles([]);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send LINE message');
            }
        } catch (error: any) {
            console.warn('Send warning:', error);
            setSnackbar({ open: true, message: error.message || 'เกิดข้อผิดพลาดในการส่ง', severity: 'error' });
        } finally {
            setSending(false);
        }
    }

    if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (!event) return <Box sx={{ p: 4 }}>Event not found</Box>;

    return (
        <Box sx={{ pb: 12 }}>
            {/* Header */}
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <IconButton onClick={() => router.back()} sx={{ mr: 1, ml: -1 }}>
                        <ArrowLeft />
                    </IconButton>
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' }, lineHeight: 1.3 }}>
                            {event.eventName}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, mt: 1.5, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <User size={18} color="#666" />
                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#444' }}>
                                    {event.customer?.displayName} {event.customer?.companyName && <span style={{ opacity: 0.7 }}>({event.customer.companyName})</span>}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Location size={18} color="#666" />
                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#444' }}>
                                    {event.venue || '-'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Calendar size={18} color="#666" />
                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#444' }}>
                                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                </Typography>
                            </Box>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">

                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Chip
                                    label={statusLabels[event.status]?.label || event.status}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        bgcolor: statusLabels[event.status]?.bgColor,
                                        color: statusLabels[event.status]?.color,
                                        fontWeight: 'bold',
                                        fontFamily: 'var(--font-prompt)'
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Chip
                            label={statusLabels[event.status]?.label || event.status}
                            sx={{
                                bgcolor: statusLabels[event.status]?.bgColor,
                                color: statusLabels[event.status]?.color,
                                fontWeight: 'bold',
                                fontFamily: 'var(--font-prompt)'
                            }}
                        />
                    </Box>
                </Box>
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Form Column */}
                <Box sx={{ flex: { xs: '1 1 100%', md: 7 }, minWidth: 0 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 3 }}>
                        <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
                            {/* Custom Tab Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2, md: 4 }, px: 0.5, borderBottom: '1px solid #f0f0f0', height: '56px' }}>
                                <IconButton onClick={() => router.back()} size="small" sx={{ color: '#333' }}>
                                    <ArrowLeft size="24" />
                                </IconButton>

                                <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, height: '100%' }}>
                                    <Box
                                        onClick={() => setSendMode('status')}
                                        sx={{
                                            cursor: 'pointer',
                                            fontWeight: sendMode === 'status' ? 700 : 500,
                                            color: sendMode === 'status' ? '#1a1a1a' : '#aaa',
                                            position: 'relative',
                                            fontSize: { xs: '0.9rem', md: '1rem' },
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'all 0.3s',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: sendMode === 'status' ? '100%' : '0%',
                                                height: 3,
                                                bgcolor: '#1a1a1a',
                                                borderRadius: '10px 10px 0 0',
                                                transition: 'all 0.3s'
                                            }
                                        }}
                                    >
                                        Update Status
                                    </Box>
                                    <Box
                                        onClick={() => setSendMode('chat')}
                                        sx={{
                                            cursor: 'pointer',
                                            fontWeight: sendMode === 'chat' ? 700 : 500,
                                            color: sendMode === 'chat' ? '#1a1a1a' : '#aaa',
                                            position: 'relative',
                                            fontSize: { xs: '0.9rem', md: '1rem' },
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'all 0.3s',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: sendMode === 'chat' ? '100%' : '0%',
                                                height: 3,
                                                bgcolor: '#1a1a1a',
                                                borderRadius: '10px 10px 0 0',
                                                transition: 'all 0.3s'
                                            }
                                        }}
                                    >
                                        Chat
                                    </Box>
                                </Box>

                                <Box sx={{ width: 24 }} /> {/* Spacer to balance Back button */}
                            </Box>

                            {/* Section: Status & Progress */}
                            {sendMode === 'status' && (
                                <CollapsibleSection title="Status & Progress">
                                    <Box sx={{ mb: 4 }}>
                                        {/* Status Select as Chips/Cards */}
                                        <Box sx={{ display: 'flex', gap: 1.5, mb: 4, overflowX: 'auto', p: 1, '::-webkit-scrollbar': { display: 'none' } }}>
                                            {Object.entries(statusLabels).filter(([k]) => k === 'in-progress' || k === 'draft').map(([key, val]) => {
                                                const isSelected = newStatus === key;
                                                return (
                                                    <Box
                                                        key={key}
                                                        onClick={() => setNewStatus(key)}
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: { xs: 1.5, md: 2.5 },
                                                            py: 1.5,
                                                            borderRadius: 2,
                                                            bgcolor: isSelected ? val.bgColor : '#f9f9f9',
                                                            border: `1px solid ${isSelected ? val.color : '#eee'}`,
                                                            color: isSelected ? val.color : '#888',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            transition: 'all 0.2s',
                                                            boxShadow: isSelected ? `0 4px 12px ${val.bgColor}` : 'none',
                                                            '&:hover': { transform: 'translateY(-2px)' }
                                                        }}
                                                    >
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: val.color }} />
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-prompt)' }}>{val.label}</Typography>
                                                    </Box>
                                                );
                                            })}

                                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                                            {/* Critical Statuses - Dropdown Menu Trigger */}
                                            <Box
                                                onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    px: { xs: 1.5, md: 2 },
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: (newStatus === 'completed' || newStatus === 'cancelled') ? statusLabels[newStatus]?.bgColor : '#fff',
                                                    border: (newStatus === 'completed' || newStatus === 'cancelled') ? `1px solid ${statusLabels[newStatus]?.color}` : '1px dashed #ccc',
                                                    color: (newStatus === 'completed' || newStatus === 'cancelled') ? statusLabels[newStatus]?.color : '#666',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#bbb' }
                                                }}
                                            >
                                                {(newStatus === 'completed' || newStatus === 'cancelled') ? (
                                                    <>
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusLabels[newStatus]?.color }} />
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-prompt)' }}>{statusLabels[newStatus]?.label}</Typography>
                                                    </>
                                                ) : (
                                                    <Typography sx={{ fontWeight: 500, fontSize: '0.8rem', fontFamily: 'var(--font-prompt)' }}>เปลี่ยนสถานะ...</Typography>
                                                )}
                                                <ArrowDown2 size="16" color="currentColor" />
                                            </Box>

                                            <Menu
                                                anchorEl={statusMenuAnchor}
                                                open={Boolean(statusMenuAnchor)}
                                                onClose={() => setStatusMenuAnchor(null)}
                                                PaperProps={{
                                                    sx: {
                                                        mt: 1,
                                                        borderRadius: 2,
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                        minWidth: 160
                                                    }
                                                }}
                                            >
                                                {Object.entries(statusLabels).filter(([k]) => k === 'completed' || k === 'cancelled').map(([key, val]) => (
                                                    <MenuItem
                                                        key={key}
                                                        onClick={() => { setNewStatus(key); setStatusMenuAnchor(null); }}
                                                        sx={{ fontFamily: 'var(--font-prompt)', gap: 1.5, py: 1.5 }}
                                                    >
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: val.color }} />
                                                        {val.label}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Box>

                                        {/* Progress Slider */}
                                        {newStatus === 'in-progress' && (
                                            <Box sx={{ px: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>Progress</Typography>
                                                    <Typography sx={{ fontWeight: 700, color: 'var(--primary)' }}>{progress}%</Typography>
                                                </Box>
                                                <Slider
                                                    value={progress}
                                                    onChange={(_, val) => setProgress(val as number)}
                                                    valueLabelDisplay="off"
                                                    step={10}
                                                    min={0}
                                                    max={100}
                                                    sx={{
                                                        color: 'var(--primary)',
                                                        height: 6,
                                                        '& .MuiSlider-thumb': {
                                                            width: 20,
                                                            height: 20,
                                                            bgcolor: 'white',
                                                            border: '3px solid currentColor',
                                                            '&:focus, &:hover, &.Mui-active': {
                                                                boxShadow: '0 0 0 8px rgba(0, 194, 203, 0.16)',
                                                            },
                                                        },
                                                        '& .MuiSlider-rail': {
                                                            bgcolor: '#e0e0e0',
                                                            opacity: 1
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </CollapsibleSection>
                            )}

                            {/* Section: Attachments (Facilities Style) */}
                            <CollapsibleSection title="Media & Files">
                                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                                    {/* Upload Buttons */}
                                    <Button
                                        component="label"
                                        disabled={sending}
                                        sx={{
                                            minWidth: 80,
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2.5,
                                            bgcolor: '#f5f7ff',
                                            border: '1px dashed #ced4da',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.5,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: '#eff2fe', borderColor: 'var(--primary)' }
                                        }}
                                    >
                                        <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                                        <ImageIcon size="24" color="var(--primary)" variant="Bold" />
                                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>Image</Typography>
                                    </Button>

                                    <Button
                                        component="label"
                                        disabled={sending}
                                        sx={{
                                            minWidth: 80,
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2.5,
                                            bgcolor: '#fff7ed',
                                            border: '1px dashed #ced4da',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.5,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: '#ffedd5', borderColor: '#f97316' }
                                        }}
                                    >
                                        <input type="file" hidden multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} />
                                        <FolderOpen size="24" color="#f97316" variant="Bold" />
                                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>File</Typography>
                                    </Button>

                                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                                    {/* Previews (Facilities Badges Style) */}
                                    {selectedImages.map((img, index) => (
                                        <Box key={`img-${index}`} sx={{ position: 'relative', minWidth: 80, width: 80, height: 80 }}>
                                            <img
                                                src={img.url}
                                                alt="preview"
                                                style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }}
                                            />
                                            <Box
                                                onClick={() => handleRemoveImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    width: 20,
                                                    height: 20,
                                                    bgcolor: '#ef4444',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                <Minus size="12" color="white" />
                                            </Box>
                                        </Box>
                                    ))}

                                    {selectedFiles.map((file, index) => (
                                        <Box key={`file-${index}`} sx={{
                                            position: 'relative',
                                            minWidth: 80,
                                            width: 80,
                                            height: 80,
                                            borderRadius: 2.5,
                                            bgcolor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 1
                                        }}>
                                            <FolderOpen size="24" color="#64748b" variant="Bulk" />
                                            <Typography variant="caption" noWrap sx={{ width: '100%', textAlign: 'center', mt: 0.5, fontSize: '0.6rem' }}>
                                                {file.name}
                                            </Typography>
                                            <Box
                                                onClick={() => handleRemoveFile(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    width: 20,
                                                    height: 20,
                                                    bgcolor: '#ef4444',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                <Minus size="12" color="white" />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CollapsibleSection>

                            {/* Section: Message (Property Type style) */}
                            <CollapsibleSection title="Message">
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    placeholder="เขียนข้อความถึงลูกค้า..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            bgcolor: '#f9f9f9',
                                            '& fieldset': { borderColor: 'transparent' },
                                            '&:hover fieldset': { borderColor: '#eee' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                                        },
                                        fontFamily: 'var(--font-prompt)'
                                    }}
                                />
                            </CollapsibleSection>

                            {/* Preview Section */}
                            {sendMode === 'status' && (
                                <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed #eee' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Preview</Typography>
                                    </Box>
                                    <Box sx={{ transform: 'scale(0.95)', transformOrigin: 'top center' }}>
                                        <StatusFlexPreview
                                            eventName={event.eventName}
                                            status={newStatus}
                                            message={message}
                                            progress={newStatus === 'in-progress' ? progress : undefined}
                                            imageUrls={selectedImages.map(img => img.url)}
                                            senderName={session?.user?.name || 'Admin'}
                                            venue={event.venue}
                                            eventDate={event.eventDate}
                                        />
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ height: 60 }} /> {/* Spacer for floating footer */}
                        </CardContent>
                    </Card>
                </Box>

                {/* History Column */}
                <Box sx={{ flex: { xs: '1 1 100%', md: 5 }, minWidth: 0 }}>
                    <Card sx={{ borderRadius: 3, height: { xs: '600px', md: '100%' }, maxHeight: 800, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid #eee' }}>
                                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>🕰️ ประวัติการส่งข้อความ</Typography>
                            </Box>

                            <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 }, scrollBehavior: 'smooth' }}>
                                <Stack spacing={3}>
                                    {chatLogs.map((log) => {
                                        let content;
                                        try {
                                            content = JSON.parse(log.message);
                                        } catch {
                                            content = { type: 'text', text: log.message };
                                        }

                                        return (
                                            <Box key={log.id} sx={{ display: 'flex', gap: 2 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: log.direction === 'outbound' ? 'var(--primary)' : '#ddd' }}>
                                                    {log.direction === 'outbound' ? 'A' : 'C'}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(log.createdAt).toLocaleString('th-TH')}
                                                        </Typography>
                                                        <Chip label={content.type} size="small" sx={{ height: 20, fontSize: '0.6rem' }} />
                                                    </Box>
                                                    <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 2 }}>
                                                        {content.type === 'status' && (
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: statusLabels[content.status]?.color }}>
                                                                    สถานะ: {statusLabels[content.status]?.label}
                                                                </Typography>
                                                                {content.message && <Typography variant="body2">{content.message}</Typography>}
                                                                {content.progress > 0 && <Typography variant="caption">Progress: {content.progress}%</Typography>}
                                                                {content.imageUrls?.length > 0 && (
                                                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                                                                        {content.imageUrls.map((u: string, i: number) => (
                                                                            <img key={i} src={u} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}
                                                        {content.type === 'chat' && (
                                                            <Box>
                                                                {content.message && <Typography variant="body2">{content.message}</Typography>}
                                                                {content.imageUrls?.length > 0 && (
                                                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                                                        {content.imageUrls.map((u: string, i: number) => (
                                                                            <img key={i} src={u} style={{ width: 60, height: 60, borderRadius: 4, objectFit: 'cover' }} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                                {content.files?.length > 0 && (
                                                                    <Box sx={{ mt: 1 }}>
                                                                        {content.files.map((f: { name: string, url: string }, i: number) => (
                                                                            <Typography key={i} variant="caption" sx={{ display: 'block', color: '#666' }}>
                                                                                📄 {f.name}
                                                                            </Typography>
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}
                                                        {content.type === 'text' && <Typography variant="body2">{content.text}</Typography>}
                                                        {content.type === 'image' && (
                                                            <Box>
                                                                <img src={content.imageUrl || content.imageUrls?.[0]} style={{ maxWidth: '100%', borderRadius: 8 }} />
                                                            </Box>
                                                        )}

                                                        {/* Sender Name */}
                                                        {content.senderName && (
                                                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: '#aaa', mt: 1, fontSize: '0.65rem' }}>
                                                                — {content.senderName}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    {chatLogs.length === 0 && (
                                        <Typography sx={{ textAlign: 'center', color: '#aaa', py: 4 }}>ยังไม่มีประวัติการส่งข้อความ</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            <TopSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity as any}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />

            {/* Sticky Action Footer */}
            <Paper
                elevation={0}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: { xs: 0, md: 260 }, // 260 is drawerWidth
                    right: 0,
                    p: 2,
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    zIndex: 1250, // Layering: BottomNav(1200) < Footer(1250) < Sidebar(1300)
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    disabled={sending}
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        borderRadius: 2,
                        minWidth: 100,
                        height: 48,
                        color: '#666',
                        borderColor: '#eee',
                        bgcolor: '#fff',
                        '&:hover': {
                            bgcolor: '#f9f9f9',
                            borderColor: '#ddd'
                        }
                    }}
                >
                    ย้อนกลับ
                </Button>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: { xs: 1, md: 'initial' } }}>
                    <Button
                        variant="contained"
                        onClick={handleSendClick}
                        disabled={sending}

                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 3,
                            px: 4,
                            height: 56,
                            minWidth: { xs: 0, md: 200 },
                            width: '100%',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            bgcolor: '#10B981',
                            color: '#fff',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                bgcolor: '#059669',
                                boxShadow: '0 12px 24px rgba(16, 185, 129, 0.5)',
                                transform: 'translateY(-2px)'
                            },
                        }}
                    >
                        {sending ? 'กำลังบันทึก...' : sendMode === 'status' ? 'บันทึกและส่งอัพเดท' : 'ส่งข้อความ'}
                    </Button>
                </Box>
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: { borderRadius: isMobile ? 0 : 3 }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                    ยืนยันการส่งอัพเดท
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', mb: 2, color: '#666' }}>
                        กรุณาตรวจสอบรายละเอียดก่อนส่ง ข้อความนี้จะถูกส่งไปยังลูกค้าทาง LINE ทันที
                    </Typography>

                    <Box sx={{ bgcolor: '#f0f0f0', p: 3, borderRadius: 3, display: 'flex', justifyContent: 'center' }}>
                        <StatusFlexPreview
                            eventName={event.eventName}
                            status={sendMode === 'status' ? newStatus : event.status}
                            message={message}
                            progress={sendMode === 'status' && newStatus === 'in-progress' ? progress : undefined}
                            imageUrls={selectedImages.map(img => img.url)}
                            senderName={session?.user?.name || 'Admin'}
                            venue={event.venue}
                            eventDate={event.eventDate}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            borderRadius: 2,
                            height: 48,
                            minWidth: 120,
                            fontSize: '1rem',
                            borderColor: '#ddd',
                            color: '#666',
                            flex: 1
                        }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={executeSend}
                        autoFocus
                        disabled={sending}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: '#10B981',
                            color: '#fff',
                            borderRadius: 2,
                            height: 48,
                            minWidth: 140,
                            flex: 1,
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                            '&:hover': {
                                bgcolor: '#059669',
                                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                            }
                        }}
                    >
                        {sending ? 'กำลังส่ง...' : 'ยืนยันและส่ง'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
