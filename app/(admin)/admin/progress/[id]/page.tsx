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
    Checkbox
} from '@mui/material';
import { ArrowLeft, Trash, Image as ImageIcon, FolderOpen } from 'iconsax-react';
import TopSnackbar from '@/components/ui/TopSnackbar';

// Status Configuration
const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    'in-progress': { label: 'กำลังดำเนินการ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    completed: { label: 'ปิดงาน', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    cancelled: { label: 'ยกเลิก', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
};

function StatusFlexPreview({ eventName, status, message, imageUrls, progress, senderName }: { eventName: string, status: string, message: string, imageUrls: string[], progress?: number, senderName?: string }) {
    const config = statusLabels[status] || statusLabels['in-progress'];

    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    return (
        <Box sx={{ maxWidth: 320, mx: 'auto', pointerEvents: 'none' }}>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', mb: 2 }}>
                {/* Header Row */}
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ color: config.color, fontWeight: 'bold', fontSize: '0.65rem' }}>UPDATE STATUS</Typography>
                        <Typography sx={{ color: '#b0b0b0', fontSize: '0.65rem' }}>{dateStr} • {timeStr}</Typography>
                    </Box>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1a1a1a', mb: 0.5 }}>{config.label}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>{eventName}</Typography>

                    <Divider sx={{ my: 2, borderColor: '#f0f0f0' }} />

                    {progress !== undefined && (
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 'bold' }}>Progress</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: progress === 100 ? '#10B981' : config.color, fontWeight: 'bold' }}>{progress}%</Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 6, bgcolor: '#f5f5f5', borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: progress === 100 ? '#10B981' : config.color }} />
                            </Box>
                        </Box>
                    )}

                    {message && (
                        <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 2 }}>
                            <Typography sx={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>{message}</Typography>
                        </Box>
                    )}

                    {senderName && (
                        <Typography sx={{ fontSize: '0.6rem', color: '#aaa', textAlign: 'right', mt: 1.5 }}>
                            — {senderName}
                        </Typography>
                    )}
                </Box>
            </Box>
            {imageUrls.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: '#aaa', textAlign: 'center', mb: 0.5 }}>รูปภาพ ({Math.min(imageUrls.length, 4)})</Typography>
                    {imageUrls.slice(0, 4).map((url, i) => (
                        <Box key={i} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                            <img src={url} style={{ width: '100%', display: 'block' }} />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [event, setEvent] = useState<any>(null);
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
    const [notifyLine, setNotifyLine] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });

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


    async function handleSend() {
        if (!event) return;

        // Validate: must have message or images or files
        const hasContent = message.trim() || selectedImages.length > 0 || selectedFiles.length > 0;
        if (!hasContent) {
            setSnackbar({ open: true, message: 'กรุณาใส่ข้อความ หรือเลือกรูปภาพ/ไฟล์', severity: 'error' });
            return;
        }

        setSending(true);

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

            // If only updating status without LINE notification
            if (sendMode === 'status' && !notifyLine) {
                setSnackbar({ open: true, message: 'บันทึกสถานะเรียบร้อยแล้ว', severity: 'success' });
                fetchEventDetails();
                setSending(false);
                return;
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
        <Box>
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
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" sx={{ color: '#999', fontFamily: 'var(--font-prompt)' }}>
                                ID: {event.id}
                            </Typography>
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
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 3, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                📤 ฟอร์มอัพเดทงาน
                            </Typography>

                            {/* Mode Toggle */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                <Button
                                    variant={sendMode === 'status' ? 'contained' : 'outlined'}
                                    onClick={() => setSendMode('status')}
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        borderRadius: 2,
                                        flex: 1,
                                        bgcolor: sendMode === 'status' ? 'var(--primary)' : undefined,
                                    }}
                                >
                                    อัพเดทสถานะ
                                </Button>
                                <Button
                                    variant={sendMode === 'chat' ? 'contained' : 'outlined'}
                                    onClick={() => setSendMode('chat')}
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        borderRadius: 2,
                                        flex: 1,
                                        bgcolor: sendMode === 'chat' ? 'var(--primary)' : undefined,
                                    }}
                                >
                                    ข้อความธรรมดา
                                </Button>
                            </Box>

                            {/* Status Fields (only show in status mode) */}
                            {sendMode === 'status' && (
                                <>
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะงานใหม่</InputLabel>
                                        <Select
                                            value={newStatus}
                                            label="สถานะงานใหม่"
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                        >
                                            {Object.entries(statusLabels).map(([key, val]) => (
                                                <MenuItem key={key} value={key}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: val.color }} />
                                                        {val.label}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {newStatus === 'in-progress' && (
                                        <Box sx={{ mb: 3, px: 1 }}>
                                            <Typography gutterBottom sx={{ fontSize: '0.9rem', color: '#666' }}>ความคืบหน้า ({progress}%)</Typography>
                                            <Slider
                                                value={progress}
                                                onChange={(_, val) => setProgress(val as number)}
                                                valueLabelDisplay="auto"
                                                sx={{ color: statusLabels[newStatus]?.color }}
                                            />
                                        </Box>
                                    )}
                                </>
                            )}

                            <TextField
                                fullWidth multiline rows={3}
                                label="ข้อความถึงลูกค้า (ไม่บังคับ)"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                sx={{ mb: 3 }}
                                InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            {/* Images */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<ImageIcon />}
                                        disabled={sending}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                    >
                                        รูปภาพ (LINE)
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </Button>
                                    <Typography variant="caption" sx={{ ml: 2, color: '#999' }}>
                                        {selectedImages.length} / 5 รูป
                                    </Typography>
                                </Box>

                                {selectedImages.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        {selectedImages.map((img, index) => (
                                            <Box key={index} sx={{ position: 'relative', width: 100, height: 100 }}>
                                                <img
                                                    src={img.url}
                                                    alt={`Preview ${index}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveImage(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        '&:hover': { bgcolor: '#fee2e2' }
                                                    }}
                                                >
                                                    <Trash size={16} color="#ef4444" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            {/* Work Files */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<FolderOpen />}
                                        disabled={sending}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                    >
                                        ไฟล์งาน (PDF/WORLD/EXCEL)
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            onChange={handleFileUpload}
                                        />
                                    </Button>
                                    <Typography variant="caption" sx={{ ml: 2, color: '#999' }}>
                                        {selectedFiles.length} / 5 ไฟล์
                                    </Typography>
                                </Box>

                                {selectedFiles.length > 0 && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {selectedFiles.map((file, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden' }}>
                                                    <FolderOpen size={20} color="#666" />
                                                    <Box sx={{ overflow: 'hidden' }}>
                                                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{file.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveFile(index)}
                                                    sx={{ '&:hover': { color: '#ef4444' } }}
                                                >
                                                    <Trash size={18} />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {sendMode === 'status' && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={notifyLine}
                                                onChange={(e) => setNotifyLine(e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.95rem' }}>
                                                แจ้งเตือนลูกค้าทาง LINE
                                            </Typography>
                                        }
                                        sx={{ mb: 1 }}
                                    />
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={handleSend}
                                        disabled={sending}
                                        sx={{
                                            py: 2,
                                            bgcolor: 'var(--primary)',
                                            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {sending ? 'กำลังบันทึก...' : sendMode === 'status' ? (notifyLine ? 'บันทึกและส่งอัพเดท' : 'บันทึกสถานะ') : 'ส่งข้อความ'}
                                    </Button>
                                    {sendMode === 'status' && notifyLine && (
                                        <Typography sx={{ textAlign: 'center', mt: 2, fontSize: '0.8rem', color: '#999' }}>
                                            * ลูกค้าจะได้รับแจ้งเตือนทาง LINE ทันที
                                        </Typography>
                                    )}
                                </Box>

                                {sendMode === 'status' && (
                                    <Box sx={{ flex: 1, bgcolor: '#fafafa', borderRadius: 2, p: 2 }}>
                                        <Typography sx={{ fontSize: '0.8rem', color: '#888', mb: 1, textAlign: 'center' }}>ตัวอย่าง</Typography>
                                        <StatusFlexPreview
                                            eventName={event.eventName}
                                            status={newStatus}
                                            message={message}
                                            progress={newStatus === 'in-progress' ? progress : undefined}
                                            imageUrls={selectedImages.map(img => img.url)}
                                            senderName={session?.user?.name || 'Admin'}
                                        />
                                    </Box>
                                )}
                            </Box>
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
        </Box>
    );
}
