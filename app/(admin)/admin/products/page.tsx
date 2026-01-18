'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress,
    Stack,
    InputAdornment,
    Tooltip,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { Add, Edit2, Trash, Category as CategoryIcon, SearchNormal1, Image as ImageIcon, CloudPlus } from 'iconsax-react';
import TopSnackbar from '@/components/ui/TopSnackbar';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    category?: { id: string; name: string };
    price: number | null;
    status: string;
    images: string | null; // JSON string in DB
    description: string | null;
}

interface Category {
    id: string;
    name: string;
    slug?: string; // Add slug optional
    parentId: string | null;
    parent?: { id: string; name: string };
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlCategoryId = searchParams.get('categoryId');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: '',
        priceUnit: '', // e.g. "ต่อตร.ม.", "/ชิ้น", "/วัน"
        categoryId: '',
        description: '',
        status: 'active',
        images: [] as string[]
    });

    const [pendingImages, setPendingImages] = useState<{ file: File; previewUrl: string }[]>([]);
    const [pendingDeleteImages, setPendingDeleteImages] = useState<string[]>([]); // Images to delete on save
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [useWatermark, setUseWatermark] = useState(false);

    // State for image delete confirmation
    const [imageDeleteConfirm, setImageDeleteConfirm] = useState<{
        open: boolean;
        type: 'uploaded' | 'pending' | null;
        index: number;
        previewUrl?: string;
    }>({ open: false, type: null, index: -1 });

    // Initialize filter from URL if present
    useEffect(() => {
        if (urlCategoryId) {
            setFilterCategory(urlCategoryId);
        }
    }, [urlCategoryId]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filterCategory, searchQuery]);

    async function fetchInitialData() {
        try {
            const catRes = await fetch('/api/admin/categories');
            const catData = await catRes.json();
            setCategories(catData);
            // fetchProducts is called by dependency
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchProducts() {
        try {
            let url = `/api/admin/products?search=${searchQuery}`;
            if (filterCategory !== 'all') {
                url += `&categoryId=${filterCategory}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products');
        }
    }

    // Prepare Category Options with Full Path logic
    const categoryOptions = useMemo(() => {
        const catMap = new Map<string, Category>();
        categories.forEach(c => catMap.set(c.id, c));

        const getFullPath = (cat: Category): string => {
            if (cat.parentId && catMap.has(cat.parentId)) {
                return `${getFullPath(catMap.get(cat.parentId)!)} > ${cat.name}`;
            }
            return cat.name;
        };

        return categories.map(c => ({
            ...c,
            fullPath: getFullPath(c)
        })).sort((a, b) => a.fullPath.localeCompare(b.fullPath));
    }, [categories]);

    const handleFilterChange = (val: string) => {
        setFilterCategory(val);
        // Update URL to reflect state (optional but good for UX)
        if (val === 'all') router.push('/admin/products');
        else router.push(`/admin/products?categoryId=${val}`);
    };

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            let parsedImages: string[] = [];
            try {
                parsedImages = product.images ? JSON.parse(product.images) : [];
                if (typeof parsedImages === 'string') parsedImages = [parsedImages];
            } catch (e) { console.error("Error parsing images JSON", e); }

            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                price: product.price?.toString() || '',
                priceUnit: (product as any).priceUnit || '',
                categoryId: product.categoryId,
                description: product.description || '',
                status: product.status,
                images: parsedImages
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                slug: '',
                price: '',
                priceUnit: '',
                categoryId: filterCategory !== 'all' ? filterCategory : '', // Auto-select category if filtered
                description: '',
                status: 'active',
                images: []
            });
        }
        setPendingImages([]);
        setPendingDeleteImages([]);
        setDialogOpen(true);
        if (!product) setUseWatermark(false); // Default to false for new products
    };

    // Store selected files locally with preview (NOT uploading yet) - supports multiple files
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newImages = Array.from(e.target.files).map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));

        setPendingImages(prev => [...prev, ...newImages]);
        // Reset input value so user can select the same files again if needed
        e.target.value = '';
    };

    // Remove a pending image (not yet uploaded)
    const removePendingImage = (index: number) => {
        setPendingImages(prev => {
            // Revoke the blob URL to free memory
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
        setImageDeleteConfirm({ open: false, type: null, index: -1 });
        setSnackbar({ open: true, message: 'ลบรูปที่รอ Upload สำเร็จ', severity: 'success' });
    };

    // Mark an already uploaded image for deletion on save (don't delete immediately)
    const removeUploadedImage = async (index: number) => {
        const imageUrl = formData.images[index];
        // Mark for deletion on save (don't delete immediately)
        setPendingDeleteImages(prev => [...prev, imageUrl]);
        // Remove from formData
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImageDeleteConfirm({ open: false, type: null, index: -1 });
        setSnackbar({ open: true, message: 'รูปภาพจะถูกลบเมื่อกดบันทึก', severity: 'success' });
    };

    // Open confirmation dialog for image deletion
    const confirmDeleteImage = (type: 'uploaded' | 'pending', index: number, previewUrl?: string) => {
        setImageDeleteConfirm({ open: true, type, index, previewUrl });
    };

    // Handle confirmed image deletion
    const handleConfirmDeleteImage = () => {
        if (imageDeleteConfirm.type === 'uploaded') {
            removeUploadedImage(imageDeleteConfirm.index);
        } else if (imageDeleteConfirm.type === 'pending') {
            removePendingImage(imageDeleteConfirm.index);
        }
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
        if (!formData.name || !formData.categoryId) {
            setSnackbar({ open: true, message: 'กรุณากรอกชื่อสินค้าและเลือกหมวดหมู่', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            // Step 0: Delete pending delete images from server
            if (pendingDeleteImages.length > 0) {
                for (const imgUrl of pendingDeleteImages) {
                    await deleteFile(imgUrl);
                }
                setPendingDeleteImages([]);
            }

            // Step 1: Submit product first (with existing images only)
            const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                price: formData.price || null,
                images: formData.images // Existing uploaded images
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error);
            }

            const savedProduct = await res.json();
            const productId = savedProduct.id || editingProduct?.id;

            // Step 2: Upload pending images (if any)
            if (pendingImages.length > 0) {
                const selectedCat = categories.find(c => c.id === formData.categoryId);
                const folder = selectedCat?.slug || 'products';

                const uploadedUrls: string[] = [...formData.images]; // Start with existing images

                for (const pending of pendingImages) {
                    const uploadData = new FormData();
                    uploadData.append('file', pending.file);
                    uploadData.append('folder', folder);
                    uploadData.append('watermark', useWatermark.toString());

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadData
                    });

                    if (uploadRes.ok) {
                        const uploadResult = await uploadRes.json();
                        uploadedUrls.push(uploadResult.url);
                    } else {
                        console.error('Failed to upload image:', pending.file.name);
                    }

                    // Revoke preview URL to free memory
                    URL.revokeObjectURL(pending.previewUrl);
                }

                // Step 3: Update product with new image URLs
                if (uploadedUrls.length > formData.images.length) {
                    await fetch(`/api/admin/products/${productId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ images: uploadedUrls })
                    });
                }
            }

            // Clear pending images
            setPendingImages([]);
            setSnackbar({ open: true, message: 'บันทึกสำเร็จ', severity: 'success' });
            setDialogOpen(false);
            fetchProducts();

        } catch (error: any) {
            setSnackbar({ open: true, message: error.message || 'บันทึกไม่สำเร็จ', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingProduct) return;
        try {
            // Delete images associated with product
            let imagesToDelete: string[] = [];
            try {
                imagesToDelete = deletingProduct.images ? JSON.parse(deletingProduct.images) : [];
                if (typeof imagesToDelete === 'string') imagesToDelete = [imagesToDelete];
            } catch (e) { }

            for (const img of imagesToDelete) {
                await deleteFile(img);
            }

            const res = await fetch(`/api/admin/products/${deletingProduct.id}`, { method: 'DELETE' });
            if (res.ok) {
                setSnackbar({ open: true, message: 'ลบสำเร็จ', severity: 'success' });
                fetchProducts();
            } else throw new Error();
        } catch {
            setSnackbar({ open: true, message: 'ลบไม่สำเร็จ', severity: 'error' });
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                        จัดการสินค้า
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#666' }}>
                        สำหรับ Submenus (LED, Sound, Lighting, etc.)
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<CategoryIcon color="#1a1a1a" />}
                        component={Link}
                        href="/admin/products/categories"
                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2, borderColor: '#e0e0e0', color: '#1a1a1a' }}
                    >
                        จัดการหมวดหมู่
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add color="#fff" />}
                        onClick={() => handleOpenDialog()}
                        sx={{ bgcolor: '#1a1a1a', fontFamily: 'var(--font-prompt)', borderRadius: 2, '&:hover': { bgcolor: '#333' } }}
                    >
                        เพิ่มสินค้า
                    </Button>
                </Stack>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl size="small" sx={{ minWidth: 250 }}>
                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>Filter by Category</InputLabel>
                    <Select
                        value={filterCategory}
                        label="Filter by Category"
                        onChange={(e) => handleFilterChange(e.target.value)}
                        sx={{ fontFamily: 'var(--font-prompt)' }}
                    >
                        <MenuItem value="all">ทั้งหมด</MenuItem>
                        {categoryOptions.map(c => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.fullPath}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    placeholder="Search Products..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchNormal1 size={18} color="#999" /></InputAdornment>,
                        sx: { fontFamily: 'var(--font-prompt)' }
                    }}
                    sx={{ flexGrow: 1, maxWidth: 400 }}
                />
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>รูปภาพ</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ชื่อสินค้า</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>หมวดหมู่</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ราคา</TableCell>
                            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานะ</TableCell>
                            <TableCell align="right" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>จัดการ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : products.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: '#999', fontFamily: 'var(--font-prompt)' }}>
                                {filterCategory !== 'all'
                                    ? 'ยังไม่มีสินค้าในหมวดหมู่นี้ กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มสร้างได้เลย'
                                    : 'ไม่พบข้อมูลสินค้า'}
                            </TableCell></TableRow>
                        ) : (
                            products.map(product => {
                                let imgUrl = '';
                                try {
                                    const imgs = product.images ? JSON.parse(product.images) : [];
                                    if (Array.isArray(imgs) && imgs.length > 0) imgUrl = imgs[0];
                                } catch (e) { }

                                return (
                                    <TableRow key={product.id} hover>
                                        <TableCell>
                                            <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: '#f5f5f5', position: 'relative', overflow: 'hidden', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {imgUrl ? (
                                                    <Image src={imgUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                                ) : <ImageIcon size="24" color="#d1d5db" variant="Bold" />}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            <Typography fontWeight={600} fontSize="0.95rem">{product.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{product.slug}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            <Chip label={product.category?.name || '-'} size="small" sx={{ bgcolor: '#f5f5f5' }} />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {product.price ? product.price.toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{
                                                display: 'inline-flex', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 600,
                                                bgcolor: product.status === 'active' ? '#ecfdf5' : '#fef2f2',
                                                color: product.status === 'active' ? '#059669' : '#dc2626'
                                            }}>
                                                {product.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleOpenDialog(product)} sx={{ mr: 1, bgcolor: '#f0f9ff', '&:hover': { bgcolor: '#e0f2fe' } }}>
                                                <Edit2 size="18" color="#0ea5e9" variant="Bold" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => { setDeletingProduct(product); setDeleteDialogOpen(true); }} sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}>
                                                <Trash size="18" color="#ef4444" variant="Bold" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Product Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                    {editingProduct ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 1 }}>
                        <TextField
                            label="ชื่อสินค้า (Product Name)"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label="Slug (URL)"
                                    fullWidth
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    helperText="เช่น led-p3-indoor (ภาษาอังกฤษ ตัวเล็ก)"
                                    InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>หมวดหมู่ (เลือก Submenu)</InputLabel>
                                    <Select
                                        value={formData.categoryId}
                                        label="หมวดหมู่ (เลือก Submenu)"
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        sx={{ fontFamily: 'var(--font-prompt)' }}
                                    >
                                        {categoryOptions.map(c => (
                                            <MenuItem key={c.id} value={c.id} sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>
                                                {c.fullPath}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                            <Box sx={{ flex: 2 }}>
                                <TextField
                                    label="ราคา (Price)"
                                    type="number"
                                    fullWidth
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>หน่วยราคา</InputLabel>
                                    <Select
                                        value={formData.priceUnit}
                                        label="หน่วยราคา"
                                        onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                                        sx={{ fontFamily: 'var(--font-prompt)' }}
                                    >
                                        <MenuItem value="" sx={{ fontFamily: 'var(--font-prompt)' }}><em>ไม่ระบุ</em></MenuItem>
                                        <MenuItem value="/วัน" sx={{ fontFamily: 'var(--font-prompt)' }}>/วัน</MenuItem>
                                        <MenuItem value="/ชิ้น" sx={{ fontFamily: 'var(--font-prompt)' }}>/ชิ้น</MenuItem>
                                        <MenuItem value="/ตร.ม." sx={{ fontFamily: 'var(--font-prompt)' }}>/ตร.ม.</MenuItem>
                                        <MenuItem value="/เมตร" sx={{ fontFamily: 'var(--font-prompt)' }}>/เมตร</MenuItem>
                                        <MenuItem value="/ชุด" sx={{ fontFamily: 'var(--font-prompt)' }}>/ชุด</MenuItem>
                                        <MenuItem value="/งาน" sx={{ fontFamily: 'var(--font-prompt)' }}>/งาน</MenuItem>
                                        <MenuItem value="เริ่มต้น" sx={{ fontFamily: 'var(--font-prompt)' }}>เริ่มต้น</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <TextField
                            label="รายละเอียดสินค้า"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />

                        {/* Image Upload Area */}
                        <Box sx={{ border: '1px solid #e0e0e0', p: 2.5, borderRadius: 2, bgcolor: '#fafafa' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ImageIcon size="20" color="#2563EB" variant="Bold" />
                                    <Typography variant="subtitle2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                                        รูปภาพสินค้า (Product Images)
                                    </Typography>
                                </Box>
                                {pendingImages.length > 0 && (
                                    <Typography variant="caption" sx={{ color: '#f59e0b', fontFamily: 'var(--font-prompt)', fontWeight: 500 }}>
                                        📷 {pendingImages.length} รูปรอ Upload (จะ Upload หลังกดบันทึก)
                                    </Typography>
                                )}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={useWatermark}
                                            onChange={(e) => setUseWatermark(e.target.checked)}
                                            color="primary"
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                            ใส่ลายน้ำ
                                        </Typography>
                                    }
                                    sx={{ ml: 2 }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {/* Already uploaded images */}
                                {formData.images.map((img, idx) => (
                                    <Tooltip key={`uploaded-${idx}`} title="รูปนี้ Upload แล้ว - กด X เพื่อลบจาก Server" arrow>
                                        <Box sx={{ position: 'relative', width: 120, height: 120, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px solid #22c55e' }}>
                                            <Image src={img} alt="Product" fill style={{ objectFit: 'cover' }} />
                                            <Box sx={{ position: 'absolute', bottom: 4, left: 4, bgcolor: '#22c55e', color: '#fff', px: 0.5, py: 0.25, borderRadius: 0.5, fontSize: '0.6rem', fontWeight: 600 }}>
                                                Uploaded
                                            </Box>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: 'absolute', top: 4, right: 4,
                                                    bgcolor: 'rgba(255,255,255,0.9)', color: '#dc2626',
                                                    '&:hover': { bgcolor: '#fff' }
                                                }}
                                                onClick={() => confirmDeleteImage('uploaded', idx, img)}
                                            >
                                                <Trash size="16" color="#dc2626" />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                ))}

                                {/* Pending images (not yet uploaded) */}
                                {pendingImages.map((pending, idx) => (
                                    <Tooltip key={`pending-${idx}`} title="รูปนี้รอ Upload - จะ Upload หลังกดบันทึก" arrow>
                                        <Box sx={{ position: 'relative', width: 120, height: 120, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px dashed #f59e0b' }}>
                                            <Image src={pending.previewUrl} alt="Pending" fill style={{ objectFit: 'cover' }} />
                                            <Box sx={{ position: 'absolute', bottom: 4, left: 4, bgcolor: '#f59e0b', color: '#fff', px: 0.5, py: 0.25, borderRadius: 0.5, fontSize: '0.6rem', fontWeight: 600 }}>
                                                Pending
                                            </Box>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: 'absolute', top: 4, right: 4,
                                                    bgcolor: 'rgba(255,255,255,0.9)', color: '#dc2626',
                                                    '&:hover': { bgcolor: '#fff' }
                                                }}
                                                onClick={() => confirmDeleteImage('pending', idx, pending.previewUrl)}
                                            >
                                                <Trash size="16" color="#dc2626" />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                ))}

                                {/* Upload Button Block */}
                                <Box sx={{
                                    width: 120, height: 120, borderRadius: 2, border: '2px dashed #93c5fd',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s', bgcolor: '#eff6ff',
                                    '&:hover': { borderColor: '#3b82f6', bgcolor: '#dbeafe' }, position: 'relative'
                                }}>
                                    <CloudPlus size="32" color="#3b82f6" variant="Bold" />
                                    <Typography variant="caption" sx={{ mt: 1, color: '#3b82f6', fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                                        เลือกรูป (หลายรูปได้)
                                    </Typography>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะ</InputLabel>
                            <Select
                                value={formData.status}
                                label="สถานะ"
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}>ยกเลิก</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ fontFamily: 'var(--font-prompt)', bgcolor: '#1a1a1a', borderRadius: 2 }}>
                        {saving ? 'บันทึก...' : 'บันทึกข้อมูล'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', textAlign: 'center' }}>ยืนยันลบสินค้า</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography>คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?</Typography>
                    <Typography fontWeight="bold" sx={{ mt: 1, fontSize: '1.2rem' }}>{deletingProduct?.name}</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>ยกเลิก</Button>
                    <Button variant="contained" color="error" onClick={handleDelete} sx={{ borderRadius: 2 }}>ลบสินค้า</Button>
                </DialogActions>
            </Dialog>

            {/* Image Delete Confirm */}
            <Dialog open={imageDeleteConfirm.open} onClose={() => setImageDeleteConfirm({ open: false, type: null, index: -1 })} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', textAlign: 'center', color: '#dc2626' }}>
                    🗑️ ยืนยันลบรูปภาพ
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    {imageDeleteConfirm.previewUrl && (
                        <Box sx={{ width: 150, height: 150, mx: 'auto', mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', position: 'relative' }}>
                            <Image src={imageDeleteConfirm.previewUrl} alt="Delete preview" fill style={{ objectFit: 'cover' }} />
                        </Box>
                    )}
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        {imageDeleteConfirm.type === 'uploaded'
                            ? 'คุณแน่ใจหรือไม่ที่จะลบรูปนี้? (จะลบจาก Server ด้วย)'
                            : 'คุณแน่ใจหรือไม่ที่จะลบรูปนี้?'}
                    </Typography>
                    {imageDeleteConfirm.type === 'uploaded' && (
                        <Typography variant="caption" sx={{ color: '#f59e0b', mt: 1, display: 'block' }}>
                            ⚠️ รูปภาพจะถูกลบจาก folder ถาวร ไม่สามารถกู้คืนได้
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                    <Button
                        onClick={() => setImageDeleteConfirm({ open: false, type: null, index: -1 })}
                        variant="outlined"
                        sx={{ borderRadius: 2, fontFamily: 'var(--font-prompt)' }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDeleteImage}
                        sx={{ borderRadius: 2, fontFamily: 'var(--font-prompt)' }}
                    >
                        ลบรูปภาพ
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

export default function ProductsPage() {
    return (
        <Suspense fallback={<CircularProgress />}>
            <ProductsContent />
        </Suspense>
    );
}
