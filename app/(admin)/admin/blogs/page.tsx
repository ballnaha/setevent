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
    MenuItem,
    Autocomplete,
    Avatar,
} from "@mui/material";
import { Add, Edit, Trash, Eye, Gallery, Image as ImageIcon, CloseCircle } from "iconsax-react";

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    coverImage: string | null;
    author: string;
    category: string;
    status: string;
    views: number;
    publishedAt: string | null;
    createdAt: string;
}

const defaultCategories = ["General", "Inspiration", "Knowledge", "Technical Guide", "Trends", "Guides"];

export default function BlogsAdminPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Image Delete State (Delete on Save pattern)
    const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false);
    const [deletingImage, setDeletingImage] = useState(false);
    const [pendingDeleteImage, setPendingDeleteImage] = useState<string | null>(null);

    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        author: "Admin",
        category: "General",
        status: "draft"
    });

    const uniqueCategories = [...new Set([...defaultCategories, ...blogs.map(b => b.category)])];

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/blogs");
            if (res.ok) setBlogs(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (blog?: Blog) => {
        if (blog) {
            setEditId(blog.id);
            setFormData({
                title: blog.title,
                slug: blog.slug,
                excerpt: blog.excerpt || "",
                content: blog.content || "",
                coverImage: blog.coverImage || "",
                author: blog.author || "Admin",
                category: blog.category || "General",
                status: blog.status
            });
            if (blog.coverImage) {
                setPreviewUrl(blog.coverImage);
            }
        } else {
            setEditId(null);
            setFormData({
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                coverImage: "",
                author: "Admin",
                category: "General",
                status: "draft"
            });
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setPendingDeleteImage(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        setPendingDeleteImage(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // If replacing an existing image, mark it for deletion on save
        if (formData.coverImage && !pendingDeleteImage) {
            setPendingDeleteImage(formData.coverImage);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, coverImage: "" }));
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

    const handleSubmit = async () => {
        setSaving(true);
        setUploading(true);
        try {
            // Delete pending image file first (if user removed/replaced the old image)
            if (pendingDeleteImage) {
                await deleteFile(pendingDeleteImage);
                setPendingDeleteImage(null);
            }

            let imageUrl = formData.coverImage;

            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);
                uploadFormData.append("folder", "blogs");

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
                coverImage: imageUrl
            };

            const url = editId ? `/api/admin/blogs/${editId}` : "/api/admin/blogs";
            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) { fetchBlogs(); handleClose(); }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const handleDeleteClick = (id: string) => { setDeleteId(id); setDeleteDialogOpen(true); };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const blog = blogs.find(b => b.id === deleteId);
            if (blog?.coverImage) {
                await deleteFile(blog.coverImage);
            }
            await fetch(`/api/admin/blogs/${deleteId}`, { method: "DELETE" });
            fetchBlogs();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const handleDeleteImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDeleteImageDialogOpen(true);
    };

    const handleDeleteImageConfirm = async () => {
        setDeletingImage(true);
        try {
            if (formData.coverImage) {
                setPendingDeleteImage(formData.coverImage);
            }
            setPreviewUrl(null);
            setSelectedFile(null);
            setFormData(prev => ({ ...prev, coverImage: "" }));
        } finally {
            setDeletingImage(false);
            setDeleteImageDialogOpen(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9ก-๙\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                        Manage Blogs
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        จัดการบทความและเนื้อหา
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add size="20" color="white" />}
                    onClick={() => handleOpen()}
                    sx={{ fontFamily: 'var(--font-prompt)', bgcolor: 'var(--primary)' }}
                >
                    เพิ่มบทความ
                </Button>
            </Stack>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ width: 60 }}></TableCell>
                                <TableCell>หัวข้อ</TableCell>
                                <TableCell>หมวดหมู่</TableCell>
                                <TableCell>ผู้เขียน</TableCell>
                                <TableCell>สถานะ</TableCell>
                                <TableCell>Views</TableCell>
                                <TableCell>วันที่เผยแพร่</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                        ยังไม่มีบทความ
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id} hover>
                                        <TableCell>
                                            {blog.coverImage ? (
                                                <Avatar
                                                    variant="rounded"
                                                    src={blog.coverImage}
                                                    sx={{ width: 48, height: 48 }}
                                                />
                                            ) : (
                                                <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: '#f1f5f9' }}>
                                                    <ImageIcon size="20" color="#94a3b8" />
                                                </Avatar>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500, maxWidth: 300 }}>
                                            <Typography noWrap sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                                                {blog.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                /{blog.slug}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={blog.category}
                                                size="small"
                                                sx={{ fontFamily: 'var(--font-prompt)', bgcolor: '#EFF6FF', color: '#3B82F6' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {blog.author}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={blog.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
                                                color={blog.status === 'published' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Eye size="16" color="#94a3b8" />
                                                <Typography variant="body2">{blog.views.toLocaleString()}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)' }}>
                                            {formatDate(blog.publishedAt)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                component="a"
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                            >
                                                <Eye size="18" color="#10b981" />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpen(blog)}>
                                                <Edit size="18" color="#3b82f6" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(blog.id)}>
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
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)' }}>
                    {editId ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="หัวข้อบทความ"
                                fullWidth
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    setFormData({
                                        ...formData,
                                        title,
                                        slug: formData.slug || generateSlug(title)
                                    });
                                }}
                            />
                            <TextField
                                label="Slug (URL)"
                                fullWidth
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                helperText="ใช้สำหรับ URL เช่น /blog/my-article"
                            />
                        </Stack>

                        <TextField
                            label="บทคัดย่อ"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            helperText="ข้อความสั้นๆ สำหรับแสดงในหน้ารายการบทความ"
                        />

                        <TextField
                            label="เนื้อหาบทความ (HTML)"
                            fullWidth
                            multiline
                            rows={12}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            helperText="รองรับ HTML เช่น <p>, <h2>, <ul>, <li>, <img>, <blockquote>"
                        />

                        <Box>
                            <Typography variant="body2" sx={{ mb: 1, fontFamily: 'var(--font-prompt)' }}>รูปภาพปก</Typography>
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
                                {(previewUrl || formData.coverImage) ? (
                                    <>
                                        <img
                                            src={previewUrl || formData.coverImage}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <IconButton
                                            onClick={handleDeleteImageClick}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 10,
                                                bgcolor: 'white',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                '&:hover': { bgcolor: '#f5f5f5' }
                                            }}
                                            size="small"
                                        >
                                            <CloseCircle size="20" color="#ef4444" variant="Bold" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                        <Gallery size="48" variant="Bulk" />
                                        <Typography variant="body2" sx={{ mt: 1, fontFamily: 'var(--font-prompt)' }}>
                                            คลิกเพื่ออัพโหลดรูปภาพ
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            แนะนำ 800x600px หรือใหญ่กว่า (จะถูก resize auto)
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

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="ผู้เขียน"
                                fullWidth
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            />
                            <Autocomplete
                                freeSolo
                                options={uniqueCategories}
                                value={formData.category}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, category: newValue || "" });
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setFormData({ ...formData, category: newInputValue });
                                }}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField {...params} label="หมวดหมู่" />
                                )}
                            />
                            <TextField
                                select
                                label="สถานะ"
                                fullWidth
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="draft">แบบร่าง</MenuItem>
                                <MenuItem value="published">เผยแพร่</MenuItem>
                            </TextField>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">ยกเลิก</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={saving || !formData.title}
                    >
                        {saving ? <CircularProgress size={20} color="inherit" /> : (editId ? "บันทึก" : "สร้าง")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณต้องการลบบทความนี้หรือไม่?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={deleting}>ยกเลิก</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Trash size="16" color="white" />}>
                        {deleting ? "กำลังลบ..." : "ลบ"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Image Confirmation Dialog */}
            <Dialog open={deleteImageDialogOpen} onClose={() => setDeleteImageDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ยืนยันการลบรูปภาพ</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณต้องการลบรูปภาพนี้ใช่หรือไม่? รูปภาพจะถูกลบเมื่อกดบันทึก
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteImageDialogOpen(false)} color="inherit" disabled={deletingImage}>ยกเลิก</Button>
                    <Button onClick={handleDeleteImageConfirm} variant="contained" color="error" disabled={deletingImage}
                        startIcon={deletingImage ? <CircularProgress size={16} color="inherit" /> : <Trash size="16" color="white" />}>
                        {deletingImage ? "กำลังลบ..." : "ลบ"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
