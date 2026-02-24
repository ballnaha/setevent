'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Tooltip
} from '@mui/material';
import { Add, Edit2, Trash, Image as ImageIcon, Gallery, CloseCircle } from 'iconsax-react';
import TopSnackbar from '@/components/ui/TopSnackbar';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface CategoryData {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    status: string;
    order: number;
    parent?: { id: string; name: string };
    _count?: { products: number; children: number };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        parentId: '',
        status: 'active'
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state for file pending upload
    const [previewUrl, setPreviewUrl] = useState<string>(''); // Separate preview URL

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch('/api/admin/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }

    const handleOpenDialog = (category?: CategoryData) => {
        setSelectedFile(null); // Reset pending file
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                image: category.image || '',
                parentId: category.parentId || '',
                status: category.status
            });
            setPreviewUrl(category.image || '');
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                image: '',
                parentId: '',
                status: 'active'
            });
            setPreviewUrl('');
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingCategory(null);
        setSelectedFile(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setSelectedFile(file);

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/\s+/g, '-') // แทนที่เว้นวรรคด้วย -
            .replace(/[^\w\u0E00-\u0E7F-]+/g, '') // อนุญาตเฉพาะตัวอักษร, ตัวเลข, ภาษาไทย และ -
            .replace(/-+/g, '-') // ลด - ที่ซ้ำซ้อน
            .trim();
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: editingCategory ? prev.slug : generateSlug(name) // Auto-slug only for new categories
        }));
    };

    const deleteFile = async (url: string) => {
        try {
            await fetch('/api/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
        } catch (e) {
            console.error("Failed to delete file", e);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.slug) {
            setSnackbar({ open: true, message: 'กรุณากรอกชื่อและ Slug', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            let imageUrl = formData.image;

            // If there's a new file selected, upload it first
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                // Use slug for folder or fallback
                uploadData.append('folder', formData.slug || 'categories');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                if (!uploadRes.ok) throw new Error('Failed to upload image');

                const uploadResult = await uploadRes.json();
                imageUrl = uploadResult.url;
            }

            // Delete old image if it was replaced or removed
            // Check if editingCategory exists and has an image, and if that image is different from the final imageUrl
            if (editingCategory?.image && editingCategory.image !== imageUrl) {
                await deleteFile(editingCategory.image);
            }

            const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                image: imageUrl // Use the (possibly new) image URL
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            setSnackbar({ open: true, message: 'บันทึกข้อมูลเรียบร้อย', severity: 'success' });
            handleCloseDialog();
            fetchCategories();
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message || 'เกิดข้อผิดพลาดในการบันทึก', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;
        try {
            // Delete image first if exists
            if (deletingCategory.image) {
                await deleteFile(deletingCategory.image);
            }

            const res = await fetch(`/api/admin/categories/${deletingCategory.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setSnackbar({ open: true, message: 'ลบหมวดหมู่เรียบร้อย', severity: 'success' });
            fetchCategories();
        } catch (error) {
            setSnackbar({ open: true, message: 'ลบหมวดหมู่ไม่สำเร็จ', severity: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setDeletingCategory(null);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                        จัดการหมวดหมู่สินค้า
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#666' }}>
                        สร้างและแก้ไขหมวดหมู่สินค้า (Submenu) และรูปภาพ
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add color="#fff" />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        bgcolor: '#1a1a1a',
                        fontFamily: 'var(--font-prompt)',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#333' }
                    }}
                >
                    เพิ่มหมวดหมู่
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>รูปภาพ</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ชื่อหมวดหมู่</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>Slug (URL)</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>หมวดหมู่หลัก</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานะ</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>จัดการ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id} hover>
                                <TableCell>
                                    {category.image ? (
                                        <Box sx={{ position: 'relative', width: 50, height: 50, borderRadius: 1, overflow: 'hidden' }}>
                                            <Image src={category.image} alt={category.name} fill style={{ objectFit: 'cover' }} />
                                        </Box>
                                    ) : (
                                        <Box sx={{ width: 50, height: 50, borderRadius: 1, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageIcon size="20" color="#ccc" variant="Bold" />
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    <Typography fontWeight={500}>{category.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{category._count?.children || 0} submenus • {category._count?.products || 0} products</Typography>
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>{category.slug}</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    {category.parent ? <Typography variant="body2" sx={{ bgcolor: '#eee', px: 1, borderRadius: 1, display: 'inline-block' }}>{category.parent.name}</Typography> : '-'}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{
                                        display: 'inline-block',
                                        px: 1.5, py: 0.5,
                                        borderRadius: 4,
                                        bgcolor: category.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: category.status === 'active' ? '#10B981' : '#EF4444',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {category.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Tooltip title="Upload Products / Gallery">
                                            <IconButton
                                                size="small"
                                                component={Link}
                                                href={`/admin/products?categoryId=${category.id}`}
                                                sx={{ bgcolor: '#eef2ff', '&:hover': { bgcolor: '#e0e7ff' } }}
                                            >
                                                <Gallery size="18" color="#6366f1" variant="Bold" />
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton size="small" onClick={() => handleOpenDialog(category)} sx={{ bgcolor: '#f0f9ff', '&:hover': { bgcolor: '#e0f2fe' } }}>
                                            <Edit2 size="18" color="#0ea5e9" variant="Bold" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => { setDeletingCategory(category); setDeleteDialogOpen(true); }} sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}>
                                            <Trash size="18" color="#ef4444" variant="Bold" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#999' }}>
                                    ไม่พบข้อมูลหมวดหมู่
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                    {editingCategory ? 'แก้ไขหมวดหมู่' : 'สร้างหมวดหมู่ใหม่'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        {/* Image Upload */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Box sx={{ position: 'relative', width: 120, height: 120, borderRadius: 2, border: '2px dashed #93c5fd', bgcolor: '#eff6ff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { borderColor: '#3b82f6', bgcolor: '#dbeafe' } }}>
                                {previewUrl ? (
                                    <>
                                        <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'cover' }} />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleRemoveImage();
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'rgba(255,255,255,0.8)',
                                                '&:hover': { bgcolor: '#fff', color: 'error.main' },
                                                zIndex: 10
                                            }}
                                        >
                                            <CloseCircle size="20" color="#ef4444" variant="Bold" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Stack alignItems="center" spacing={1} sx={{ color: '#3b82f6' }}>
                                        <ImageIcon size="32" variant="Bold" />
                                        <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>Upload Image</Typography>
                                    </Stack>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 1 }}
                                />
                            </Box>
                        </Box>

                        <TextField
                            label="ชื่อหมวดหมู่ (Name)"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <TextField
                            label="Slug (URL)"
                            fullWidth
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                            helperText="รองรับภาษาไทยและเว้นวรรค (เว้นวรรคจะถูกเปลี่ยนเป็น -)"
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>หมวดหมู่หลัก (Parent)</InputLabel>
                            <Select
                                value={formData.parentId}
                                label="หมวดหมู่หลัก (Parent)"
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                sx={{ fontFamily: 'var(--font-prompt)' }}
                            >
                                <MenuItem value=""><em>ไม่มี (เป็นหมวดหมู่หลัก)</em></MenuItem>
                                {categories
                                    .filter(c => c.id !== editingCategory?.id) // Prevent selecting self as parent
                                    .map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="คำอธิบาย"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะ</InputLabel>
                            <Select
                                value={formData.status}
                                label="สถานะ"
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="active">ใช้งาน (Active)</MenuItem>
                                <MenuItem value="inactive">ระงับ (Inactive)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ fontFamily: 'var(--font-prompt)' }}>ยกเลิก</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ fontFamily: 'var(--font-prompt)', bgcolor: '#1a1a1a' }}>
                        {saving ? 'บันทึก...' : 'บันทึก'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', textAlign: 'center', fontWeight: 600 }}>ยืนยันการลบ</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่</Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mt: 1, color: 'error.main' }}>
                        "{deletingCategory?.name}"
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#666', mt: 2, display: 'block' }}>
                        * การลบหมวดหมู่นี้จะทำให้สินค้าที่อยู่ในหมวดหมู่นี้ถูกลบไปด้วย
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2, fontFamily: 'var(--font-prompt)' }}>
                        ยกเลิก
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: 2, fontFamily: 'var(--font-prompt)' }}>
                        ยืนยันการลบ
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
