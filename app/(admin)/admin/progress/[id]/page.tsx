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
import { ArrowLeft, Trash, Image as ImageIcon, FolderOpen, User, Location, Calendar, Add, Minus, TickCircle, ArrowDown2, Instagram, Setting2, CloseCircle, MessageText, Chart, DirectRight, Flash, Play, StatusUp, Cup } from 'iconsax-react';
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
            }
        } catch (e) { }
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 350, mx: 'auto', pointerEvents: 'none', fontFamily: 'var(--font-prompt)' }}>
            <Box sx={{ border: 'none', borderRadius: 3, overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 12px 24px -4px rgba(0,0,0,0.1)', mb: 2 }}>
                {/* 1. Header Line */}
                <Box sx={{ height: 6, bgcolor: config.color }} />

                <Box sx={{ p: 3 }}>
                    {/* Top Row: Badge & Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        {/* Status Badge */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            bgcolor: config.color,
                            color: '#fff',
                            pl: 1.5,
                            pr: 2,
                            py: 0.75,
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            transform: 'translateY(-5px)' // Slight lift for "floating" effect
                        }}>
                            {status === 'completed' ? <TickCircle size="16" variant="Bold" color="#fff" /> :
                                (status === 'cancelled' ? <CloseCircle size="16" variant="Bold" color="#fff" /> :
                                    <StatusUp size="16" variant="Bold" color="#fff" />)}
                            {config.label}
                        </Box>

                        <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500, pt: 0.5 }}>
                            {dateStr} {timeStr}
                        </Typography>
                    </Box>

                    {/* Title */}
                    <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b', mb: 2.5, lineHeight: 1.3 }}>
                        {eventName}
                    </Typography>

                    {/* Meta Box */}
                    <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Calendar size="20" color="#64748b" variant="Bold" />
                            <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{formattedEventDate || 'ไม่ระบุวันที่'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Location size="20" color="#64748b" variant="Bold" />
                            <Typography sx={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{venue || 'ไม่ระบุสถานที่'}</Typography>
                        </Box>
                    </Box>

                    {/* Progress Section */}
                    {progress !== undefined && (
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-end' }}>
                                <Typography sx={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Progress</Typography>
                                <Typography sx={{ fontSize: '1.1rem', color: config.color, fontWeight: 800 }}>{progress}%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 10, bgcolor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                                <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: config.color, borderRadius: 5, boxShadow: `0 0 10px ${config.bgColor}` }} />
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ borderStyle: 'dashed', borderColor: '#e2e8f0', mb: 2.5 }} />

                    {/* Message & Content */}
                    {message && (
                        <Typography sx={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, mb: imageUrls.length > 0 ? 2 : 0 }}>{message}</Typography>
                    )}

                    {imageUrls.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, mt: 2 }}>
                            {imageUrls.map((url, i) => (
                                <Box key={i} sx={{ position: 'relative', paddingTop: '75%', borderRadius: 2, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                    <img src={url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Footer */}
                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', mt: 3, fontWeight: 500 }}>
                        Updated by {senderName}
                    </Typography>
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
    const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
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

                            {/* Custom Tab Header - Segmented Pill Style */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 3, md: 4 } }}>

                                <Box sx={{
                                    display: 'flex',
                                    p: 0.5,
                                    bgcolor: '#f1f5f9',
                                    borderRadius: 3,
                                    gap: 0.5
                                }}>
                                    <Box
                                        onClick={() => setSendMode('status')}
                                        sx={{
                                            px: 3,
                                            py: 0.85,
                                            borderRadius: 2.5,
                                            cursor: 'pointer',
                                            bgcolor: sendMode === 'status' ? '#fff' : 'transparent',
                                            color: sendMode === 'status' ? '#0f172a' : '#64748b',
                                            fontWeight: sendMode === 'status' ? 600 : 500,
                                            fontSize: '0.9rem',
                                            fontFamily: 'var(--font-prompt)',
                                            boxShadow: sendMode === 'status' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.2s ease-in-out',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            '&:hover': {
                                                color: '#0f172a'
                                            }
                                        }}
                                    >
                                        <Setting2 size="16" variant={sendMode === 'status' ? 'Bold' : 'Linear'} color="#0f172a" />
                                        อัพเดทสถานะ
                                    </Box>
                                    <Box
                                        onClick={() => setSendMode('chat')}
                                        sx={{
                                            px: 3,
                                            py: 0.85,
                                            borderRadius: 2.5,
                                            cursor: 'pointer',
                                            bgcolor: sendMode === 'chat' ? '#fff' : 'transparent',
                                            color: sendMode === 'chat' ? '#0f172a' : '#64748b',
                                            fontWeight: sendMode === 'chat' ? 600 : 500,
                                            fontSize: '0.9rem',
                                            fontFamily: 'var(--font-prompt)',
                                            boxShadow: sendMode === 'chat' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.2s ease-in-out',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            '&:hover': {
                                                color: '#0f172a'
                                            }
                                        }}
                                    >
                                        <MessageText size="16" variant={sendMode === 'chat' ? 'Bold' : 'Linear'} color="#0f172a" />
                                        แชท
                                    </Box>
                                </Box>

                                <Box sx={{ width: 36 }} /> {/* Spacer */}
                            </Box>

                            {/* Section: Status & Progress - Modern Card Design */}
                            {sendMode === 'status' && (
                                <CollapsibleSection title="สถานะงาน">
                                    <Box sx={{ mb: 3 }}>
                                        {/* Status Cards - Refined for Safety */}
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1.2fr 1fr 1fr', md: '1.2fr 1fr 1fr' },
                                            gap: 1.25,
                                            mb: 3
                                        }}>
                                            {/* In Progress Card - Main Choice */}
                                            <Box
                                                onClick={() => {
                                                    setNewStatus('in-progress');
                                                    setConfirmStatus(null);
                                                }}
                                                sx={{
                                                    p: { xs: 1.5, md: 2 },
                                                    borderRadius: 4,
                                                    bgcolor: '#fff',
                                                    border: newStatus === 'in-progress' ? '2px solid #f59e0b' : '1px solid #f1f5f9',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    boxShadow: newStatus === 'in-progress' ? '0 8px 20px rgba(245, 158, 11, 0.15)' : 'none',
                                                    '&:hover': { borderColor: '#f59e0b' }
                                                }}
                                            >
                                                <Box sx={{
                                                    p: 1.25,
                                                    borderRadius: '50%',
                                                    bgcolor: newStatus === 'in-progress' ? '#fffbeb' : '#f8fafc',
                                                }}>
                                                    <Setting2 size="24" variant={newStatus === 'in-progress' ? 'Bold' : 'Linear'} color={newStatus === 'in-progress' ? '#d97706' : '#cbd5e1'} />
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.8rem',
                                                    fontWeight: newStatus === 'in-progress' ? 700 : 500,
                                                    color: newStatus === 'in-progress' ? '#1e293b' : '#64748b',
                                                    textAlign: 'center',
                                                    fontFamily: 'var(--font-prompt)'
                                                }}>
                                                    กำลังดำเนินการ
                                                </Typography>
                                            </Box>

                                            {/* Completed Card - Simple Selection */}
                                            <Box
                                                onClick={() => {
                                                    setNewStatus('completed');
                                                    setConfirmStatus(null);
                                                }}
                                                sx={{
                                                    p: { xs: 1.25, md: 1.5 },
                                                    borderRadius: 4,
                                                    bgcolor: '#fff',
                                                    border: newStatus === 'completed' ? '2px solid #10b981' : '1px solid #f1f5f9',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    boxShadow: newStatus === 'completed' ? '0 8px 20px rgba(16, 185, 129, 0.15)' : 'none',
                                                    opacity: newStatus === 'completed' ? 1 : 0.8,
                                                    '&:hover': { borderColor: '#10b981', opacity: 1 }
                                                }}
                                            >
                                                <Box sx={{
                                                    p: 1,
                                                    borderRadius: '50%',
                                                    bgcolor: newStatus === 'completed' ? '#dcfce7' : '#f8fafc',
                                                }}>
                                                    <TickCircle size="22" variant={newStatus === 'completed' ? 'Bold' : 'Linear'} color={newStatus === 'completed' ? '#059669' : '#cbd5e1'} />
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: newStatus === 'completed' ? 700 : 500,
                                                    color: newStatus === 'completed' ? '#1e293b' : '#64748b',
                                                    textAlign: 'center',
                                                    fontFamily: 'var(--font-prompt)'
                                                }}>
                                                    ปิดงาน
                                                </Typography>
                                            </Box>

                                            {/* Cancelled Card - Simple Selection */}
                                            <Box
                                                onClick={() => {
                                                    setNewStatus('cancelled');
                                                    setConfirmStatus(null);
                                                }}
                                                sx={{
                                                    p: { xs: 1.25, md: 1.5 },
                                                    borderRadius: 4,
                                                    bgcolor: '#fff',
                                                    border: newStatus === 'cancelled' ? '2px solid #ef4444' : '1px solid #f1f5f9',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    boxShadow: newStatus === 'cancelled' ? '0 8px 20px rgba(239, 68, 68, 0.15)' : 'none',
                                                    opacity: newStatus === 'cancelled' ? 1 : 0.8,
                                                    '&:hover': { borderColor: '#ef4444', opacity: 1 }
                                                }}
                                            >
                                                <Box sx={{
                                                    p: 1,
                                                    borderRadius: '50%',
                                                    bgcolor: newStatus === 'cancelled' ? '#fee2e2' : '#f8fafc',
                                                }}>
                                                    <CloseCircle size="22" variant={newStatus === 'cancelled' ? 'Bold' : 'Linear'} color={newStatus === 'cancelled' ? '#dc2626' : '#cbd5e1'} />
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: newStatus === 'cancelled' ? 700 : 500,
                                                    color: newStatus === 'cancelled' ? '#1e293b' : '#64748b',
                                                    textAlign: 'center',
                                                    fontFamily: 'var(--font-prompt)'
                                                }}>
                                                    ยกเลิก
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Progress Selection - Easy Click Buttons for Mobile */}
                                        {newStatus === 'in-progress' && (
                                            <Box sx={{ mt: 4 }}>
                                                <Typography sx={{
                                                    fontWeight: 600,
                                                    color: '#1e293b',
                                                    fontFamily: 'var(--font-prompt)',
                                                    mb: 2.5,
                                                    fontSize: '0.95rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <Chart size="20" variant="Bold" color="#f59e0b" />
                                                    ระบุความคืบหน้า
                                                </Typography>

                                                <Box sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                                    gap: 1.25
                                                }}>
                                                    {[0, 25, 50, 75, 100].map((val) => {
                                                        const isSelected = progress === val;

                                                        const steps: { [key: number]: { label: string, icon: any } } = {
                                                            0: { label: 'เริ่ม', icon: Play },
                                                            25: { label: '25%', icon: StatusUp },
                                                            50: { label: '50%', icon: Flash },
                                                            75: { label: '75%', icon: DirectRight },
                                                            100: { label: 'เสร็จสิ้น (100%)', icon: Cup }
                                                        };

                                                        const stepConfig = {
                                                            0: { c: '#f59e0b', b: 'rgba(245, 158, 11, 0.1)', s: 'rgba(245, 158, 11, 0.2)' },
                                                            25: { c: '#eab308', b: 'rgba(234, 179, 8, 0.1)', s: 'rgba(234, 179, 8, 0.2)' },
                                                            50: { c: '#84cc16', b: 'rgba(132, 204, 22, 0.1)', s: 'rgba(132, 204, 22, 0.2)' },
                                                            75: { c: '#22c55e', b: 'rgba(34, 197, 94, 0.1)', s: 'rgba(34, 197, 94, 0.2)' },
                                                            100: { c: '#10b981', b: 'rgba(16, 185, 129, 0.1)', s: 'rgba(16, 185, 129, 0.2)' }
                                                        }[val as keyof typeof steps] || { c: '#f59e0b', b: 'rgba(245, 158, 11, 0.1)', s: 'rgba(245, 158, 11, 0.2)' };

                                                        const color = stepConfig.c;
                                                        const bgColor = stepConfig.b;
                                                        const is100 = val === 100;

                                                        const StepIcon = steps[val].icon;

                                                        return (
                                                            <Button
                                                                key={val}
                                                                onClick={() => setProgress(val)}
                                                                sx={{
                                                                    py: is100 ? 2 : 1.25,
                                                                    px: 1,
                                                                    borderRadius: 3,
                                                                    border: '1.5px solid',
                                                                    borderColor: isSelected ? color : '#f1f5f9',
                                                                    bgcolor: isSelected ? bgColor : '#fff',
                                                                    color: isSelected ? color : '#64748b',
                                                                    fontFamily: 'var(--font-prompt)',
                                                                    fontWeight: isSelected ? 700 : 500,
                                                                    fontSize: is100 ? '0.9rem' : '0.8rem',
                                                                    transition: 'all 0.2s',
                                                                    flexDirection: is100 ? 'row' : 'column',
                                                                    gap: is100 ? 1.5 : 0.5,
                                                                    gridColumn: is100 ? 'span 4' : 'span 1',
                                                                    boxShadow: isSelected ? `0 8px 16px ${stepConfig.s}` : 'none',
                                                                    '&:hover': {
                                                                        borderColor: color,
                                                                        bgcolor: bgColor,
                                                                    },
                                                                    '&:active': {
                                                                        transform: 'scale(0.98)'
                                                                    }
                                                                }}
                                                            >
                                                                <StepIcon size={is100 ? "24" : "20"} variant={isSelected ? 'Bold' : 'Linear'} color={isSelected ? color : '#cbd5e1'} />
                                                                {steps[val].label}
                                                            </Button>
                                                        );
                                                    })}
                                                </Box>

                                                <Typography sx={{
                                                    mt: 2,
                                                    fontSize: '0.8rem',
                                                    color: '#94a3b8',
                                                    fontFamily: 'var(--font-prompt)',
                                                    textAlign: 'center',
                                                    fontWeight: 500
                                                }}>
                                                    {progress === 0 && "เตรียมพร้อมเริ่มดำเนินงาน"}
                                                    {progress === 25 && "กำลังดำเนินการระยะเริ่มต้น"}
                                                    {progress === 50 && "ดำเนินการมาถึงครึ่งทางแล้ว"}
                                                    {progress === 75 && "ใกล้เสร็จสมบูรณ์ พร้อมตรวจสอบ"}
                                                    {progress === 100 && "งานเสร็จสมบูรณ์เรียบร้อย 100%"}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CollapsibleSection>
                            )}

                            {/* Section: Attachments - New Modern Design */}
                            <CollapsibleSection title="รูปภาพและไฟล์">
                                {/* Upload Action Buttons - Clean Tinted Style */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(3, auto)' },
                                    gap: 1.5,
                                    mb: 3
                                }}>
                                    {/* Camera Capture Button */}
                                    <Button
                                        component="label"
                                        disabled={sending}
                                        sx={{
                                            minHeight: 90,
                                            borderRadius: 3,
                                            bgcolor: '#f3e8ff', // Tinted Purple
                                            border: '1px solid #d8b4fe',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: '#e9d5ff',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageUpload}
                                        />
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(124, 58, 237, 0.1)'
                                        }}>
                                            <Instagram size="22" color="#7c3aed" variant="Bold" />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>ถ่ายรูป</Typography>
                                    </Button>

                                    {/* Gallery Select Button */}
                                    <Button
                                        component="label"
                                        disabled={sending}
                                        sx={{
                                            minHeight: 90,
                                            borderRadius: 3,
                                            bgcolor: '#eff6ff', // Tinted Blue
                                            border: '1px solid #bfdbfe',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: '#dbeafe',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(37, 99, 235, 0.1)'
                                        }}>
                                            <ImageIcon size="22" color="#2563eb" variant="Bold" />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>เลือกรูป</Typography>
                                    </Button>

                                    {/* File Upload Button */}
                                    <Button
                                        component="label"
                                        disabled={sending}
                                        sx={{
                                            minHeight: 90,
                                            borderRadius: 3,
                                            bgcolor: '#fff7ed', // Tinted Orange
                                            border: '1px solid #fed7aa',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: '#ffedd5',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <input type="file" hidden multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} />
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(249, 115, 22, 0.1)'
                                        }}>
                                            <FolderOpen size="22" color="#f97316" variant="Bold" />
                                        </Box>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600 }}>ไฟล์งาน</Typography>
                                    </Button>
                                </Box>

                                {/* Preview Grid */}
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>

                                    {/* Previews (Clean Tinted Badges Style) */}
                                    {selectedImages.map((img, index) => (
                                        <Box key={`img-${index}`} sx={{ position: 'relative', minWidth: 80, width: 80, height: 80 }}>
                                            <img
                                                src={img.url}
                                                alt="preview"
                                                style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                            />
                                            <Box
                                                onClick={() => handleRemoveImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    width: 22,
                                                    height: 22,
                                                    bgcolor: '#fff',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    border: '1px solid #ef4444',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'scale(1.1)' }
                                                }}>
                                                <Minus size="14" color="#ef4444" />
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
                                            bgcolor: '#fff7ed', // Orange tint for files
                                            border: '1px solid #ffedd5',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 1
                                        }}>
                                            <FolderOpen size="24" color="#f97316" variant="Bulk" />
                                            <Typography variant="caption" noWrap sx={{ width: '100%', textAlign: 'center', mt: 0.5, fontSize: '0.6rem', color: '#9a3412' }}>
                                                {file.name}
                                            </Typography>
                                            <Box
                                                onClick={() => handleRemoveFile(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -6,
                                                    right: -6,
                                                    width: 22,
                                                    height: 22,
                                                    bgcolor: '#fff',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    border: '1px solid #ef4444',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'scale(1.1)' }
                                                }}>
                                                <Minus size="14" color="#ef4444" />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CollapsibleSection>

                            {/* Section: Message - Clean Design */}
                            <CollapsibleSection title="ข้อความ">
                                <Box sx={{ position: 'relative' }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        placeholder="รายละเอียดความคืบหน้า หรือข้อความถึงลูกค้า..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        variant="outlined"
                                        inputProps={{ maxLength: 500 }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                bgcolor: '#f8fafc',
                                                '& fieldset': { borderColor: '#e2e8f0' },
                                                '&:hover fieldset': { borderColor: '#cbd5e1' },
                                                '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: 2 },
                                            },
                                            fontFamily: 'var(--font-prompt)'
                                        }}
                                    />
                                    <Typography sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 12,
                                        fontSize: '0.7rem',
                                        color: message.length > 450 ? '#f59e0b' : '#94a3b8',
                                        fontFamily: 'var(--font-prompt)'
                                    }}>
                                        {message.length}/500
                                    </Typography>
                                </Box>
                            </CollapsibleSection>

                            {/* Preview Section */}
                            {sendMode === 'status' && (
                                <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed #e2e8f0' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-prompt)' }}>
                                            <MessageText size="16" variant="Bold" />
                                            ตัวอย่างการแสดงผล
                                        </Typography>
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
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                    <Chart size="24" color="#0f172a" variant="Bold" />
                                    ประวัติการส่งข้อความ
                                </Typography>
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
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                                                    <FolderOpen size="14" color="#666" variant="Bold" />
                                                                                    {f.name}
                                                                                </Box>
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
                            borderRadius: 3,
                            px: 4,
                            height: 56,
                            minWidth: { xs: 0, md: 200 },
                            width: '100%',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-prompt)',
                            background: sending ? '#cbd5e1' : 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                            color: '#fff',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                            textTransform: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
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
