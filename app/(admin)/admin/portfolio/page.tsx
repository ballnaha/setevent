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
    Stack,
    CircularProgress,
    Avatar,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Tabs,
    Tab
} from "@mui/material";
import { Add, Edit, Trash, Gallery, CloseCircle, Eye, Heart } from "iconsax-react";

// Portfolio interface aligned with Schema
interface Portfolio {
    id: string;
    title: string;
    category: string;
    image: string | null;
    description: string | null;
    likes: number;
    views: number;
    status: string;
    createdAt: string;
}

// Default categories for portfolio (can be extended by custom categories from DB)
const DEFAULT_CATEGORIES = [
    "Marketing Event",
    "Seminar & Conference",
    "Exhibition",
    "Concert",
    "Wedding",
    "Fixed Installation",
];

export default function PortfolioAdminPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("All");
    const [customCategory, setCustomCategory] = useState<string>("");
    const [showCustomInput, setShowCustomInput] = useState(false);

    // Delete Confirmation State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        category: DEFAULT_CATEGORIES[0],
        image: "",
        description: "",
        status: "active"
    });

    // Get all unique categories from portfolios + default categories
    const allCategories = React.useMemo(() => {
        const categoriesFromData = portfolios.map(p => p.category);
        const uniqueCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...categoriesFromData]));
        return uniqueCategories.sort();
    }, [portfolios]);

    useEffect(() => {
        fetchPortfolios();
    }, []);

    // Reset activeTab to "All" if current tab is not in allCategories
    useEffect(() => {
        if (activeTab !== "All" && !allCategories.includes(activeTab)) {
            setActiveTab("All");
        }
    }, [activeTab, allCategories]);

    const fetchPortfolios = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/portfolios");
            if (res.ok) {
                const data = await res.json();
                setPortfolios(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (portfolio?: Portfolio) => {
        if (portfolio) {
            setEditId(portfolio.id);
            setFormData({
                title: portfolio.title,
                category: portfolio.category,
                image: portfolio.image || "",
                description: portfolio.description || "",
                status: portfolio.status
            });
            if (portfolio.image) {
                setPreviewUrl(portfolio.image);
            }
        } else {
            setEditId(null);
            setFormData({
                title: "",
                category: DEFAULT_CATEGORIES[0],
                image: "",
                description: "",
                status: "active"
            });
        }
        setCustomCategory("");
        setShowCustomInput(false);
        // Reset file selection
        setSelectedFile(null);
        if (!editId) {
            setPreviewUrl(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPreviewUrl(null);
        setSelectedFile(null);
    };

    // Handle file selection - just store file and show preview
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        // Create local preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleSubmit = async () => {
        setUploading(true);
        try {
            let imageUrl = formData.image;

            // Upload file first if selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);
                uploadFormData.append("folder", "portfolio");

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData
                });
                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                    imageUrl = uploadData.url;
                }
            }

            const payload = {
                ...formData,
                image: imageUrl
            };

            const method = editId ? "PUT" : "POST";
            const url = editId ? `/api/admin/portfolios/${editId}` : "/api/admin/portfolios";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchPortfolios();
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
            await fetch(`/api/admin/portfolios/${deleteId}`, { method: "DELETE" });
            fetchPortfolios();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
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

    // Filter portfolios by category tab
    const filteredPortfolios = activeTab === "All"
        ? portfolios
        : portfolios.filter(p => p.category === activeTab);

    // Count by category
    const getCategoryCount = (cat: string) => {
        if (cat === "All") return portfolios.length;
        return portfolios.filter(p => p.category === cat).length;
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                    Manage Portfolio
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add size="20" color="white" />}
                    onClick={() => handleOpen()}
                    sx={{ fontFamily: 'var(--font-prompt)', bgcolor: 'var(--primary)' }}
                >
                    Add Portfolio
                </Button>
            </Stack>

            {/* Category Tabs */}
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            fontFamily: 'var(--font-prompt)',
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 2
                        }
                    }}
                >
                    <Tab value="All" label={`All (${getCategoryCount("All")})`} />
                    {allCategories.map(cat => (
                        <Tab key={cat} value={cat} label={`${cat} (${getCategoryCount(cat)})`} />
                    ))}
                </Tabs>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="center">Likes</TableCell>
                                <TableCell align="center">Views</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : filteredPortfolios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <Gallery size="48" color="rgba(0,0,0,0.2)" variant="Bulk" />
                                            <Typography>No portfolio items found</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPortfolios.map((portfolio) => (
                                    <TableRow key={portfolio.id} hover>
                                        <TableCell>
                                            <Avatar
                                                src={portfolio.image || undefined}
                                                variant="rounded"
                                                sx={{ width: 80, height: 60 }}
                                            >
                                                <Gallery size="24" color="rgba(0,0,0,0.3)" />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500 }}>
                                            {portfolio.title}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={portfolio.category}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(10, 92, 90, 0.1)',
                                                    color: 'var(--primary)',
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                                <Heart size="14" color="#ef4444" variant="Bold" />
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem' }}>
                                                    {portfolio.likes}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                                <Eye size="14" color="#6b7280" />
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem' }}>
                                                    {portfolio.views}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={portfolio.status}
                                                color={portfolio.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(portfolio)}>
                                                <Edit size="18" color="#3b82f6" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(portfolio.id)}>
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
                    {editId ? "Edit Portfolio" : "Add New Portfolio"}
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
                                        <Gallery size="48" variant="Bulk" />
                                        <Typography variant="body2" sx={{ mt: 1, fontFamily: 'var(--font-prompt)' }}>
                                            คลิกเพื่ออัพโหลดรูปภาพ
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            แนะนำ 800x600px หรือใหญ่กว่า
                                        </Typography>
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
                        </Box>

                        {/* Fields Column */}
                        <Box>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    InputProps={{
                                        sx: { fontFamily: 'var(--font-prompt)' }
                                    }}
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={showCustomInput ? "__custom__" : formData.category}
                                        label="Category"
                                        onChange={handleCategoryChange}
                                    >
                                        {allCategories.map(cat => (
                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                        ))}
                                        <MenuItem value="__custom__" sx={{ borderTop: '1px solid #eee', mt: 1, pt: 1.5, fontStyle: 'italic', color: 'var(--primary)' }}>
                                            + เพิ่มหมวดหมู่ใหม่...
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                {showCustomInput && (
                                    <TextField
                                        label="Custom Category"
                                        fullWidth
                                        required
                                        value={customCategory}
                                        onChange={(e) => handleCustomCategoryChange(e.target.value)}
                                        placeholder="พิมพ์ชื่อหมวดหมู่ใหม่"
                                        autoFocus
                                    />
                                )}
                                <TextField
                                    label="Description (optional)"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={uploading || !formData.title}
                    >
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
                        คุณต้องการลบ portfolio นี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
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
