"use client";

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Stack,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Edit2, Gallery, VideoPlay, Save2, ArrowLeft, CloudPlus, ArrowRight, CloseCircle } from 'iconsax-react';
import Image from 'next/image';
import TopSnackbar from '@/components/ui/TopSnackbar';

interface PortfolioHighlight {
    title: string;
    category: string;
    mediaType: 'image' | 'youtube';
    src: string;
    link: string;
}

export default function HomeHighlightsPage() {
    const [highlights, setHighlights] = useState<PortfolioHighlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState<PortfolioHighlight>({
        title: '',
        category: '',
        mediaType: 'image',
        src: '',
        link: ''
    });

    useEffect(() => {
        fetchHighlights();
    }, []);

    const fetchHighlights = async () => {
        try {
            const res = await fetch('/api/admin/home-highlights');
            const data = await res.json();
            if (Array.isArray(data)) {
                setHighlights(data);
            }
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'โหลดข้อมูลไม่สำเร็จ', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setFormData(highlights[index]);
        setPendingFile(null);
        setPreviewUrl('');
    };

    const handleSave = async () => {
        if (editIndex === null) return;

        setSaving(true);
        try {
            let finalSrc = formData.src;

            // 1. Upload if there is a pending file
            if (pendingFile && formData.mediaType === 'image') {
                const uploadData = new FormData();
                uploadData.append('file', pendingFile);
                uploadData.append('folder', 'homepage');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData
                });

                if (!uploadRes.ok) throw new Error('Upload failed');
                const uploadResult = await uploadRes.json();
                finalSrc = uploadResult.url;
            }

            // 2. Prepare data with final URL
            const itemToSave = { ...formData, src: finalSrc };
            const updatedHighlights = [...highlights];
            updatedHighlights[editIndex] = itemToSave;

            // 3. Save to DB
            const res = await fetch('/api/admin/home-highlights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedHighlights)
            });

            if (res.ok) {
                setHighlights(updatedHighlights);
                setSnackbar({ open: true, message: 'บันทึกสำเร็จ', severity: 'success' });
                setEditIndex(null);
                setPendingFile(null);
                setPreviewUrl('');
            } else {
                throw new Error();
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'บันทึกไม่สำเร็จ', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setPendingFile(file);

        // Show local preview
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        setFormData(prev => ({ ...prev, mediaType: 'image' }));
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleYoutubeInput = (url: string) => {
        const ytId = getYoutubeId(url);
        if (ytId) {
            setFormData(prev => ({ ...prev, src: ytId, mediaType: 'youtube' }));
        } else {
            // Keep original src if not a valid link, or allow setting manually if it's just an id
            setFormData(prev => ({ ...prev, src: url }));
        }
    };

    if (loading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <TopSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800 }}>
                        จัดการไฮไลท์หน้าแรก
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: 'text.secondary', mt: 1 }}>
                        จัดการรูปภาพและวิดีโอ 4 รายการที่แสดงในส่วน Portfolio Highlights บนหน้าแรก
                    </Typography>
                </Box>

            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
                gap: 3
            }}>
                {highlights.map((item, idx) => (
                    <Box key={idx} sx={{
                        gridColumn: {
                            xs: 'span 1',
                            sm: idx === 1 ? 'span 1' : 'span 1',
                            md: idx === 1 ? 'span 7' : 'span 5',
                            lg: idx === 1 ? 'span 6' : 'span 3',
                        },
                        display: 'flex'
                    }}>
                        <Card sx={{
                            width: '100%',
                            borderRadius: idx === 1 ? 4 : 3,
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            transition: 'all 0.3s',
                            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }
                        }}>
                            <Box sx={{ position: 'relative', height: idx === 1 ? 250 : 180, bgcolor: '#000' }}>
                                {item.mediaType === 'youtube' ? (
                                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Image
                                            src={`https://img.youtube.com/vi/${item.src}/hqdefault.jpg`}
                                            alt={item.title}
                                            fill
                                            style={{ objectFit: 'cover', opacity: 0.8 }}
                                        />
                                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <VideoPlay variant="Bold" color="white" size="48" />
                                        </Box>
                                    </Box>
                                ) : (
                                    <Image src={item.src} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                )}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    bgcolor: 'var(--primary)',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>
                                    #{idx + 1} {idx === 1 ? '(ตัวใหญ่)' : '(ตัวเล็ก)'}
                                </Box>
                                <IconButton
                                    onClick={() => handleEdit(idx)}
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        color: '#1a1a1a',
                                        '&:hover': { bgcolor: 'white' }
                                    }}
                                >
                                    <Edit2 size="20" variant="Bold" color="#0A5C5A" />
                                </IconButton>
                            </Box>
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                                    {item.category}
                                </Typography>
                                <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ArrowRight size="14" color="#0A5C5A" /> {item.link}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Edit Dialog */}
            <Dialog
                open={editIndex !== null}
                onClose={() => setEditIndex(null)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    แก้ไขไฮไลท์ตำแหน่งที่ {editIndex !== null ? editIndex + 1 : ''}
                    {isMobile && (
                        <IconButton onClick={() => setEditIndex(null)} sx={{ color: 'text.secondary' }}>
                            <CloseCircle size="24" />
                        </IconButton>
                    )}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 2 }}>
                        <TextField
                            label="หัวเรื่อง (Title)"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            label="หมวดหมู่ (Category)"
                            fullWidth
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <TextField
                            label="ลิงก์ไปยังหน้า (Link URL)"
                            fullWidth
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />

                        <FormControl fullWidth>
                            <InputLabel>ประเภทสื่อ (Media Type)</InputLabel>
                            <Select
                                value={formData.mediaType}
                                label="ประเภทสื่อ (Media Type)"
                                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                            >
                                <MenuItem value="image">รูปภาพ (Static Image)</MenuItem>
                                <MenuItem value="youtube">วิดีโอ YouTube</MenuItem>
                            </Select>
                        </FormControl>

                        {formData.mediaType === 'youtube' ? (
                            <TextField
                                label="YouTube URL หรือ ID"
                                fullWidth
                                value={formData.src}
                                onChange={(e) => handleYoutubeInput(e.target.value)}
                                helperText="วางลิงก์ YouTube หรือใส่เฉพาะ Video ID ก็ได้"
                                InputProps={{
                                    startAdornment: <VideoPlay size="20" color="#0A5C5A" style={{ marginRight: 8 }} />
                                }}
                            />
                        ) : (
                            <Box>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    startIcon={<CloudPlus color="#0A5C5A" />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    เลือกรูปภาพใหม่เพื่ออัปโหลด
                                    <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                                </Button>
                                {formData.src && !previewUrl && (
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary', wordBreak: 'break-all' }}>
                                        ไฟล์ปัจจุบัน: {formData.src.split('/').pop()}
                                    </Typography>
                                )}
                                {previewUrl && (
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'var(--primary)', fontWeight: 600 }}>
                                        เตรียมอัปโหลด: {pendingFile?.name}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {formData.src && (
                            <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd', aspectRatio: '16/9', position: 'relative' }}>
                                <Image
                                    src={formData.mediaType === 'youtube' ? `https://img.youtube.com/vi/${formData.src}/hqdefault.jpg` : (previewUrl || formData.src)}
                                    alt="Preview"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditIndex(null)}>ยกเลิก</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving}
                        sx={{ bgcolor: '#1a1a1a', px: 4, borderRadius: 2 }}
                    >
                        {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
