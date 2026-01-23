"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Stack,
    CircularProgress,
    Avatar,
    Divider,
    FormControlLabel,
    Switch,
    MenuItem,
    Snackbar,
    Alert,
    Tooltip
} from "@mui/material";
import { Add, Edit, Trash, Heart, Gallery, Save2, CloseCircle, DirectDown, ArrowUp, ArrowDown, Image as ImageIcon } from "iconsax-react";

export default function ValentineProductsAdmin() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("All");
    const [customCategory, setCustomCategory] = useState<string>("");
    const [showCustomInput, setShowCustomInput] = useState(false);

    // Confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
        loading?: boolean;
    }>({
        title: "",
        message: "",
        onConfirm: () => { },
    });
    const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());
    const [removedImages, setRemovedImages] = useState<string[]>([]);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
        open: false,
        message: "",
        severity: "success"
    });

    const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "กุหลาบ",
        price: "",
        originalPrice: "",
        description: "",
        image: "",
        isHot: false,
        isNew: false,
        status: "active",
        order: 0,
        images: [] as any[]
    });

    // Derive categories from product data
    const allCategories = React.useMemo(() => {
        const categoriesFromData = products.map(p => p.category);
        const uniqueCategories = Array.from(new Set(categoriesFromData)).filter(c => c && c !== "General");
        // Always include some defaults if you want, or just be fully dynamic
        const defaults = ["กุหลาบ", "ลิลลี่", "ทานตะวัน", "ช่อพิเศษ"];
        const combined = Array.from(new Set([...defaults, ...uniqueCategories]));
        return combined.sort();
    }, [products]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/valentine-products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            showSnackbar("Failed to fetch products", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (product?: any) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price.toString(),
                originalPrice: product.originalPrice?.toString() || "",
                description: product.description || "",
                image: product.image || "",
                isHot: product.isHot,
                isNew: product.isNew,
                status: product.status,
                order: product.order,
                images: product.images || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                category: allCategories.length > 0 ? allCategories[0] : "กุหลาบ",
                price: "",
                originalPrice: "",
                description: "",
                image: "",
                isHot: false,
                isNew: false,
                status: "active",
                order: products.length,
                images: []
            });
        }
        setCustomCategory("");
        setShowCustomInput(false);
        setPendingFiles(new Map());
        setRemovedImages([]);
        setDialogOpen(true);
    };

    const handleCategoryChange = (event: any) => {
        const value = event.target.value;
        if (value === "__custom__") {
            setShowCustomInput(true);
            setFormData({ ...formData, category: "" });
        } else {
            setShowCustomInput(false);
            setCustomCategory("");
            setFormData({ ...formData, category: value });
        }
    };

    const handleCustomCategoryChange = (value: string) => {
        setCustomCategory(value);
        setFormData({ ...formData, category: value });
    };

    const handleCloseDialog = () => {
        pendingFiles.forEach((_, blob) => URL.revokeObjectURL(blob));
        setPendingFiles(new Map());
        setRemovedImages([]);
        setDialogOpen(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e: any) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const deleteFile = async (url: string) => {
        if (!url || url.startsWith('blob:')) return;
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newPendingFiles = new Map(pendingFiles);
        const newUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const blobUrl = URL.createObjectURL(files[i]);
            newPendingFiles.set(blobUrl, files[i]);
            newUrls.push(blobUrl);
        }

        setPendingFiles(newPendingFiles);

        if (isMainImage) {
            // Track old image if it was a real URL
            if (formData.image && !formData.image.startsWith('blob:')) {
                setRemovedImages(prev => [...prev, formData.image]);
            }
            setFormData(prev => ({ ...prev, image: newUrls[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                images: [
                    ...prev.images,
                    ...newUrls.map((url, idx) => ({ url, order: prev.images.length + idx }))
                ]
            }));
        }
    };

    const handleRemoveImage = (index: number) => {
        const imageUrl = formData.images[index].url;

        setConfirmConfig({
            title: "ยืนยันการลบรูปภาพ",
            message: "คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?",
            onConfirm: () => {
                // If it's a real URL, track for deletion
                if (imageUrl && !imageUrl.startsWith('blob:')) {
                    setRemovedImages(prev => [...prev, imageUrl]);
                }

                // If it's a blob, clean up the pending file
                if (imageUrl.startsWith('blob:')) {
                    const newPending = new Map(pendingFiles);
                    newPending.delete(imageUrl);
                    setPendingFiles(newPending);
                    URL.revokeObjectURL(imageUrl);
                }

                setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index)
                }));
                setConfirmOpen(false);
            }
        });
        setConfirmOpen(true);
    };

    const uploadSingleFile = async (file: File) => {
        const fData = new FormData();
        fData.append("file", file);
        fData.append("folder", "valentine-catalog");

        const res = await fetch("/api/upload", {
            method: "POST",
            body: fData
        });
        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price) {
            showSnackbar("Please fill name and price", "warning");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Process Main Image Upload if needed
            let finalMainImage = formData.image;
            if (formData.image && formData.image.startsWith('blob:')) {
                const file = pendingFiles.get(formData.image);
                if (file) {
                    finalMainImage = await uploadSingleFile(file);
                }
            }

            // 2. Process Gallery Uploads if needed
            const finalGalleryImages = await Promise.all(
                formData.images.map(async (img) => {
                    if (img.url.startsWith('blob:')) {
                        const file = pendingFiles.get(img.url);
                        if (file) {
                            const realUrl = await uploadSingleFile(file);
                            return { ...img, url: realUrl };
                        }
                    }
                    return img;
                })
            );

            // 3. Delete removed images from server
            for (const url of removedImages) {
                await deleteFile(url);
            }

            // 4. Submit to Database
            const url = editingProduct
                ? `/api/admin/valentine-products/${editingProduct.id}`
                : "/api/admin/valentine-products";
            const method = editingProduct ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    image: finalMainImage,
                    images: finalGalleryImages,
                    price: parseFloat(formData.price),
                    originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                    order: parseInt(formData.order.toString())
                })
            });

            if (res.ok) {
                showSnackbar(editingProduct ? "Updated successfully" : "Created successfully", "success");
                // Clear blob URLs
                pendingFiles.forEach((_, blob) => URL.revokeObjectURL(blob));
                handleCloseDialog();
                fetchProducts();
            } else {
                showSnackbar("Failed to save product", "error");
            }
        } catch (error) {
            console.error(error);
            showSnackbar("Error occurred during upload or save", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setConfirmConfig({
            title: "ยืนยันการลบสินค้า",
            message: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? ข้อมูลและรูปภาพทั้งหมดจะถูกลบออกจากระบบและไม่สามารถกู้คืนได้",
            onConfirm: async () => {
                setConfirmConfig(prev => ({ ...prev, loading: true }));
                try {
                    const product = products.find(p => p.id === id);

                    // 1. Delete Product Record
                    const res = await fetch(`/api/admin/valentine-products/${id}`, {
                        method: "DELETE"
                    });

                    if (res.ok) {
                        // 2. If record deleted, cleanup its files
                        if (product) {
                            if (product.image) await deleteFile(product.image);
                            if (product.images && Array.isArray(product.images)) {
                                for (const img of product.images) {
                                    await deleteFile(img.url);
                                }
                            }
                        }

                        showSnackbar("ลบสินค้าเรียบร้อยแล้ว", "success");
                        fetchProducts();
                        setConfirmOpen(false);
                    } else {
                        showSnackbar("ลบสินค้าไม่สำเร็จ", "error");
                    }
                } catch (error) {
                    showSnackbar("เกิดข้อผิดพลาดในการลบสินค้า", "error");
                } finally {
                    setConfirmConfig(prev => ({ ...prev, loading: false }));
                }
            }
        });
        setConfirmOpen(true);
    };

    // Filter products by tab
    const filteredProducts = activeTab === "All"
        ? products
        : products.filter(p => p.category === activeTab);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)' }}>
                    Valentine Catalog Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: '12px', bgcolor: '#0A5C5A', '&:hover': { bgcolor: '#084846' }, py: 1.2, px: 3 }}
                >
                    เพิ่มสินค้าใหม่
                </Button>
            </Box>

            {/* Category Tabs */}
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTabs-indicator': { bgcolor: '#0A5C5A' },
                        '& .MuiTab-root': {
                            fontFamily: 'var(--font-prompt)',
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 3,
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: 'text.secondary',
                            '&.Mui-selected': { color: '#0A5C5A' }
                        }
                    }}
                >
                    <Tab value="All" label={`ทั้งหมด (${products.length})`} />
                    {allCategories.map(cat => (
                        <Tab
                            key={cat}
                            value={cat}
                            label={`${cat} (${products.filter(p => p.category === cat).length})`}
                        />
                    ))}
                </Tabs>
            </Box>

            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>สินค้า</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>หมวดหมู่</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>ราคา</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>สถานะ</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>ลำดับ</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>จัดการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" padding="normal">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        ไม่พบข้อมูล
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar
                                                    src={product.image}
                                                    variant="rounded"
                                                    sx={{ width: 48, height: 48, bgcolor: '#f0f0f0' }}
                                                >
                                                    <ImageIcon size={20} color="#999" />
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</Typography>
                                                    <Box display="flex" gap={0.5}>
                                                        {product.isHot && <Chip label="HOT" size="small" color="error" sx={{ height: 18, fontSize: '0.65rem' }} />}
                                                        {product.isNew && <Chip label="NEW" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 700 }}>฿{product.price.toLocaleString()}</Typography>
                                            {product.originalPrice && (
                                                <Typography sx={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#999' }}>
                                                    ฿{product.originalPrice.toLocaleString()}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.status === 'active' ? 'Active' : 'Inactive'}
                                                color={product.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{product.order}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton size="small" color="primary" onClick={() => handleOpenDialog(product)} sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                                                    <Edit size={18} variant="Bold" color="#1976d2" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(product.id)} sx={{ bgcolor: 'rgba(211, 47, 47, 0.04)' }}>
                                                    <Trash size={18} variant="Bold" color="#d32f2f" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit/Add Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4, pt: 1 }}>
                        {/* Details Column */}
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="ชื่อสินค้า"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                select
                                label="หมวดหมู่"
                                name="category"
                                value={showCustomInput ? "__custom__" : formData.category}
                                onChange={handleCategoryChange}
                            >
                                {allCategories.map((cat: string) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                                <MenuItem value="__custom__" sx={{ borderTop: '1px solid #eee', mt: 1, pt: 1.5, fontStyle: 'italic', color: '#0A5C5A' }}>
                                    + เพิ่มหมวดหมู่ใหม่...
                                </MenuItem>
                            </TextField>
                            {showCustomInput && (
                                <TextField
                                    label="ชื่อหมวดหมู่ใหม่"
                                    fullWidth
                                    required
                                    value={customCategory}
                                    onChange={(e) => handleCustomCategoryChange(e.target.value)}
                                    placeholder="พิมพ์ชื่อหมวดหมู่ที่ต้องการ"
                                    autoFocus
                                />
                            )}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="ราคาปกติ (฿)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    label="ราคาตั้งต้น (สำหรับลดราคา)"
                                    name="originalPrice"
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="คำอธิบายสินค้า"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
                                <FormControlLabel
                                    control={<Switch checked={formData.isHot} onChange={handleInputChange} name="isHot" color="error" />}
                                    label="สินค้า HOT"
                                />
                                <FormControlLabel
                                    control={<Switch checked={formData.isNew} onChange={handleInputChange} name="isNew" color="primary" />}
                                    label="สินค้าใหม่"
                                />
                                <FormControlLabel
                                    control={<Switch checked={formData.status === 'active'} onChange={(e) => setFormData(p => ({ ...p, status: e.target.checked ? 'active' : 'inactive' }))} color="success" />}
                                    label="เปิดใช้งาน"
                                />
                            </Stack>
                        </Stack>

                        {/* Images Column */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>หน้าปกสินค้า (Primary Image)</Typography>
                            <Box
                                sx={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    bgcolor: '#f8f8f8',
                                    borderRadius: '16px',
                                    border: '1.5px dashed #ccc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: '#f0f0f0', borderColor: '#0A5C5A' }
                                }}
                                onClick={() => document.getElementById('main-image-upload')?.click()}
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Stack alignItems="center" spacing={1}>
                                        <Gallery size={40} color="#999" />
                                        <Typography variant="body2" color="textSecondary">อัปโหลดรูปหลัก</Typography>
                                    </Stack>
                                )}
                                <input
                                    type="file"
                                    id="main-image-upload"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, true)}
                                />
                            </Box>

                            <Typography variant="subtitle2" sx={{ mt: 4, mb: 1.5, fontWeight: 700 }}>แกลเลอรี (Sub Images)</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                                {formData.images.map((img, idx) => (
                                    <Box key={idx} sx={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                        <img src={img.url} alt={`Gal ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                p: 0.3,
                                                '&:hover': { bgcolor: '#fff' }
                                            }}
                                            onClick={() => handleRemoveImage(idx)}
                                        >
                                            <CloseCircle size={14} color="#f44336" />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Box
                                    sx={{
                                        aspectRatio: '1/1',
                                        bgcolor: '#fff',
                                        borderRadius: '8px',
                                        border: '1.5px dashed #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: '#f8f8f8', borderColor: '#0A5C5A' }
                                    }}
                                    onClick={() => document.getElementById('gallery-upload')?.click()}
                                >
                                    <Add size={24} color="#999" />
                                </Box>
                                <input
                                    type="file"
                                    id="gallery-upload"
                                    multiple
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, false)}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
                    <Button onClick={handleCloseDialog} disabled={submitting} sx={{ borderRadius: '8px' }}>ยกเลิก</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Save2 size={18} variant="Bold" color="#fff" />}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: '#0A5C5A',
                            '&:hover': { bgcolor: '#084846' },
                            px: 3
                        }}
                    >
                        บันทึกข้อมูล
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(p => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={() => !confirmConfig.loading && setConfirmOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '16px', padding: 1, maxWidth: '400px' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{confirmConfig.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{confirmConfig.message}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        disabled={confirmConfig.loading}
                        sx={{ borderRadius: '8px' }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={confirmConfig.onConfirm}
                        disabled={confirmConfig.loading}
                        variant="contained"
                        color="error"
                        startIcon={confirmConfig.loading ? <CircularProgress size={16} color="inherit" /> : <Trash size={18} variant="Bold" color="#fff" />}
                        sx={{ borderRadius: '8px' }}
                    >
                        {confirmConfig.loading ? "กำลังลบ..." : "ยืนยันการลบ"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
