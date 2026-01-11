"use client";

import React, { useEffect, useState } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Stack,
    CircularProgress,
    Avatar
} from "@mui/material";
import { Add, Edit, Trash, Gallery, CloseCircle } from "iconsax-react";
import Image from "next/image";

// Interface aligned with Schema
interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    price: string;
    period: string;
    features: string; // JSON string from DB
    status: string;
    createdAt: string;
}

interface Feature {
    label: string;
    value: string;
}

export default function PromotionsAdminPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Delete Confirmation State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        price: "",
        period: "",
        status: "active"
    });
    const [features, setFeatures] = useState<Feature[]>([{ label: "", value: "" }]);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/promotions");
            if (res.ok) {
                const data = await res.json();
                setPromotions(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (promo?: Promotion) => {
        if (promo) {
            setEditId(promo.id);
            setFormData({
                title: promo.title,
                description: promo.description,
                image: promo.image,
                price: promo.price || "",
                period: promo.period || "",
                status: promo.status
            });
            try {
                setFeatures(promo.features ? JSON.parse(promo.features) : [{ label: "", value: "" }]);
            } catch {
                setFeatures([{ label: "", value: "" }]);
            }
        } else {
            setEditId(null);
            setFormData({
                title: "",
                description: "",
                image: "",
                price: "",
                period: "",
                status: "active"
            });
            setFeatures([{ label: "", value: "" }]);
        }
        // Reset file selection
        setSelectedFile(null);
        setPreviewUrl(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    // Handle file selection - just store file and show preview
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        // Create local preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
    };

    const addFeature = () => {
        setFeatures([...features, { label: "", value: "" }]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
    };

    const handleSubmit = async () => {
        setUploading(true);
        try {
            let imageUrl = formData.image;

            // Upload file first if selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);
                uploadFormData.append("folder", "promotions");

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData
                });
                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                    imageUrl = uploadData.url;
                }
            }

            // Filter empty features
            const validFeatures = features.filter(f => f.label && f.value);

            const payload = {
                ...formData,
                image: imageUrl,
                features: validFeatures
            };

            const method = editId ? "PUT" : "POST";
            const url = editId ? `/api/admin/promotions/${editId}` : "/api/admin/promotions";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchPromotions();
                handleClose();
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await fetch(`/api/admin/promotions/${deleteId}`, { method: "DELETE" });
            fetchPromotions();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                    Manage Promotions
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add size="20" color="white" />}
                    onClick={() => handleOpen()}
                    sx={{ fontFamily: 'var(--font-prompt)', bgcolor: 'var(--primary)' }}
                >
                    Add Promotion
                </Button>
            </Stack>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Period</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : promotions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                        No promotions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                promotions.map((promo) => (
                                    <TableRow key={promo.id} hover>
                                        <TableCell>
                                            <Avatar
                                                src={promo.image}
                                                variant="rounded"
                                                sx={{ width: 60, height: 40 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500 }}>
                                            {promo.title}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {promo.price}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {promo.period}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={promo.status}
                                                color={promo.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(promo)}>
                                                <Edit size="18" color="#3b82f6" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(promo.id)}>
                                                <Trash size="18" color="#ef4444" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)' }}>
                    {editId ? "Edit Promotion" : "Add New Promotion"}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, pt: 1 }}>
                        {/* Image Upload Column */}
                        <Box>
                            <Box sx={{
                                width: '100%',
                                height: 300,
                                bgcolor: '#f5f5f5',
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #e0e0e0'
                            }}>
                                {(previewUrl || formData.image) ? (
                                    <>
                                        <img
                                            src={previewUrl || formData.image}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        {/* Delete Image Button */}
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewUrl(null);
                                                setSelectedFile(null);
                                                setFormData(prev => ({ ...prev, image: "" }));
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'rgba(220,38,38,0.9)' }
                                            }}
                                            size="small"
                                        >
                                            <CloseCircle size="18" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                        <Gallery size="32" variant="Bulk" />
                                        <Typography variant="caption" display="block">คลิกเพื่ออัพโหลดรูปภาพ</Typography>
                                    </Box>
                                )}
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={handleFileSelect}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                />
                                {uploading && (
                                    <Box sx={{
                                        position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.8)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                แนะนำขนาด 600x800px หรือใหญ่กว่า (แนวตั้ง)
                            </Typography>
                        </Box>

                        {/* Fields Column */}
                        <Box>
                            <Stack spacing={2}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <TextField
                                    label="Price (e.g., ฿59,000)"
                                    fullWidth
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                <TextField
                                    label="Period (e.g., Jan - Mar 2026)"
                                    fullWidth
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                />
                                <TextField
                                    select
                                    label="Status"
                                    fullWidth
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </TextField>
                            </Stack>
                        </Box>

                        {/* Full Width Description */}
                        <Box sx={{ gridColumn: { xs: '1fr', md: 'span 2' } }}>
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Box>

                        {/* Full Width Features */}
                        <Box sx={{ gridColumn: { xs: '1fr', md: 'span 2' } }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Features (e.g., Guests: Up to 200)</Typography>
                            {features.map((feature, idx) => (
                                <Stack key={idx} direction="row" spacing={2} sx={{ mb: 1 }}>
                                    <TextField
                                        placeholder="Label (e.g. Guests)"
                                        size="small"
                                        sx={{ width: '40%' }}
                                        value={feature.label}
                                        onChange={(e) => handleFeatureChange(idx, 'label', e.target.value)}
                                    />
                                    <TextField
                                        placeholder="Value (e.g. Up to 200)"
                                        size="small"
                                        fullWidth
                                        value={feature.value}
                                        onChange={(e) => handleFeatureChange(idx, 'value', e.target.value)}
                                    />
                                    <IconButton onClick={() => removeFeature(idx)} disabled={features.length === 1}>
                                        <CloseCircle size="20" color={features.length === 1 ? "#ccc" : "#ef4444"} />
                                    </IconButton>
                                </Stack>
                            ))}
                            <Button startIcon={<Add size="16" color="var(--primary)" />} onClick={addFeature} size="small" sx={{ color: 'var(--primary)' }}>
                                Add Feature
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={uploading}>
                        {uploading ? <CircularProgress size={20} color="inherit" /> : (editId ? "Update" : "Create")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                    ยืนยันการลบ
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณต้องการลบโปรโมชั่นนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        color="inherit"
                        disabled={deleting}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Trash size="16" color="white" />}
                    >
                        {deleting ? "กำลังลบ..." : "ลบ"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
