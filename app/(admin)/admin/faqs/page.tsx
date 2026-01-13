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
} from "@mui/material";
import { Add, Edit, Trash } from "iconsax-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    status: string;
    order: number;
}

const defaultCategories = ["ทั่วไป", "บริการ", "จอ LED", "การจองและราคา", "การชำระเงิน", "การติดตั้ง"];

function SortableRow({ faq, onEdit, onDelete }: {
    faq: FAQ;
    onEdit: (f: FAQ) => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: faq.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? '#f0f9ff' : 'inherit',
    };

    return (
        <TableRow ref={setNodeRef} style={style} hover>
            <TableCell {...attributes} {...listeners} sx={{ cursor: 'grab', width: 50 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3, color: '#94a3b8' }}>
                    <Box sx={{ width: 16, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
                    <Box sx={{ width: 16, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
                    <Box sx={{ width: 16, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
                </Box>
            </TableCell>
            <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500, maxWidth: 300 }}>
                <Typography noWrap sx={{ fontFamily: 'var(--font-prompt)' }}>{faq.question}</Typography>
            </TableCell>
            <TableCell>
                <Chip label={faq.category} size="small" sx={{ fontFamily: 'var(--font-prompt)', bgcolor: '#EFF6FF', color: '#3B82F6' }} />
            </TableCell>
            <TableCell>
                <Chip label={faq.status === 'active' ? 'เผยแพร่' : 'ซ่อน'} color={faq.status === 'active' ? 'success' : 'default'} size="small" />
            </TableCell>
            <TableCell align="right">
                <IconButton onClick={() => onEdit(faq)}><Edit size="18" color="#3b82f6" /></IconButton>
                <IconButton onClick={() => onDelete(faq.id)}><Trash size="18" color="#ef4444" /></IconButton>
            </TableCell>
        </TableRow>
    );
}

export default function FAQAdminPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [reordering, setReordering] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "ทั่วไป",
        status: "active"
    });

    const uniqueCategories = [...new Set([...defaultCategories, ...faqs.map(f => f.category)])];

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => { fetchFAQs(); }, []);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/faqs");
            if (res.ok) setFaqs(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setReordering(true);
            const oldIndex = faqs.findIndex((f) => f.id === active.id);
            const newIndex = faqs.findIndex((f) => f.id === over.id);
            const newOrder = arrayMove(faqs, oldIndex, newIndex);
            setFaqs(newOrder);

            try {
                await fetch("/api/admin/faqs/reorder", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderedIds: newOrder.map(f => f.id) })
                });
            } catch (error) {
                console.error("Failed to save order:", error);
                fetchFAQs();
            } finally {
                setReordering(false);
            }
        }
    };

    const handleOpen = (faq?: FAQ) => {
        if (faq) {
            setEditId(faq.id);
            setFormData({
                question: faq.question,
                answer: faq.answer,
                category: faq.category,
                status: faq.status
            });
        } else {
            setEditId(null);
            setFormData({ question: "", answer: "", category: "ทั่วไป", status: "active" });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const url = editId ? `/api/admin/faqs/${editId}` : "/api/admin/faqs";
            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) { fetchFAQs(); handleClose(); }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => { setDeleteId(id); setDeleteDialogOpen(true); };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await fetch(`/api/admin/faqs/${deleteId}`, { method: "DELETE" });
            fetchFAQs();
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                        Manage FAQs
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        จัดการคำถามที่พบบ่อย ลากเพื่อจัดลำดับ
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    {reordering && <CircularProgress size={20} />}
                    <Button
                        variant="contained"
                        startIcon={<Add size="20" color="white" />}
                        onClick={() => handleOpen()}
                        sx={{ fontFamily: 'var(--font-prompt)', bgcolor: 'var(--primary)' }}
                    >
                        เพิ่ม FAQ
                    </Button>
                </Stack>
            </Stack>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell sx={{ width: 50 }}></TableCell>
                                    <TableCell>คำถาม</TableCell>
                                    <TableCell>หมวดหมู่</TableCell>
                                    <TableCell>สถานะ</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : faqs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                            ยังไม่มี FAQ
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <SortableContext items={faqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                        {faqs.map((faq) => (
                                            <SortableRow key={faq.id} faq={faq} onEdit={handleOpen} onDelete={handleDeleteClick} />
                                        ))}
                                    </SortableContext>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </DndContext>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)' }}>
                    {editId ? "แก้ไข FAQ" : "เพิ่ม FAQ ใหม่"}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <TextField
                            label="คำถาม"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        />
                        <TextField
                            label="คำตอบ"
                            fullWidth
                            multiline
                            rows={6}
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            helperText="ใช้ • หรือ - สำหรับ bullet list, ใช้ Enter สำหรับขึ้นบรรทัดใหม่"
                        />
                        <Stack direction="row" spacing={2}>
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
                                <MenuItem value="active">เผยแพร่</MenuItem>
                                <MenuItem value="inactive">ซ่อน</MenuItem>
                            </TextField>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">ยกเลิก</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving || !formData.question || !formData.answer}>
                        {saving ? <CircularProgress size={20} color="inherit" /> : (editId ? "บันทึก" : "สร้าง")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณต้องการลบ FAQ นี้หรือไม่?
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
        </Box>
    );
}
