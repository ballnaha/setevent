'use client';

import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Chip, Snackbar, Alert,
    Select, MenuItem, FormControl, InputLabel, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Skeleton
} from '@mui/material';
import { Add, Edit2, Trash, ArrowUp2, ArrowDown2 } from 'iconsax-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    order: number;
    status: string;
    parent?: { id: string; name: string } | null;
    _count?: { products: number; children: number };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: '',
        status: 'active',
        order: 0
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9ก-๙\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // Handle form change
    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            // Auto-generate slug from name
            if (field === 'name' && !editingCategory) {
                newData.slug = generateSlug(value as string);
            }
            return newData;
        });
    };

    // Open dialog for create/edit
    const openDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                parentId: category.parentId || '',
                status: category.status,
                order: category.order
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                parentId: '',
                status: 'active',
                order: categories.length
            });
        }
        setDialogOpen(true);
    };

    // Save category
    const handleSave = async () => {
        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';

            const res = await fetch(url, {
                method: editingCategory ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save');
            }

            setSnackbar({ open: true, message: editingCategory ? 'อัพเดทหมวดหมู่สำเร็จ' : 'สร้างหมวดหมู่สำเร็จ', severity: 'success' });
            setDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
    };

    // Delete category
    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete');
            }

            setSnackbar({ open: true, message: 'ลบหมวดหมู่สำเร็จ', severity: 'success' });
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
    };

    // Get root categories for parent selection
    const rootCategories = categories.filter(c => !c.parentId);

    // Build hierarchy for display
    const getHierarchicalCategories = () => {
        const roots = categories.filter(c => !c.parentId);
        const result: (Category & { level: number })[] = [];

        const addWithChildren = (cat: Category, level: number) => {
            result.push({ ...cat, level });
            const children = categories.filter(c => c.parentId === cat.id);
            children.forEach(child => addWithChildren(child, level + 1));
        };

        roots.forEach(root => addWithChildren(root, 0));
        return result;
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                        หมวดหมู่สินค้า
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(0,0,0,0.6)', mt: 0.5 }}>
                        จัดการหมวดหมู่สินค้าและบริการ
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add size="20" />}
                    onClick={() => openDialog()}
                    sx={{
                        bgcolor: '#0A5C5A',
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 600,
                        px: 3,
                        py: 1.2,
                        '&:hover': { bgcolor: '#084544' }
                    }}
                >
                    เพิ่มหมวดหมู่
                </Button>
            </Box>

            {/* Categories Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ชื่อหมวดหมู่</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>Slug</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>หมวดหมู่หลัก</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }} align="center">สินค้า</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }} align="center">สถานะ</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }} align="center">จัดการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton variant="text" width={150} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={40} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={60} /></TableCell>
                                        <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                getHierarchicalCategories().map((category) => (
                                    <TableRow key={category.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {category.level > 0 && (
                                                    <Box sx={{
                                                        width: category.level * 24,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'rgba(0,0,0,0.3)'
                                                    }}>
                                                        {'└─'.repeat(category.level)}
                                                    </Box>
                                                )}
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: category.level === 0 ? 600 : 400 }}>
                                                    {category.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem' }}>
                                                {category.slug}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {category.parent ? (
                                                <Chip
                                                    label={category.parent.name}
                                                    size="small"
                                                    sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem' }}
                                                />
                                            ) : (
                                                <Typography sx={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem' }}>-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={category._count?.products || 0}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    bgcolor: 'rgba(10, 92, 90, 0.1)',
                                                    color: '#0A5C5A',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={category.status === 'active' ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    bgcolor: category.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: category.status === 'active' ? '#22c55e' : '#ef4444',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => openDialog(category)} sx={{ color: '#0A5C5A' }}>
                                                <Edit2 size="18" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => { setCategoryToDelete(category); setDeleteDialogOpen(true); }}
                                                sx={{ color: '#ef4444', ml: 0.5 }}
                                            >
                                                <Trash size="18" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                    {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="ชื่อหมวดหมู่"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            fullWidth
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <TextField
                            label="Slug (URL)"
                            value={formData.slug}
                            onChange={(e) => handleChange('slug', e.target.value)}
                            fullWidth
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            helperText="ใช้สำหรับ URL เช่น /products/rental"
                        />
                        <TextField
                            label="คำอธิบาย"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>หมวดหมู่หลัก</InputLabel>
                            <Select
                                value={formData.parentId}
                                onChange={(e) => handleChange('parentId', e.target.value)}
                                label="หมวดหมู่หลัก"
                                sx={{ fontFamily: 'var(--font-prompt)' }}
                            >
                                <MenuItem value="">
                                    <em>ไม่มี (เป็นหมวดหมู่หลัก)</em>
                                </MenuItem>
                                {rootCategories
                                    .filter(c => c.id !== editingCategory?.id)
                                    .map(cat => (
                                        <MenuItem key={cat.id} value={cat.id} sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะ</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                label="สถานะ"
                                sx={{ fontFamily: 'var(--font-prompt)' }}
                            >
                                <MenuItem value="active" sx={{ fontFamily: 'var(--font-prompt)' }}>Active</MenuItem>
                                <MenuItem value="inactive" sx={{ fontFamily: 'var(--font-prompt)' }}>Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ fontFamily: 'var(--font-prompt)' }}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ fontFamily: 'var(--font-prompt)', bgcolor: '#0A5C5A', '&:hover': { bgcolor: '#084544' } }}
                    >
                        {editingCategory ? 'บันทึก' : 'สร้าง'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                    ยืนยันการลบ
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณต้องการลบหมวดหมู่ "{categoryToDelete?.name}" หรือไม่?
                    </Typography>
                    {categoryToDelete?._count?.products && categoryToDelete._count.products > 0 && (
                        <Alert severity="warning" sx={{ mt: 2, fontFamily: 'var(--font-prompt)' }}>
                            หมวดหมู่นี้มีสินค้า {categoryToDelete._count.products} รายการ
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontFamily: 'var(--font-prompt)' }}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ fontFamily: 'var(--font-prompt)' }}
                    >
                        ลบ
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
                <Alert severity={snackbar.severity} sx={{ fontFamily: 'var(--font-prompt)' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
