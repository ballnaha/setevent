"use client";

import React, { useEffect, useState, useId } from "react";
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
    Divider,
    Card,
    CardContent,
    CardActions,
    Snackbar,
    Alert,
    AlertColor,
    useTheme,
    useMediaQuery,
    FormControlLabel,
    Switch
} from "@mui/material";
import { Add, Edit, Trash, Heart, Music, Gallery, Play, Save2, CloseCircle, Global, Link as LinkIcon, HambergerMenu } from "iconsax-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface ValentineMemory {
    id?: string;
    localId: string; // Stable ID for DND
    type: string;
    url: string;
    file?: File; // For delayed upload
    previewUrl?: string; // For local preview
    caption: string;
    thumbnail?: string;
    order: number;
    uploading?: boolean;
}

interface ValentineCard {
    id: string;
    slug: string;
    jobName: string | null;
    title: string;
    openingText: string | null;
    greeting: string | null;
    subtitle: string | null;
    message: string | null;
    signer: string | null;
    backgroundColor: string | null;
    backgroundMusicYoutubeId: string | null;
    backgroundMusicUrl: string | null;
    status: string;
    createdAt: string;
    _count?: { memories: number };
}

interface SortableMemoryItemProps {
    id: string;
    memory: ValentineMemory;
    index: number;
    handleRemoveMemory: (index: number) => void;
    handleFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMemoryChange: (index: number, field: keyof ValentineMemory, value: any) => void;
}

const SortableMemoryItem = ({
    id,
    memory,
    index,
    handleRemoveMemory,
    handleFileChange,
    handleMemoryChange
}: SortableMemoryItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            variant="outlined"
            sx={{
                position: 'relative',
                borderRadius: 3,
                transition: 'all 0.2s ease',
                flexShrink: 0,
                width: '100%',
                bgcolor: 'white',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                    borderColor: '#FF3366',
                    transform: isDragging ? undefined : 'translateY(-2px)'
                }
            }}
        >
            {/* Drag Handle */}
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    cursor: 'grab',
                    color: 'text.disabled',
                    '&:hover': { color: '#FF3366' },
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <HambergerMenu size="20" color="currentColor" />
            </Box>

            <IconButton
                size="small"
                onClick={() => handleRemoveMemory(index)}
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    color: '#ef4444',
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': {
                        bgcolor: '#ef4444',
                        color: 'white'
                    },
                    transition: 'all 0.2s',
                    zIndex: 10
                }}
            >
                <Trash size="16" variant="Bulk" color="currentColor" />
            </IconButton>

            <CardContent sx={{ p: '24px !important', pt: '40px !important' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' }, gap: 3 }}>
                    <Box>
                        <Box
                            sx={{
                                width: '100%',
                                height: 140,
                                bgcolor: '#f8f9fa',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '1px solid #eee',
                                position: 'relative',
                                cursor: memory.type === 'image' ? 'pointer' : 'default',
                                '&:hover .upload-overlay': { opacity: 1 }
                            }}
                            onClick={() => {
                                if (memory.type === 'image') {
                                    document.getElementById(`file-input-${index}`)?.click();
                                }
                            }}
                        >
                            {memory.file && (
                                <Chip
                                    label="Pending Save"
                                    size="small"
                                    color="warning"
                                    variant="filled"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 45,
                                        fontSize: '0.65rem',
                                        height: 20,
                                        fontWeight: 700,
                                        zIndex: 10
                                    }}
                                />
                            )}
                            {memory.url || memory.previewUrl ? (
                                memory.type === 'youtube' ? (
                                    <img src={`https://img.youtube.com/vi/${memory.url}/hqdefault.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Youtube" />
                                ) : memory.type === 'tiktok' ? (
                                    <Box sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(45deg, #000 30%, #fe2c55 90%)',
                                        color: 'white'
                                    }}>
                                        <Play size="40" variant="Bulk" />
                                        <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 800, letterSpacing: 1 }}>TIKTOK</Typography>
                                    </Box>
                                ) : (
                                    <img src={memory.previewUrl || memory.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Memory" />
                                )
                            ) : (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Gallery size="24" color="#ccc" />
                                    <Typography variant="caption" sx={{ display: 'block', color: '#ccc' }}>
                                        {memory.type === 'image' ? "Click to Upload" : "No Preview"}
                                    </Typography>
                                </Box>
                            )}

                            {memory.type === 'image' && (
                                <Box
                                    className="upload-overlay"
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        bgcolor: 'rgba(0,0,0,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        color: 'white'
                                    }}
                                >
                                    <Add size="24" />
                                </Box>
                            )}

                            {memory.uploading && (
                                <Box sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: 'rgba(255,255,255,0.7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2
                                }}>
                                    <CircularProgress size={24} color="primary" />
                                </Box>
                            )}

                            <input
                                type="file"
                                id={`file-input-${index}`}
                                hidden
                                accept="image/*"
                                onChange={(e) => handleFileChange(index, e)}
                            />
                        </Box>
                        <TextField
                            size="small"
                            select
                            fullWidth
                            value={memory.type}
                            onChange={(e) => handleMemoryChange(index, 'type', e.target.value)}
                            sx={{ mt: 1.5 }}
                            SelectProps={{ native: true }}
                        >
                            <option value="image">Image</option>
                            <option value="youtube">YouTube ID</option>
                            <option value="tiktok">TikTok ID</option>
                            <option value="video">Video URL</option>
                        </TextField>
                    </Box>
                    <Box>
                        <Stack spacing={2}>
                            {memory.type === 'image' ? (
                                <Button
                                    component="label"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Gallery size="18" color="#FF3366" />}
                                    sx={{ borderRadius: 2, height: '40px' }}
                                >
                                    {memory.url ? "Change Image" : "Upload Image"}
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(index, e)} />
                                </Button>
                            ) : (
                                <TextField
                                    size="small"
                                    label={memory.type === 'youtube' ? "YouTube Video ID" : memory.type === 'tiktok' ? "TikTok Video ID" : "Video URL"}
                                    fullWidth
                                    required
                                    placeholder={memory.type === 'youtube' ? "e.g. dQw4w9WgXcQ" : "https://..."}
                                    value={memory.url}
                                    onChange={(e) => handleMemoryChange(index, 'url', e.target.value)}
                                />
                            )}
                            <TextField
                                size="small"
                                label="Caption"
                                fullWidth
                                multiline
                                rows={2}
                                value={memory.caption}
                                onChange={(e) => handleMemoryChange(index, 'caption', e.target.value)}
                                placeholder="Add a sweet caption..."
                            />
                        </Stack>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Helper to generate a random slug
const generateRandomSlug = () => {
    return Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
};

export default function ValentineAdminPage() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const dndId = useId();
    const [cards, setCards] = useState<ValentineCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fetchingDetails, setFetchingDetails] = useState(false);

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        slug: "",
        jobName: "",
        title: "",
        openingText: "",
        greeting: "",
        subtitle: "",
        message: "",
        signer: "",
        backgroundColor: "#FFF0F3",
        backgroundMusicYoutubeId: "",
        backgroundMusicUrl: "",
        status: "active"
    });
    const [musicFile, setMusicFile] = useState<File | null>(null);
    const [memories, setMemories] = useState<ValentineMemory[]>([]);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [urlsToDelete, setUrlsToDelete] = useState<string[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: "",
        severity: "success"
    });

    const showSnackbar = (message: string, severity: AlertColor = "success") => {
        setSnackbar({ open: true, message, severity });
    };
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // DND Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setMemories((items) => {
                const oldIndex = items.findIndex((m) => m.localId === active.id);
                const newIndex = items.findIndex((m) => m.localId === over.id);
                const reordered = arrayMove(items, oldIndex, newIndex);
                // Update order property for all items
                return reordered.map((m, i) => ({ ...m, order: i }));
            });
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/valentine");
            if (res.ok) {
                const data = await res.json();
                setCards(data);
            }
        } catch (error) {
            console.error("Fetch cards failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCardDetails = async (id: string) => {
        setFetchingDetails(true);
        try {
            const res = await fetch(`/api/admin/valentine/${id}`);
            if (res.ok) {
                const data = await res.json();
                setEditId(data.id);
                setFormData({
                    slug: data.slug,
                    jobName: data.jobName || "",
                    title: data.title,
                    openingText: data.openingText || "Tap to open your surprise",
                    greeting: data.greeting || "Happy Valentine's Day",
                    subtitle: data.subtitle || "Take My Heart",
                    message: data.message || "",
                    signer: data.signer || "",
                    backgroundColor: data.backgroundColor || "#FFF0F3",
                    backgroundMusicYoutubeId: data.backgroundMusicYoutubeId || "",
                    backgroundMusicUrl: data.backgroundMusicUrl || "",
                    status: data.status
                });
                setMusicFile(null);
                setMemories((data.memories || []).map((m: any) => ({
                    ...m,
                    localId: m.id || Math.random().toString(36).substr(2, 9)
                })));
                setUrlsToDelete([]);
                // setOpen(true); // Already opened in handleOpen
            }
        } catch (error) {
            console.error("Fetch card details failed:", error);
            showSnackbar("Failed to fetch card details", "error");
            setOpen(false);
        } finally {
            setFetchingDetails(false);
        }
    };

    const handleOpen = (card?: ValentineCard) => {
        setUrlsToDelete([]);
        // Reset to empty state first to avoid showing previous card data
        setFormData({
            slug: generateRandomSlug(),
            jobName: "",
            title: "",
            openingText: "Tap to open your surprise",
            greeting: "Happy Valentine's Day",
            subtitle: "Take My Heart",
            message: "",
            signer: "",
            backgroundColor: "#FFF0F3",
            backgroundMusicYoutubeId: "",
            backgroundMusicUrl: "",
            status: "active"
        });
        setMusicFile(null);
        setMemories([]);
        setEditId(null);
        setOpen(true);

        if (card) {
            fetchCardDetails(card.id);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditId(null);
        setUrlsToDelete([]);
    };

    const handleAddMemory = () => {
        const newMemory: ValentineMemory = {
            localId: Math.random().toString(36).substr(2, 9),
            type: "image",
            url: "",
            caption: "",
            order: memories.length
        };
        setMemories([...memories, newMemory]);
    };

    const handleRemoveMemory = (index: number) => {
        const memory = memories[index];
        if (memory.url && memory.type === 'image' && memory.url.startsWith('/uploads')) {
            setUrlsToDelete(prev => [...prev, memory.url]);
        }
        const updated = memories.filter((_, i) => i !== index);
        setMemories(updated);
    };

    const handleMemoryChange = (index: number, field: keyof ValentineMemory, value: any) => {
        const updated = [...memories];
        updated[index] = { ...updated[index], [field]: value };
        setMemories(updated);
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newMemories = files.map((file, i) => ({
            localId: Math.random().toString(36).substr(2, 9),
            type: "image",
            url: "",
            file: file,
            previewUrl: URL.createObjectURL(file),
            caption: file.name.split('.')[0],
            order: memories.length + i,
            uploading: false
        }));

        setMemories(prev => [...prev, ...newMemories]);
        e.target.value = '';
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke old preview URL if it exists to prevent memory leaks
        if (memories[index].previewUrl) {
            URL.revokeObjectURL(memories[index].previewUrl!);
        }

        const previewUrl = URL.createObjectURL(file);

        const updated = [...memories];
        updated[index] = {
            ...updated[index],
            file: file,
            previewUrl: previewUrl,
            // Keep the old URL in memory until we actually save/upload
        };
        setMemories(updated);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            // 1. Upload any pending files
            let currentBackgroundMusicUrl = formData.backgroundMusicUrl;
            let currentUrlsToDelete = [...urlsToDelete];

            // Upload background music if new file selected
            if (musicFile) {
                try {
                    const musicFormData = new FormData();
                    musicFormData.append("file", musicFile);
                    musicFormData.append("folder", "valentine/music");

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: musicFormData
                    });

                    if (res.ok) {
                        const data = await res.json();
                        // If there was an old music file, track it for deletion
                        if (formData.backgroundMusicUrl && formData.backgroundMusicUrl.startsWith('/uploads')) {
                            currentUrlsToDelete.push(formData.backgroundMusicUrl);
                        }
                        currentBackgroundMusicUrl = data.url;
                    } else {
                        throw new Error("Failed to upload background music");
                    }
                } catch (error) {
                    console.error("Music upload failed:", error);
                    throw error;
                }
            }

            const uploadResults = await Promise.all(memories.map(async (memory, idx) => {
                if (memory.file) {
                    try {
                        const uploadFormData = new FormData();
                        uploadFormData.append("file", memory.file);
                        uploadFormData.append("folder", "valentine");
                        uploadFormData.append("watermark", "false");

                        const res = await fetch("/api/upload", {
                            method: "POST",
                            body: uploadFormData
                        });

                        if (res.ok) {
                            const data = await res.json();

                            // If this memory had an old URL, track it for deletion
                            if (memory.url && memory.url.startsWith('/uploads')) {
                                currentUrlsToDelete.push(memory.url);
                            }

                            return { ...memory, url: data.url, file: undefined, previewUrl: undefined };
                        } else {
                            throw new Error(`Failed to upload image ${idx + 1}`);
                        }
                    } catch (error) {
                        console.error("Upload failed in submit:", error);
                        throw error;
                    }
                }
                return memory;
            }));

            // Clean up temporary fields before sending to API
            const finalMemories = uploadResults.map(({ file, previewUrl, localId, ...rest }) => rest);

            const payload = {
                ...formData,
                backgroundMusicUrl: currentBackgroundMusicUrl,
                memories: finalMemories,
                urlsToDelete: currentUrlsToDelete
            };

            const method = editId ? "PUT" : "POST";
            const url = editId ? `/api/admin/valentine/${editId}` : "/api/admin/valentine";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showSnackbar(editId ? "Card updated successfully!" : "Card created successfully!");
                fetchCards();
                handleClose();
            } else {
                const error = await res.json();
                showSnackbar(error.error || "Something went wrong", "error");
            }
        } catch (error) {
            console.error("Save failed:", error);
            showSnackbar("Failed to save changes", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/valentine/${deleteId}`, { method: "DELETE" });
            if (res.ok) {
                showSnackbar("Card deleted successfully!");
                fetchCards();
                setDeleteDialogOpen(false);
                setDeleteId(null);
            } else {
                showSnackbar("Failed to delete card", "error");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            showSnackbar("An error occurred during deletion", "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                    Valentine Cards
                </Typography>
                <Button
                    variant="contained"
                    fullWidth={fullScreen}
                    startIcon={<Add size="20" variant="Bulk" color="white" />}
                    onClick={() => handleOpen()}
                    sx={{ fontFamily: 'var(--font-prompt)', bgcolor: 'var(--primary)', px: 4 }}
                >
                    Create New Card
                </Button>
            </Stack>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : cards.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Heart size="48" color="rgba(0,0,0,0.2)" variant="Bulk" />
                        <Typography>No valentine cards found</Typography>
                    </Box>
                </Paper>
            ) : fullScreen ? (
                /* Mobile Card View */
                <Stack spacing={2}>
                    {cards.map((card) => (
                        <Card key={card.id} sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Heart size="20" color="#ef4444" variant="Bold" />
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{card.jobName || card.title}</Typography>
                                                {card.jobName && <Typography variant="caption" sx={{ mt: -0.5, display: 'block', opacity: 0.7 }}>{card.title}</Typography>}
                                            </Box>
                                        </Stack>
                                        <Chip
                                            label={card.status}
                                            color={card.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <Chip
                                            label={card.slug}
                                            size="small"
                                            icon={<Global size="14" variant="Bulk" color="#ef4444" />}
                                            onClick={() => window.open(`/valentine/${card.slug}`, '_blank')}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                        <Chip label={`${card._count?.memories || 0} memories`} size="small" variant="outlined" />
                                    </Box>

                                    <Typography variant="caption" color="text.secondary">
                                        Created: {new Date(card.createdAt).toLocaleDateString('th-TH')}
                                    </Typography>
                                </Stack>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end', px: 2 }}>
                                <Button
                                    size="small"
                                    startIcon={<Edit size="16" variant="Bulk" color="#3b82f6" />}
                                    onClick={() => handleOpen(card)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Trash size="16" variant="Bulk" color="#ef4444" />}
                                    onClick={() => handleDeleteClick(card.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            ) : (
                /* Desktop Table View */
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell>Card Title</TableCell>
                                    <TableCell>Slug</TableCell>
                                    <TableCell>Memories</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created At</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cards.map((card) => (
                                    <TableRow key={card.id} hover>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Heart size="20" color="#ef4444" variant="Bold" />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700 }}>{card.jobName || card.title}</Typography>
                                                    {card.jobName && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>{card.title}</Typography>}
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={card.slug}
                                                size="small"
                                                icon={<Global size="14" variant="Bulk" color="#ef4444" />}
                                                onClick={() => window.open(`/valentine/${card.slug}`, '_blank')}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={`${card._count?.memories || 0} memories`} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={card.status}
                                                color={card.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                            {new Date(card.createdAt).toLocaleDateString('th-TH')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpen(card)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' } }}>
                                                <Edit size="18" variant="Bulk" color="#3b82f6" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(card.id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                                                <Trash size="18" variant="Bulk" color="#ef4444" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Edit Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                scroll="paper"
                fullScreen={fullScreen}
                PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3 } }}
            >
                <DialogTitle sx={{
                    fontFamily: 'var(--font-prompt)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(45deg, #FFF0F3 30%, #FFE3E8 90%)',
                    pb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Heart size="28" color="#FF3366" variant="Bulk" />
                        <Box sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#4A151B' }}>
                            {editId ? "Edit Valentine Card" : "Create New Valentine Card"}
                        </Box>
                    </Box>
                    <IconButton onClick={handleClose} size="small" sx={{ color: '#4A151B' }}>
                        <CloseCircle size="24" variant="Bulk" color="#4A151B" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ bgcolor: '#fcfcfc', p: { xs: 2, md: 3 }, position: 'relative' }}>
                    {fetchingDetails && (
                        <Box sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(255,255,255,0.7)',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}>
                            <CircularProgress color="primary" />
                            <Typography sx={{ color: '#FF3366', fontWeight: 700, fontFamily: 'var(--font-prompt)' }}>
                                Loading Card Data...
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 4 }}>
                        {/* Settings Column */}
                        <Box>
                            <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee', mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 800, color: '#FF3366', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Save2 size="20" variant="Bulk" color="#FF3366" /> Card Information
                                </Typography>
                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Internal Job Name (Not visible to user)"
                                        fullWidth
                                        value={formData.jobName}
                                        onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                                        placeholder="e.g. คุณสมชาย - การ์ดครบรอบ"
                                        variant="outlined"
                                        sx={{ bgcolor: 'rgba(255, 51, 102, 0.02)' }}
                                    />
                                    <TextField
                                        label="Title (Display on gift box)"
                                        fullWidth
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. For My Love"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="Slug"
                                        fullWidth
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                        helperText="Unique Random ID"
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setFormData({ ...formData, slug: generateRandomSlug() })}
                                                    title="Generate Random Slug"
                                                >
                                                    <Global size="18" color="#FF3366" />
                                                </IconButton>
                                            )
                                        }}
                                    />
                                    <TextField
                                        label="Greeting Text"
                                        fullWidth
                                        value={formData.greeting}
                                        onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                                        placeholder="e.g. Happy Valentine's Day"
                                    />
                                    <TextField
                                        label="Subtitle"
                                        fullWidth
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="e.g. Take My Heart"
                                    />
                                    <TextField
                                        label="Opening Button Text"
                                        fullWidth
                                        value={formData.openingText}
                                        onChange={(e) => setFormData({ ...formData, openingText: e.target.value })}
                                    />
                                </Stack>
                            </Box>

                            <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                                <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 800, color: '#FF3366', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Gallery size="20" variant="Bulk" color="#FF3366" /> Card Message & Media
                                </Typography>
                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Main Message"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                    <TextField
                                        label="Signer"
                                        fullWidth
                                        value={formData.signer}
                                        onChange={(e) => setFormData({ ...formData, signer: e.target.value })}
                                    />
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <TextField
                                                label="BG Color"
                                                fullWidth
                                                type="color"
                                                value={formData.backgroundColor || "#FFF0F3"}
                                                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                                sx={{
                                                    '& input': { height: '40px', p: 0.5, cursor: 'pointer' }
                                                }}
                                            />
                                        </Box>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.status === 'active'}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                                                    color="success"
                                                />
                                            }
                                            label="Status"
                                        />
                                    </Box>


                                    {/* Background Music */}
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#fff5f7', border: '1px solid #ffccd5' }}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1.5, fontWeight: 700, color: '#FF3366', textTransform: 'uppercase' }}>
                                            🎶 Background Music
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                                            เลือกใช้ได้ทีละอันเท่านั้น (MP3 จะถูกใช้ก่อนถ้ามีทั้งคู่)
                                        </Typography>
                                        <Stack spacing={2}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label="YouTube Video ID"
                                                value={formData.backgroundMusicYoutubeId}
                                                onChange={(e) => setFormData({ ...formData, backgroundMusicYoutubeId: e.target.value })}
                                                placeholder="e.g. dQw4w9WgXcQ"
                                                helperText="เพลงจาก YouTube (พิมพ์ ID เท่านั้น)"
                                                InputProps={{
                                                    startAdornment: <Typography sx={{ mr: 1, color: '#FF0000', fontWeight: 700, fontSize: '0.75rem' }}>▶</Typography>
                                                }}
                                                disabled={!!musicFile || !!formData.backgroundMusicUrl}
                                            />
                                            <Divider><Chip label="หรือ" size="small" /></Divider>

                                            <Box>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<Music size="18" color="#FF3366" />}
                                                    sx={{ borderRadius: 2, height: '40px', borderColor: '#FF3366', color: '#FF3366' }}
                                                    disabled={!!formData.backgroundMusicYoutubeId}
                                                >
                                                    {musicFile ? "เปลี่ยนไฟล์ MP3" : formData.backgroundMusicUrl ? "เปลี่ยนไฟล์ MP3" : "อัปโหลดไฟล์ MP3"}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="audio/mpeg,audio/mp3"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) setMusicFile(file);
                                                        }}
                                                    />
                                                </Button>
                                                {(musicFile || formData.backgroundMusicUrl) && (
                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                                                            {musicFile ? `ไฟล์ใหม่: ${musicFile.name}` : `ไฟล์ปัจจุบัน: ${formData.backgroundMusicUrl.split('/').pop()}`}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                if (musicFile) {
                                                                    setMusicFile(null);
                                                                } else if (formData.backgroundMusicUrl) {
                                                                    if (formData.backgroundMusicUrl.startsWith('/uploads')) {
                                                                        setUrlsToDelete(prev => [...prev, formData.backgroundMusicUrl!]);
                                                                    }
                                                                    setFormData({ ...formData, backgroundMusicUrl: '' });
                                                                }
                                                            }}
                                                            sx={{ color: '#ef4444' }}
                                                        >
                                                            <Trash size="14" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', fontSize: '0.7rem' }}>
                                                    แนะนำไฟล์ .mp3 ความยาวไม่เกิน 1-2 นาที
                                                </Typography>
                                            </Box>

                                            {(formData.backgroundMusicYoutubeId || musicFile || formData.backgroundMusicUrl) && (
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="text"
                                                    onClick={() => {
                                                        setMusicFile(null);
                                                        if (formData.backgroundMusicUrl && formData.backgroundMusicUrl.startsWith('/uploads')) {
                                                            setUrlsToDelete(prev => [...prev, formData.backgroundMusicUrl!]);
                                                        }
                                                        setFormData({ ...formData, backgroundMusicYoutubeId: '', backgroundMusicUrl: '' });
                                                    }}
                                                >
                                                    ล้าง Background Music ทั้งหมด
                                                </Button>
                                            )}
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Box>

                            {/* Enhanced Live Preview Section */}
                            <Box sx={{ p: 2.5, bgcolor: '#fdf2f4', borderRadius: 4, border: '1px solid #ffccd5' }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#FF3366', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    <Play size="18" variant="Bulk" color="#FF3366" /> Live Mobile Preview
                                </Typography>
                                <Box sx={{
                                    width: '100%',
                                    maxWidth: '280px',
                                    mx: 'auto',
                                    aspectRatio: '9/19',
                                    bgcolor: formData.backgroundColor || "#FFF0F3",
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.12), inset 0 0 0 4px #333',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    border: '8px solid #1a1a1a',
                                }}>
                                    {/* Phone Notch */}
                                    <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '18px', bgcolor: '#1a1a1a', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', zIndex: 5 }} />

                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, pt: 4 }}>
                                        {/* Header Preview */}
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography sx={{ color: '#FF3366', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'cursive', opacity: 0.8 }}>
                                                {formData.greeting?.split(' ')[0] || "Happy"}
                                            </Typography>
                                            <Typography sx={{ color: '#4A151B', fontSize: '1rem', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                                                {formData.greeting?.split(' ').slice(1).join(' ') || "VALENTINE"}
                                            </Typography>
                                        </Box>

                                        {/* Center Placeholder (Swiper Animation) */}
                                        <Box sx={{
                                            flex: 1,
                                            my: 1,
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {/* Stacked Cards Representation */}
                                            <Box sx={{ position: 'absolute', width: '80%', height: '80%', bgcolor: 'white', opacity: 0.3, borderRadius: 2, transform: 'rotate(-5deg) translate(-10px, -5px)', border: '1px solid #ddd' }} />
                                            <Box sx={{ position: 'absolute', width: '80%', height: '80%', bgcolor: 'white', opacity: 0.5, borderRadius: 2, transform: 'rotate(3deg) translate(5px, 2px)', border: '1px solid #ddd' }} />
                                            <Box sx={{
                                                width: '85%',
                                                height: '85%',
                                                bgcolor: 'white',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 2,
                                                overflow: 'hidden',
                                                border: '4px solid white',
                                                textAlign: 'center'
                                            }}>
                                                <Gallery size="32" variant="Bulk" color="#FF3366" />
                                                <Typography sx={{ fontSize: '0.7rem', color: '#FF3366', mt: 1, fontWeight: 700 }}>
                                                    {memories.length} Memories<br />(Swiper View)
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Footer Preview */}
                                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                                            <Typography sx={{ color: '#8B1D36', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                                                {formData.subtitle || "Subtitle"}
                                            </Typography>
                                            <Paper elevation={0} sx={{
                                                background: 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(8px)',
                                                p: 1.5,
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.5)'
                                            }}>
                                                <Typography sx={{
                                                    fontSize: '0.75rem',
                                                    color: '#4A151B',
                                                    lineHeight: 1.4,
                                                    whiteSpace: 'pre-line',
                                                    maxHeight: '60px',
                                                    overflow: 'hidden'
                                                }}>
                                                    {formData.message || "Your sweet message..."}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.65rem', color: '#FF3366', fontWeight: 800, mt: 1 }}>
                                                    - {formData.signer || "Signer Name"} -
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </Box>

                                    {/* Decorative Hearts */}
                                    <Heart size="12" variant="Bulk" color="#FF3366" style={{ position: 'absolute', top: '15%', right: '15%', opacity: 0.3 }} />
                                    <Heart size="16" variant="Bulk" color="#FF3366" style={{ position: 'absolute', bottom: '15%', left: '10%', opacity: 0.2 }} />
                                    <Music size="16" color="#8B1D36" variant="Bulk" style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.5 }} />
                                </Box>
                                <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: '#FF3366', fontWeight: 600 }}>
                                    Real-time Mobile View
                                </Typography>
                            </Box>
                        </Box>

                        {/* Memories Column */}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FF3366', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Gallery size="24" variant="Bulk" /> Memories (Swiper Cards)
                                    <Chip label={memories.length} size="small" sx={{ bgcolor: '#FFF0F3', color: '#FF3366', fontWeight: 700 }} />
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<Gallery size="20" variant="Bulk" color="#FF3366" />}
                                        size="small"
                                        sx={{ borderRadius: '8px', color: '#FF3366', borderColor: '#FF3366' }}
                                    >
                                        Bulk Upload
                                        <input type="file" multiple hidden accept="image/*" onChange={handleBulkUpload} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add size="20" variant="Bulk" color="white" />}
                                        size="small"
                                        onClick={handleAddMemory}
                                        sx={{ bgcolor: '#FF3366', '&:hover': { bgcolor: '#E02D59' }, borderRadius: '8px' }}
                                    >
                                        Add URL
                                    </Button>
                                </Box>
                            </Box>

                            <Stack spacing={3} sx={{
                                width: '100%',
                                pb: 4
                            }}>
                                {memories.length === 0 && (
                                    <Box sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        border: '2px dashed #eee',
                                        borderRadius: 4,
                                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Gallery size="48" color="#FF3366" variant="Bulk" />
                                        <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>No memories added yet.</Typography>
                                        <Typography variant="caption" color="text.disabled">Click "Add Memory" to start building your gallery.</Typography>
                                    </Box>
                                )}

                                <DndContext
                                    id={dndId}
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={memories.map((m) => m.localId)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {memories.map((memory, index) => (
                                            <SortableMemoryItem
                                                key={memory.localId}
                                                id={memory.localId}
                                                memory={memory}
                                                index={index}
                                                handleRemoveMemory={handleRemoveMemory}
                                                handleFileChange={handleFileChange}
                                                handleMemoryChange={handleMemoryChange}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </Stack>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfc', borderTop: '1px solid #eee' }}>
                    <Button onClick={handleClose} variant="text" color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={saving || !formData.title || !formData.slug}
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save2 variant="Bold" color="white" />}
                        sx={{
                            px: 4,
                            py: 1.2,
                            borderRadius: '10px',
                            bgcolor: '#FF3366',
                            '&:hover': { bgcolor: '#E02D59' },
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(255, 51, 102, 0.2)'
                        }}
                    >
                        {saving ? "Saving..." : (editId ? "Update Valentine Card" : "Create Card")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Trash size="28" variant="Bulk" color="#ef4444" /> Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'text.secondary' }}>
                        Are you sure you want to delete this Valentine card? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={deleting} sx={{ fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                        sx={{
                            borderRadius: '10px',
                            px: 3,
                            fontWeight: 700,
                            bgcolor: '#ef4444',
                            '&:hover': { bgcolor: '#dc2626' },
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete Card"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

