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
    Switch,
    Autocomplete,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    LinearProgress,
    Tooltip
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import { Add, Edit, Trash, Heart, Music, Gallery, Play, Save2, CloseCircle, Global, Link as LinkIcon, HambergerMenu, Scan, DirectDown, Printer, ShoppingBag, Eye, Profile, Call, Location, ClipboardText } from "iconsax-react";
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
    progress?: number;
}

interface ValentineProduct {
    id: string;
    name: string;
    image: string | null;
    price: number;
    category: string;
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
    swipeHintColor: string | null;
    swipeHintText: string | null;
    customerPhone: string | null;
    customerAddress: string | null;
    note: string | null;
    status: string;
    disabledAt: string | null;
    createdAt: string;
    _count?: { memories: number };
    orderedProducts?: ValentineProduct[];
}

interface SortableMemoryItemProps {
    id: string;
    memory: ValentineMemory;
    index: number;
    handleRemoveMemory: (index: number) => void;
    handleFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMemoryChange: (index: number, field: keyof ValentineMemory, value: any) => void;
    disabled?: boolean;
}

const SortableMemoryItem = ({
    id,
    memory,
    index,
    handleRemoveMemory,
    handleFileChange,
    handleMemoryChange,
    disabled
}: SortableMemoryItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        disabled: disabled // This officially disables the item in dnd-kit
    });

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
                {...(disabled ? {} : attributes)}
                {...(disabled ? {} : listeners)}
                sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    cursor: disabled ? 'default' : 'grab',
                    color: 'text.disabled',
                    '&:hover': { color: disabled ? 'text.disabled' : '#FF3366' },
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: disabled ? 0.3 : 1
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
                                ) : memory.type === 'video' ? (
                                    <Box sx={{ width: '100%', height: '100%', bgcolor: 'black', position: 'relative' }}>
                                        <video
                                            src={memory.previewUrl || memory.url}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}>
                                            <Play size="32" variant="Bulk" />
                                        </Box>
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

                            {(memory.type === 'image' || memory.type === 'video') && (
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
                                    bgcolor: 'rgba(255,255,255,0.85)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={memory.progress || 0}
                                            size={50}
                                            thickness={4}
                                            sx={{ color: '#FF3366' }}
                                        />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 800 }}>
                                                {`${Math.round(memory.progress || 0)}%`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" sx={{ mt: 1, fontWeight: 700, color: '#FF3366' }}>
                                        Uploading...
                                    </Typography>
                                </Box>
                            )}

                            <input
                                type="file"
                                id={`file-input-${index}`}
                                hidden
                                accept={memory.type === 'video' ? "video/*" : "image/*"}
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
                            <option value="video">Video (MP4/URL)</option>
                        </TextField>
                    </Box>
                    <Box>
                        <Stack spacing={2}>
                            {(memory.type === 'image' || memory.type === 'video') && (
                                <Button
                                    component="label"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={memory.type === 'video' ? <Play size="18" color="#FF3366" /> : <Gallery size="18" color="#FF3366" />}
                                    sx={{ borderRadius: 2, height: '40px' }}
                                >
                                    {memory.url ? `Change ${memory.type === 'video' ? 'Video' : 'Image'}` : `Upload ${memory.type === 'video' ? 'Video' : 'Image'}`}
                                    <input type="file" hidden accept={memory.type === 'video' ? "video/*" : "image/*"} onChange={(e) => handleFileChange(index, e)} />
                                </Button>
                            )}

                            {(memory.type !== 'image') && (
                                <TextField
                                    size="small"
                                    label={memory.type === 'youtube' ? "YouTube Video ID" : memory.type === 'tiktok' ? "TikTok Video ID" : "Video URL / Path"}
                                    fullWidth
                                    required
                                    placeholder={memory.type === 'youtube' ? "e.g. dQw4w9WgXcQ" : "https://... or auto-filled by upload"}
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`valentine-tabpanel-${index}`}
            aria-labelledby={`valentine-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export default function ValentineAdminPage() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const dndId = useId();
    const [cards, setCards] = useState<ValentineCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fetchingDetails, setFetchingDetails] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [selectedSummaryCard, setSelectedSummaryCard] = useState<ValentineCard | null>(null);

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
        status: "active",
        disabledAt: "", // วันที่จะ disabled อัตโนมัติ (format: YYYY-MM-DDTHH:mm)
        swipeHintColor: "white" as "white" | "red", // สี hint "Swipe to see more"
        swipeHintText: "Swipe to see more", // ข้อความ hint
        customerPhone: "", // เบอร์โทรลูกค้า
        customerAddress: "", // ที่อยู่ลูกค้า
        note: "", // บันทึกเพิ่มเติม
    });
    const [musicFile, setMusicFile] = useState<File | null>(null);
    const [musicProgress, setMusicProgress] = useState(0);
    const [memories, setMemories] = useState<ValentineMemory[]>([]);
    const [availableProducts, setAvailableProducts] = useState<ValentineProduct[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const memoriesEndRef = React.useRef<HTMLDivElement>(null);

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

    // Auto-scroll to bottom when new memories are added
    useEffect(() => {
        if (currentTab === 2 && memories.length > 0) {
            memoriesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [memories.length, currentTab]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [qrData, setQrData] = useState<{ url: string; title: string } | null>(null);
    const [editableTitle, setEditableTitle] = useState("");
    const [previewVertical, setPreviewVertical] = useState<string | null>(null);
    const [previewHorizontal, setPreviewHorizontal] = useState<string | null>(null);
    const [generatingPreview, setGeneratingPreview] = useState(false);

    const handleOpenQR = (card: ValentineCard) => {
        const url = `${window.location.origin}/valentine/${card.slug}`;
        const title = card.jobName || card.title || "Valentine";
        setQrData({ url, title });
        setEditableTitle(title);
        setPreviewVertical(null);
        setPreviewHorizontal(null);
        setQrOpen(true);
        // Generate previews after modal opens
        setTimeout(() => generatePreviews(url, title), 100);
    };

    const generatePreviews = async (url: string, title: string) => {
        setGeneratingPreview(true);
        try {
            const [vertical, horizontal] = await Promise.all([
                generateCardPreview(url, title, "/images/card_vertical_2.png", { qrSize: 0.55, qrY: 0.50, showTitle: true }),
                generateCardPreview(url, title, "/images/card_horizontal_3.png", { qrSize: 0.42, qrY: 0.24, qrX: 0.52, showTitle: true })
            ]);
            setPreviewVertical(vertical);
            setPreviewHorizontal(horizontal);
        } catch (error) {
            console.error("Preview generation failed:", error);
        } finally {
            setGeneratingPreview(false);
        }
    };

    // Update previews when title changes
    const handleTitleChange = (newTitle: string) => {
        setEditableTitle(newTitle);
        if (qrData) {
            generatePreviews(qrData.url, newTitle);
        }
    };

    const generateCardPreview = async (
        targetUrl: string,
        targetTitle: string,
        templateUrl: string,
        options: { qrSize: number; qrY: number; qrX?: number; showTitle?: boolean }
    ): Promise<string> => {
        // Business Card Standard Dimensions @300dpi
        const isHorizontal = templateUrl.includes('horizontal');
        const CARD_WIDTH = isHorizontal ? 1063 : 649;
        const CARD_HEIGHT = isHorizontal ? 649 : 1063;

        const qrSize = 500;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(targetUrl)}&ecc=H&margin=0`;

        const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        });

        const canvas = document.createElement("canvas");
        canvas.width = CARD_WIDTH;
        canvas.height = CARD_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        if (isHorizontal) {
            // === HORIZONTAL CARD: Composite from card_blank.jpg + heart.png + QR ===
            const [qrImage, bgImage, heartImage] = await Promise.all([
                loadImage(qrUrl),
                loadImage("/images/card_blank.jpg"),
                loadImage("/images/heart.png"),
            ]);

            // 1. Draw background (card_blank.jpg)
            ctx.drawImage(bgImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

            // 2. Draw heart on left side (scaled to fit left half)
            const heartWidth = CARD_WIDTH * 0.35;
            const heartHeight = heartWidth * (heartImage.naturalHeight / heartImage.naturalWidth);
            const heartX = CARD_WIDTH * 0.06;
            const heartY = (CARD_HEIGHT - heartHeight) / 2;
            ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);

            // 3. Draw title on right side above QR
            const qrSizeOnCard = CARD_WIDTH * 0.38;
            const qrX = CARD_WIDTH * 0.55; // moved left for more right padding
            const qrY = CARD_HEIGHT * 0.25;

            if (options.showTitle && targetTitle) {
                const fontSize = Math.round(CARD_HEIGHT * 0.040);
                ctx.font = `bold ${fontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
                ctx.fillStyle = "#4A151B";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                const textX = qrX + qrSizeOnCard / 2;
                const textY = qrY - (fontSize * 0.8); // increased gap above QR
                ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
                ctx.shadowBlur = 4;
                ctx.fillText(targetTitle.toUpperCase(), textX, textY);
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
            }

            // 4. Draw QR Code on right side
            ctx.drawImage(qrImage, qrX, qrY, qrSizeOnCard, qrSizeOnCard);

            // 5. Draw scan instruction below QR
            const scanFontSize = Math.round(CARD_HEIGHT * 0.035);
            ctx.font = `${scanFontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
            ctx.fillStyle = "#666666";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            const scanTextX = qrX + qrSizeOnCard / 2;
            const scanTextY = qrY + qrSizeOnCard + (scanFontSize * 0.6); // increased gap below QR
            ctx.fillText("สแกนเพื่อดูข้อความ", scanTextX, scanTextY);

        } else {
            // === VERTICAL CARD: Composite from card_blank_vertical.jpg + heart.png + QR ===
            const [qrImage, bgImage, heartImage] = await Promise.all([
                loadImage(qrUrl),
                loadImage("/images/card_blank_vertical.jpg"),
                loadImage("/images/heart.png"),
            ]);

            // 1. Draw background
            ctx.drawImage(bgImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

            // 2. Draw heart on top section (smaller)
            const heartWidth = CARD_WIDTH * 0.50;
            const heartHeight = heartWidth * (heartImage.naturalHeight / heartImage.naturalWidth);
            const heartX = (CARD_WIDTH - heartWidth) / 2;
            const heartY = CARD_HEIGHT * 0.06;
            ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);

            // 3. Draw title above QR (larger QR)
            const qrSizeOnCard = CARD_WIDTH * 0.65;
            const qrX = (CARD_WIDTH - qrSizeOnCard) / 2;
            const qrY = CARD_HEIGHT * 0.48;

            if (options.showTitle && targetTitle) {
                const fontSize = Math.round(CARD_HEIGHT * 0.028);
                ctx.font = `bold ${fontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
                ctx.fillStyle = "#4A151B";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                const textX = qrX + qrSizeOnCard / 2;
                const textY = qrY - (fontSize * 0.6);
                ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
                ctx.shadowBlur = 4;
                ctx.fillText(targetTitle.toUpperCase(), textX, textY);
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
            }

            // 4. Draw QR Code
            ctx.drawImage(qrImage, qrX, qrY, qrSizeOnCard, qrSizeOnCard);

            // 5. Draw scan instruction below QR
            const scanFontSize = Math.round(CARD_HEIGHT * 0.025);
            ctx.font = `${scanFontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
            ctx.fillStyle = "#666666";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            const scanTextX = qrX + qrSizeOnCard / 2;
            const scanTextY = qrY + qrSizeOnCard + (scanFontSize * 0.5);
            ctx.fillText("สแกนเพื่อดูข้อความ", scanTextX, scanTextY);
        }

        // Crop marks for both types
        const drawCropMark = (x: number, y: number, orientX: number, orientY: number) => {
            const len = Math.round(CARD_WIDTH * 0.025);
            const weight = Math.max(1.5, Math.round(CARD_WIDTH * 0.0015));
            ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
            ctx.lineWidth = weight;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + (len * orientX), y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + (len * orientY));
            ctx.stroke();
        };
        drawCropMark(0, 0, 1, 1);
        drawCropMark(CARD_WIDTH, 0, -1, 1);
        drawCropMark(0, CARD_HEIGHT, 1, -1);
        drawCropMark(CARD_WIDTH, CARD_HEIGHT, -1, -1);

        return canvas.toDataURL("image/png", 1.0);
    };

    const generateAndDownloadCard = async (
        targetUrl: string,
        targetTitle: string,
        templateUrl: string = "/images/card_vertical_2.png",
        options: { qrSize: number; qrY: number; qrX?: number; showTitle?: boolean } = { qrSize: 0.60, qrY: 0.43, showTitle: true }
    ) => {
        try {
            // Business Card Standard Dimensions @300dpi
            const isHorizontal = templateUrl.includes('horizontal');
            const CARD_WIDTH = isHorizontal ? 1063 : 649;
            const CARD_HEIGHT = isHorizontal ? 649 : 1063;

            const qrSize = 500;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(targetUrl)}&ecc=H&margin=0`;

            const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            });

            const canvas = document.createElement("canvas");
            canvas.width = CARD_WIDTH;
            canvas.height = CARD_HEIGHT;

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            if (isHorizontal) {
                // === HORIZONTAL CARD: Composite from card_blank.jpg + heart.png + QR ===
                const [qrImage, bgImage, heartImage] = await Promise.all([
                    loadImage(qrUrl),
                    loadImage("/images/card_blank.jpg"),
                    loadImage("/images/heart.png"),
                ]);

                // 1. Draw background
                ctx.drawImage(bgImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

                // 2. Draw heart on left side
                const heartWidth = CARD_WIDTH * 0.35;
                const heartHeight = heartWidth * (heartImage.naturalHeight / heartImage.naturalWidth);
                const heartX = CARD_WIDTH * 0.06;
                const heartY = (CARD_HEIGHT - heartHeight) / 2;
                ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);

                // 3. Draw title
                const qrSizeOnCard = CARD_WIDTH * 0.38;
                const qrX = CARD_WIDTH * 0.52; // moved left for more right padding
                const qrY = CARD_HEIGHT * 0.25;

                if (options.showTitle && targetTitle) {
                    const fontSize = Math.round(CARD_HEIGHT * 0.040);
                    ctx.font = `bold ${fontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
                    ctx.fillStyle = "#4A151B";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    const textX = qrX + qrSizeOnCard / 2;
                    const textY = qrY - (fontSize * 0.8); // increased gap above QR
                    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
                    ctx.shadowBlur = 4;
                    ctx.fillText(targetTitle.toUpperCase(), textX, textY);
                    ctx.shadowColor = "transparent";
                    ctx.shadowBlur = 0;
                }

                // 4. Draw QR Code
                ctx.drawImage(qrImage, qrX, qrY, qrSizeOnCard, qrSizeOnCard);

                // 5. Draw scan instruction below QR
                const scanFontSize = Math.round(CARD_HEIGHT * 0.035);
                ctx.font = `${scanFontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
                ctx.fillStyle = "#666666";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                const scanTextX = qrX + qrSizeOnCard / 2;
                const scanTextY = qrY + qrSizeOnCard + (scanFontSize * 0.6); // increased gap below QR
                ctx.fillText("สแกนเพื่อดูข้อความ", scanTextX, scanTextY);

            } else {
                // === VERTICAL CARD: Composite from card_blank_vertical.jpg + heart.png + QR ===
                const [qrImage, bgImage, heartImage] = await Promise.all([
                    loadImage(qrUrl),
                    loadImage("/images/card_blank_vertical.jpg"),
                    loadImage("/images/heart.png"),
                ]);

                // 1. Draw background
                ctx.drawImage(bgImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

                // 2. Draw heart on top section (smaller)
                const heartWidth = CARD_WIDTH * 0.50;
                const heartHeight = heartWidth * (heartImage.naturalHeight / heartImage.naturalWidth);
                const heartX = (CARD_WIDTH - heartWidth) / 2;
                const heartY = CARD_HEIGHT * 0.06;
                ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);

                // 3. Draw title above QR (larger QR)
                const qrSizeOnCard = CARD_WIDTH * 0.65;
                const qrX = (CARD_WIDTH - qrSizeOnCard) / 2;
                const qrY = CARD_HEIGHT * 0.48;

                if (options.showTitle && targetTitle) {
                    const fontSize = Math.round(CARD_HEIGHT * 0.028);
                    ctx.font = `bold ${fontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
                    ctx.fillStyle = "#4A151B";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    const textX = qrX + qrSizeOnCard / 2;
                    const textY = qrY - (fontSize * 0.6);
                    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
                    ctx.shadowBlur = 4;
                    ctx.fillText(targetTitle.toUpperCase(), textX, textY);
                    ctx.shadowColor = "transparent";
                    ctx.shadowBlur = 0;
                }

                // 4. Draw QR Code
                ctx.drawImage(qrImage, qrX, qrY, qrSizeOnCard, qrSizeOnCard);

                // 5. Draw scan instruction below QR
                const scanFontSize = Math.round(CARD_HEIGHT * 0.025);
                ctx.font = `${scanFontSize}px "Prompt", "Noto Sans Thai", sans-serif`;
                ctx.fillStyle = "#666666";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                const scanTextX = qrX + qrSizeOnCard / 2;
                const scanTextY = qrY + qrSizeOnCard + (scanFontSize * 0.5);
                ctx.fillText("สแกนเพื่อดูข้อความ", scanTextX, scanTextY);
            }

            // Crop marks for both
            const drawCropMark = (x: number, y: number, orientX: number, orientY: number) => {
                const len = Math.round(CARD_WIDTH * 0.025);
                const weight = Math.max(1.5, Math.round(CARD_WIDTH * 0.0015));
                ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
                ctx.lineWidth = weight;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + (len * orientX), y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + (len * orientY));
                ctx.stroke();
            };
            drawCropMark(0, 0, 1, 1);
            drawCropMark(CARD_WIDTH, 0, -1, 1);
            drawCropMark(0, CARD_HEIGHT, 1, -1);
            drawCropMark(CARD_WIDTH, CARD_HEIGHT, -1, -1);

            // Download
            const link = document.createElement("a");
            const suffix = isHorizontal ? 'Horizontal' : 'Vertical';
            link.download = `ValentineCard_${suffix}_${targetTitle.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();

            showSnackbar(`Valentine ${suffix} Card downloaded! (90×55mm)`);
        } catch (error) {
            console.error("Download Error:", error);
            showSnackbar("Failed to generate card", "error");
        }
    };

    const handleDownloadQR = async () => {
        if (!qrData) return;
        await generateAndDownloadCard(
            qrData.url,
            editableTitle || qrData.title,
            "/images/card_vertical_2.png",
            { qrSize: 0.55, qrY: 0.50, showTitle: true }
        );
    };

    const handleDownloadHorizontalQR = async () => {
        if (!qrData) return;
        await generateAndDownloadCard(
            qrData.url,
            editableTitle || qrData.title,
            "/images/card_horizontal_3.png",
            { qrSize: 0.42, qrY: 0.24, qrX: 0.52, showTitle: true }
        );
    };

    const handleDownloadOnlyQR = async () => {
        if (!qrData) return;
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qrData.url)}&ecc=H&margin=10`;
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `QRCode_${qrData.title.replace(/\s+/g, '_')}.png`;
            link.click();
            window.URL.revokeObjectURL(url);
            showSnackbar("QR Code downloaded!");
        } catch (error) {
            console.error("QR Download Error:", error);
            showSnackbar("Failed to download QR code", "error");
        }
    };

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
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/valentine/products");
            if (res.ok) {
                const data = await res.json();
                setAvailableProducts(data);
            }
        } catch (error) {
            console.error("Fetch products failed:", error);
        }
    };

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
                // Format disabledAt for datetime-local input (YYYY-MM-DDTHH:mm)
                const formatDisabledAt = data.disabledAt
                    ? dayjs(data.disabledAt).format('YYYY-MM-DDTHH:mm')
                    : "";
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
                    status: data.status,
                    disabledAt: formatDisabledAt,
                    swipeHintColor: data.swipeHintColor || "white",
                    swipeHintText: data.swipeHintText || "Swipe to see more",
                    customerPhone: data.customerPhone || "",
                    customerAddress: data.customerAddress || "",
                    note: data.note || ""
                });
                setMusicFile(null);
                setMemories((data.memories || []).map((m: any) => ({
                    ...m,
                    localId: m.id || Math.random().toString(36).substr(2, 9)
                })));
                setSelectedProductIds((data.orderedProducts || []).map((p: any) => p.id));
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
            status: "active",
            disabledAt: "",
            swipeHintColor: "white",
            swipeHintText: "Swipe to see more",
            customerPhone: "",
            customerAddress: "",
            note: ""
        });
        setMusicFile(null);
        setMemories([]);
        setSelectedProductIds([]);
        setEditId(null);
        setCurrentTab(0);
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
            order: 0
        };
        // Append new memory to the bottom and update orders
        setMemories(prev => {
            const updated = [...prev, newMemory];
            return updated.map((m, i) => ({ ...m, order: i }));
        });
    };

    const handleRemoveMemory = (index: number) => {
        const memory = memories[index];
        if (memory.url && (memory.type === 'image' || memory.type === 'video') && memory.url.startsWith('/uploads')) {
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
            type: file.type.startsWith('video/') ? "video" : "image",
            url: "",
            file: file,
            previewUrl: URL.createObjectURL(file),
            caption: file.name.split('.')[0],
            order: i,
            uploading: false
        }));

        setMemories(prev => {
            const updated = [...prev, ...newMemories];
            // Re-map orders for the entire list
            return updated.map((m, i) => ({ ...m, order: i }));
        });
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
            type: file.type.startsWith('video/') ? "video" : "image",
            // Keep the old URL in memory until we actually save/upload
        };
        setMemories(updated);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const uploadFileWithProgress = (file: File, folder: string, onProgress: (percent: number) => void) => {
        return new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            formData.append("watermark", "false");

            let lastUpdate = 0;
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const now = Date.now();
                    const percent = (event.loaded / event.total) * 100;

                    // Only update state if it's been more than 100ms since last update OR if it's 100%
                    if (now - lastUpdate > 100 || percent === 100) {
                        onProgress(percent);
                        lastUpdate = now;
                    }
                }
            });

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch (e) {
                            reject(new Error("Failed to parse response"));
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                }
            };

            xhr.onerror = () => reject(new Error("Network error during upload"));
            xhr.open("POST", "/api/upload");
            xhr.send(formData);
        });
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
                    setMusicProgress(0);
                    const data = await uploadFileWithProgress(musicFile, "valentine/music", (percent) => {
                        setMusicProgress(percent);
                    });

                    if (formData.backgroundMusicUrl && formData.backgroundMusicUrl.startsWith('/uploads')) {
                        currentUrlsToDelete.push(formData.backgroundMusicUrl);
                    }
                    currentBackgroundMusicUrl = data.url;
                } catch (error) {
                    console.error("Music upload failed:", error);
                    throw error;
                } finally {
                    setMusicProgress(0);
                }
            }

            const uploadResults = [];
            for (let idx = 0; idx < memories.length; idx++) {
                const memory = memories[idx];
                if (memory.file) {
                    try {
                        // Mark as uploading
                        setMemories(prev => {
                            const updated = [...prev];
                            updated[idx] = { ...updated[idx], uploading: true, progress: 0 };
                            return updated;
                        });

                        const data = await uploadFileWithProgress(memory.file, "valentine", (percent) => {
                            setMemories(prev => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], progress: percent };
                                return updated;
                            });
                        });

                        if (memory.url && memory.url.startsWith('/uploads')) {
                            currentUrlsToDelete.push(memory.url);
                        }

                        uploadResults.push({ ...memory, url: data.url, file: undefined, previewUrl: undefined, uploading: false, progress: 100 });
                    } catch (error) {
                        console.error(`Upload failed for memory ${idx + 1}:`, error);
                        setMemories(prev => {
                            const updated = [...prev];
                            updated[idx] = { ...updated[idx], uploading: false };
                            return updated;
                        });
                        throw error;
                    }
                } else {
                    uploadResults.push(memory);
                }
            }

            // Clean up temporary fields before sending to API
            const finalMemories = uploadResults.map(({ file, previewUrl, localId, ...rest }) => rest);

            const payload = {
                ...formData,
                backgroundMusicUrl: currentBackgroundMusicUrl,
                memories: finalMemories,
                orderedProducts: selectedProductIds,
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

                                    {card.orderedProducts && card.orderedProducts.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, py: 1 }}>
                                            {card.orderedProducts.map((p: any) => (
                                                <Stack key={p.id} direction="row" spacing={1} alignItems="center" sx={{ bgcolor: '#FFF0F3', px: 1, py: 0.5, borderRadius: 2, border: '1px solid #FFE3E8' }}>
                                                    <Avatar src={p.image} variant="rounded" sx={{ width: 20, height: 20 }} />
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A151B' }}>{p.name}</Typography>
                                                </Stack>
                                            ))}
                                        </Box>
                                    )}

                                    <Typography variant="caption" color="text.secondary">
                                        Created: {new Date(card.createdAt).toLocaleDateString('th-TH')}
                                    </Typography>
                                </Stack>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end', px: 2, flexWrap: 'wrap', gap: 0.5 }}>
                                <Button
                                    size="small"
                                    startIcon={<Scan size="16" variant="Bulk" color="#FF3366" />}
                                    onClick={() => handleOpenQR(card)}
                                >
                                    QR
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<Printer size="16" variant="Bulk" color="#FF3366" />}
                                    onClick={() => generateAndDownloadCard(`${window.location.origin}/valentine/${card.slug}`, card.jobName || card.title)}
                                >
                                    Normal
                                </Button>
                                <Button
                                    size="small"
                                    startIcon={<DirectDown size="16" variant="Bulk" color="#FF3366" />}
                                    onClick={() => generateAndDownloadCard(`${window.location.origin}/valentine/${card.slug}`, card.jobName || card.title, "/images/card_horizontal_3.png", { qrSize: 0.42, qrY: 0.24, qrX: 0.52, showTitle: true })}
                                >
                                    Horizontal
                                </Button>
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
                                    <TableCell sx={{ minWidth: 150 }}>Flowers / Bouquet</TableCell>
                                    <TableCell>Memories</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Expires</TableCell>
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
                                            <Stack spacing={0.5} sx={{ maxWidth: 200 }}>
                                                {card.orderedProducts && card.orderedProducts.length > 0 ? (
                                                    card.orderedProducts.map((p: any) => (
                                                        <Tooltip key={p.id} title={`฿${p.price.toLocaleString()}`}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Avatar
                                                                    src={p.image}
                                                                    variant="rounded"
                                                                    sx={{ width: 28, height: 28, border: '1px solid #eee', flexShrink: 0 }}
                                                                >
                                                                    <ShoppingBag size="14" />
                                                                </Avatar>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: '#4A151B',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {p.name}
                                                                </Typography>
                                                            </Stack>
                                                        </Tooltip>
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </Stack>
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
                                        <TableCell sx={{ fontSize: '0.8rem' }}>
                                            {card.disabledAt ? (
                                                <Chip
                                                    label={new Date(card.disabledAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    size="small"
                                                    color={new Date(card.disabledAt) < new Date() ? 'error' : new Date(card.disabledAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'warning' : 'default'}
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">ไม่หมดอายุ</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                            {new Date(card.createdAt).toLocaleDateString('th-TH')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedSummaryCard(card);
                                                    setSummaryOpen(true);
                                                }}
                                                sx={{ color: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                                                title="View Summary"
                                            >
                                                <Eye size="18" variant="Bulk" color="#10b981" />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenQR(card)} sx={{ color: '#FF3366', '&:hover': { bgcolor: 'rgba(255, 51, 102, 0.1)' } }} title="QR Code Dialog">
                                                <Scan size="18" variant="Bulk" color="#FF3366" />
                                            </IconButton>

                                            <IconButton onClick={() => handleOpen(card)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' } }} title="Edit">
                                                <Edit size="18" variant="Bulk" color="#3b82f6" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(card.id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }} title="Delete">
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' }, gap: 4, alignItems: 'start' }}>
                        {/* Left Content Column */}
                        <Box sx={{ minWidth: 0 }}>
                            <Box sx={{ mb: 3, borderBottom: '1px solid #eee' }}>
                                <Tabs
                                    value={currentTab}
                                    onChange={(e, v) => setCurrentTab(v)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                        '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#FF3366' },
                                        '& .MuiTab-root': {
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            pb: 2,
                                            color: 'text.secondary',
                                            '&.Mui-selected': { color: '#FF3366' }
                                        }
                                    }}
                                >
                                    <Tab label="ข้อมูลทั่วไป & สินค้า" />
                                    <Tab label="เนื้อหา & ดีไซน์" />
                                    <Tab label="แกลเลอรี่รูปภาพ" />
                                </Tabs>
                            </Box>

                            <CustomTabPanel value={currentTab} index={0}>
                                <Stack spacing={3}>
                                    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: '#4A151B', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            <Save2 size="18" variant="Bulk" color="#FF3366" /> Basic Information
                                        </Typography>
                                        <Stack spacing={2.5}>
                                            <TextField
                                                label="Internal Job Name"
                                                fullWidth
                                                value={formData.jobName}
                                                onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                                                placeholder="e.g. คุณสมชาย - การ์ดครบรอบ"
                                                variant="outlined"
                                            />
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                                <TextField
                                                    label="Title (Display on gift box)"
                                                    fullWidth
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="e.g. For My Love"
                                                />
                                                <TextField
                                                    label="Slug (URL Path)"
                                                    fullWidth
                                                    required
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton size="small" onClick={() => setFormData({ ...formData, slug: generateRandomSlug() })}>
                                                                <Global size="18" color="#FF3366" />
                                                            </IconButton>
                                                        )
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                                <FormControlLabel
                                                    control={<Switch checked={formData.status === 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })} color="success" />}
                                                    label="การ์ดเปิดใช้งานอยู่ (Active)"
                                                />
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                                                    <DateTimePicker
                                                        label="วันที่ปิดการ์ดอัตโนมัติ"
                                                        value={formData.disabledAt ? dayjs(formData.disabledAt) : null}
                                                        onChange={(newValue) => setFormData({ ...formData, disabledAt: newValue ? newValue.toISOString() : '' })}
                                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                            <Divider sx={{ my: 1, borderStyle: 'dotted' }} />
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1.5fr' }, gap: 2 }}>
                                                <TextField
                                                    label="เบอร์โทรติดต่อ (Customer Phone)"
                                                    fullWidth
                                                    size="small"
                                                    value={formData.customerPhone}
                                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                    placeholder="0xx-xxx-xxxx"
                                                />
                                                <TextField
                                                    label="ที่อยู่ลูกค้า (Customer Address)"
                                                    fullWidth
                                                    size="small"
                                                    multiline
                                                    rows={2}
                                                    value={formData.customerAddress}
                                                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                                    placeholder="ที่อยู่จัดส่ง..."
                                                />
                                            </Box>
                                            <TextField
                                                label="บันทึกเพิ่มเติม (Internal Note)"
                                                fullWidth
                                                size="small"
                                                multiline
                                                rows={2}
                                                value={formData.note}
                                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                                placeholder="บันทึกช่วยจำสำหรับแอดมิน (ไม่แสดงให้ลูกค้าเห็น)..."
                                                sx={{ mt: 1 }}
                                            />
                                        </Stack>
                                    </Box>

                                    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: '#4A151B', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            <ShoppingBag size="18" variant="Bulk" color="#FF3366" /> Ordered Products
                                        </Typography>
                                        <Autocomplete
                                            multiple
                                            options={availableProducts}
                                            getOptionLabel={(option) => option.name}
                                            value={availableProducts.filter(p => selectedProductIds.includes(p.id))}
                                            onChange={(e, v) => setSelectedProductIds(v.map(item => item.id))}
                                            disableCloseOnSelect
                                            renderInput={(params) => <TextField {...params} variant="outlined" label="เลือกดอกไม้จากแคตตาล็อก" />}
                                            renderOption={(props, option, { selected }) => {
                                                const { key, ...otherProps } = props as any;
                                                return (
                                                    <li key={key} {...otherProps}>
                                                        <Checkbox icon={<Heart size="20" variant="Bold" color="#ccc" />} checkedIcon={<Heart size="20" variant="Bold" color="#FF3366" />} checked={selected} sx={{ mr: 1 }} />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            {option.image && <Avatar src={option.image} variant="rounded" sx={{ width: 40, height: 40 }} />}
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{option.name}</Typography>
                                                                <Typography variant="caption" color="text.secondary">฿{option.price.toLocaleString()}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </li>
                                                );
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </CustomTabPanel>

                            <CustomTabPanel value={currentTab} index={1}>
                                <Stack spacing={3}>
                                    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #eee' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: '#4A151B', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase' }}>
                                            <Music size="18" variant="Bulk" color="#FF3366" /> Content & Greetings
                                        </Typography>
                                        <Stack spacing={2.5}>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                                <TextField label="Greeting Title" fullWidth value={formData.greeting} onChange={(e) => setFormData({ ...formData, greeting: e.target.value })} />
                                                <TextField label="Greeting Subtitle" fullWidth value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                                            </Box>
                                            <TextField label="Gift Box Button Text" fullWidth value={formData.openingText} onChange={(e) => setFormData({ ...formData, openingText: e.target.value })} />
                                            <TextField label="Main Message" multiline rows={4} fullWidth value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                                            <TextField label="Signer Name" fullWidth value={formData.signer} onChange={(e) => setFormData({ ...formData, signer: e.target.value })} />
                                        </Stack>
                                    </Box>

                                    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #eee' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: '#4A151B', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase' }}>
                                            <Gallery size="18" variant="Bulk" color="#FF3366" /> Style & Background
                                        </Typography>
                                        <Stack spacing={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>Background Color:</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <input type="color" value={formData.backgroundColor || "#FFF0F3"} onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })} style={{ width: 50, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>{formData.backgroundColor}</Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 120 }}>Swipe Hint Color:</Typography>
                                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                                        <Select
                                                            value={formData.swipeHintColor || 'white'}
                                                            onChange={(e) => setFormData({ ...formData, swipeHintColor: e.target.value as "white" | "red" })}
                                                        >
                                                            <MenuItem value="white">
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'white', border: '2px solid #ddd' }} />
                                                                    <span>White</span>
                                                                </Box>
                                                            </MenuItem>
                                                            <MenuItem value="red">
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#FF3366' }} />
                                                                    <span>Red</span>
                                                                </Box>
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <TextField
                                                    label="Swipe Hint Text"
                                                    fullWidth
                                                    size="small"
                                                    value={formData.swipeHintText}
                                                    onChange={(e) => setFormData({ ...formData, swipeHintText: e.target.value })}
                                                    placeholder="e.g. Swipe to see more"
                                                    helperText="แสดงคำแนะนำในการเลื่อนแผ่นภาพ"
                                                />
                                            </Box>

                                            <Divider />

                                            <Box>
                                                <Typography variant="body2" sx={{ mb: 2, fontWeight: 700 }}>Background Music:</Typography>
                                                <Stack spacing={2}>
                                                    <TextField
                                                        size="small"
                                                        label="YouTube Video ID"
                                                        fullWidth
                                                        value={formData.backgroundMusicYoutubeId}
                                                        onChange={(e) => setFormData({ ...formData, backgroundMusicYoutubeId: e.target.value })}
                                                        helperText="MP3 will take priority if both are set"
                                                        disabled={!!musicFile || !!formData.backgroundMusicUrl}
                                                    />
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Button component="label" variant="outlined" startIcon={<Music />} size="small" disabled={!!formData.backgroundMusicYoutubeId}>
                                                            {musicFile || formData.backgroundMusicUrl ? "Change MP3" : "Upload MP3"}
                                                            <input type="file" hidden accept="audio/mp3,audio/mpeg" onChange={(e) => setMusicFile(e.target.files?.[0] || null)} />
                                                        </Button>
                                                        {(musicFile || formData.backgroundMusicUrl) && (
                                                            <Chip
                                                                label={musicFile ? musicFile.name : "Current Music"}
                                                                onDelete={() => { setMusicFile(null); setFormData({ ...formData, backgroundMusicUrl: '' }); }}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                    {musicProgress > 0 && musicProgress < 100 && <LinearProgress variant="determinate" value={musicProgress} sx={{ height: 6, borderRadius: 3 }} />}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CustomTabPanel>

                            <CustomTabPanel value={currentTab} index={2}>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FF3366', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Gallery size="24" variant="Bulk" /> Card Memories
                                            <Chip label={memories.length} size="small" sx={{ bgcolor: '#FFF0F3', color: '#FF3366', fontWeight: 700 }} />
                                        </Typography>
                                    </Box>
                                    <Stack spacing={2.5}>
                                        <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                                            <SortableContext items={saving ? [] : memories.map(m => m.localId)} strategy={verticalListSortingStrategy}>
                                                {memories.map((memory, index) => (
                                                    <SortableMemoryItem key={memory.localId} id={memory.localId} memory={memory} index={index} handleRemoveMemory={handleRemoveMemory} handleFileChange={handleFileChange} handleMemoryChange={handleMemoryChange} disabled={saving} />
                                                ))}
                                            </SortableContext>
                                        </DndContext>

                                        {memories.length === 0 && <Box sx={{ p: 8, textAlign: 'center', border: '2px dashed #eee', borderRadius: 4, bgcolor: '#fcfcfc' }}>
                                            <Gallery size="48" color="#FF3366" variant="Bulk" style={{ opacity: 0.2, marginBottom: 16 }} />
                                            <Typography color="text.secondary" fontWeight={600}>No memories added yet</Typography>
                                        </Box>}

                                        {/* Action Buttons at Bottom */}
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 2,
                                            pt: 2,
                                            borderTop: memories.length > 0 ? '1px dashed #eee' : 'none',
                                            justifyContent: 'center'
                                        }}>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<Add />}
                                                sx={{
                                                    borderRadius: 3,
                                                    px: 3,
                                                    py: 1,
                                                    borderColor: '#FF3366',
                                                    color: '#FF3366',
                                                    '&:hover': { borderColor: '#E02D59', bgcolor: '#FFF0F3' }
                                                }}
                                            >
                                                Bulk Upload Images/Videos
                                                <input type="file" multiple hidden accept="image/*,video/*" onChange={handleBulkUpload} />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Add color="white" />}
                                                onClick={handleAddMemory}
                                                sx={{
                                                    borderRadius: 3,
                                                    px: 4,
                                                    py: 1,
                                                    bgcolor: '#FF3366',
                                                    '&:hover': { bgcolor: '#E02D59' },
                                                    boxShadow: '0 4px 12px rgba(255, 51, 102, 0.2)'
                                                }}
                                            >
                                                Add New Card (URL)
                                            </Button>
                                        </Box>

                                        <div ref={memoriesEndRef} />
                                    </Stack>
                                </Box>
                            </CustomTabPanel>
                        </Box>

                        {/* Right Column: Preview Column (Sticky) */}
                        <Box sx={{ position: { lg: 'sticky' }, top: 0, pt: { xs: 2, lg: 0 } }}>
                            <Box sx={{ p: 2, bgcolor: '#fdf2f4', borderRadius: 5, border: '1px solid #ffccd5', boxShadow: '0 10px 30px rgba(255, 51, 102, 0.05)' }}>
                                <Typography variant="caption" sx={{ mb: 2, fontWeight: 900, color: '#FF3366', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                    <Play size="14" variant="Bulk" /> Mobile Live Preview
                                </Typography>
                                <Box sx={{
                                    width: '100%',
                                    aspectRatio: '9/19',
                                    bgcolor: formData.backgroundColor || "#FFF0F3",
                                    borderRadius: '35px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.15), inset 0 0 0 4px #1a1a1a',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '6px solid #1a1a1a',
                                    position: 'relative'
                                }}>
                                    {/* Notch */}
                                    <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '35%', height: '18px', bgcolor: '#1a1a1a', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 10 }} />

                                    <Box sx={{ flex: 1, p: 2, pt: 4, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography sx={{ color: '#FF3366', fontSize: '0.7rem', fontWeight: 800, fontFamily: 'cursive' }}>{formData.greeting?.split(' ')[0] || "Happy"}</Typography>
                                            <Typography sx={{ color: '#4A151B', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', mt: -0.5 }}>{formData.greeting?.split(' ').slice(1).join(' ') || "VALENTINE"}</Typography>
                                        </Box>

                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', my: 1 }}>
                                            <Box sx={{ width: '85%', height: '80%', bgcolor: 'white', borderRadius: 3, boxShadow: '0 10px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid white', overflow: 'hidden' }}>
                                                <Gallery size="28" variant="Bulk" color="#FF3366" />
                                                <Typography sx={{ fontSize: '0.65rem', mt: 1, fontWeight: 800, color: '#FF3366' }}>{memories.length} Memories</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                                            <Typography sx={{ color: '#8B1D36', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', mb: 1 }}>{formData.subtitle || "Your Subtitle"}</Typography>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', p: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.5)' }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#4A151B', lineHeight: 1.4, maxHeight: 60, overflow: 'hidden' }}>{formData.message || "Your sweet message here..."}</Typography>
                                                <Typography sx={{ fontSize: '0.6rem', color: '#FF3366', fontWeight: 900, mt: 1 }}>- {formData.signer || "Signer"} -</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Decorations */}
                                    <Heart size="10" variant="Bulk" color="#FF3366" style={{ position: 'absolute', top: '12%', right: '12%', opacity: 0.3 }} />
                                    <Music size="12" color="#8B1D36" variant="Bulk" style={{ position: 'absolute', bottom: '15px', right: '15px', opacity: 0.4 }} />
                                </Box>
                                <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: '#FF3366', fontWeight: 800, fontSize: '0.7rem' }}>
                                    REAL-TIME PREVIEW
                                </Typography>
                            </Box>
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

            {/* QR Code Dialog */}
            <Dialog
                open={qrOpen}
                onClose={() => setQrOpen(false)
                }
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 0,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {/* Header */}
                    <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #eee', background: 'linear-gradient(135deg, #FFF0F3 0%, #FFE3E8 100%)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{ p: 1, bgcolor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(255,51,102,0.1)' }}>
                                <Scan size="24" variant="Bulk" color="#FF3366" />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#4A151B', lineHeight: 1.2 }}>
                                    Print Valentine Card
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    ขนาดมาตรฐานนามบัตร 90×55mm @300dpi
                                </Typography>
                            </Box>
                        </Box>

                        {/* Editable Title */}
                        <TextField
                            fullWidth
                            size="small"
                            label="ชื่อที่แสดงบนการ์ด (แก้ไขได้)"
                            value={editableTitle}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="เว้นว่างถ้าไม่ต้องการแสดงชื่อ"
                            helperText="ชื่อจะแสดงเหนือ QR Code บนการ์ด"
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': { borderRadius: 2 }
                            }}
                        />
                    </Box>

                    {/* Preview Cards */}
                    <Box sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#4A151B', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Gallery size="18" variant="Bulk" color="#FF3366" />
                            ตัวอย่างการ์ดก่อนดาวน์โหลด
                            {generatingPreview && <CircularProgress size={16} sx={{ ml: 1 }} />}
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            {/* Vertical Card Preview */}
                            <Box>
                                <Typography variant="caption" sx={{ mb: 1, fontWeight: 700, color: '#FF3366', display: 'block' }}>
                                    📱 แนวตั้ง (55×90mm)
                                </Typography>
                                <Box sx={{
                                    bgcolor: 'white',
                                    borderRadius: 3,
                                    p: 1.5,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {previewVertical ? (
                                        <img
                                            src={previewVertical}
                                            alt="Vertical Card Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: 280,
                                                borderRadius: 8,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CircularProgress size={30} sx={{ color: '#FF3366' }} />
                                        </Box>
                                    )}
                                </Box>
                                <Button
                                    fullWidth
                                    onClick={handleDownloadQR}
                                    variant="contained"
                                    startIcon={<Printer size="18" variant="Bulk" color="white" />}
                                    sx={{
                                        mt: 1.5,
                                        borderRadius: '10px',
                                        py: 1,
                                        fontWeight: 700,
                                        bgcolor: '#FF3366',
                                        '&:hover': { bgcolor: '#E02D59' },
                                        boxShadow: '0 4px 15px rgba(255, 51, 102, 0.2)'
                                    }}
                                >
                                    Download แนวตั้ง
                                </Button>
                            </Box>

                            {/* Horizontal Card Preview */}
                            <Box>
                                <Typography variant="caption" sx={{ mb: 1, fontWeight: 700, color: '#FF3366', display: 'block' }}>
                                    🖼️ แนวนอน (90×55mm)
                                </Typography>
                                <Box sx={{
                                    bgcolor: 'white',
                                    borderRadius: 3,
                                    p: 1.5,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: 200
                                }}>
                                    {previewHorizontal ? (
                                        <img
                                            src={previewHorizontal}
                                            alt="Horizontal Card Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: 180,
                                                borderRadius: 8,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CircularProgress size={30} sx={{ color: '#FF3366' }} />
                                        </Box>
                                    )}
                                </Box>
                                <Button
                                    fullWidth
                                    onClick={handleDownloadHorizontalQR}
                                    variant="outlined"
                                    startIcon={<DirectDown size="18" variant="Bulk" color="#FF3366" />}
                                    sx={{
                                        mt: 1.5,
                                        borderRadius: '10px',
                                        py: 1,
                                        fontWeight: 700,
                                        color: '#FF3366',
                                        borderColor: '#FF3366',
                                        '&:hover': { bgcolor: '#FFF0F3', borderColor: '#FF3366' },
                                    }}
                                >
                                    Download แนวนอน
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Footer Actions */}
                    <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            onClick={handleDownloadOnlyQR}
                            variant="text"
                            startIcon={<Scan size="18" variant="Bulk" color="inherit" />}
                            sx={{ fontWeight: 600, color: 'text.secondary' }}
                        >
                            Download QR Only
                        </Button>
                        <Button
                            onClick={() => setQrOpen(false)}
                            variant="text"
                            sx={{ fontWeight: 600, color: 'text.secondary' }}
                        >
                            ปิด
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Customer Summary Modal */}
            <Dialog
                open={summaryOpen}
                onClose={() => setSummaryOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #fdf2f4 0%, #fff 100%)',
                    p: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                            p: 1.5,
                            bgcolor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(255, 51, 102, 0.1)',
                            display: 'flex'
                        }}>
                            <Profile size="28" variant="Bulk" color="#FF3366" />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#4A151B', lineHeight: 1.2 }}>
                                Customer Summary
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                ข้อมูลสรุปและรายละเอียดลูกค้า
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={() => setSummaryOpen(false)} size="small" sx={{ color: '#4A151B' }}>
                        <CloseCircle size="24" variant="Bulk" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                        {/* Primary Info */}
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: '#FF3366', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2, mt: 3 }}>
                                📋 ข้อมูลการสั่งซื้อ (Job Info)
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#4A151B' }}>
                                    {selectedSummaryCard?.jobName || "ไม่ได้ระบุชื่อเรียกงาน"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Title: <span style={{ color: '#4A151B' }}>{selectedSummaryCard?.title}</span>
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label={`Slug: /valentine/${selectedSummaryCard?.slug}`} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1 }} />
                                    <IconButton size="small" onClick={() => window.open(`/valentine/${selectedSummaryCard?.slug}`, '_blank')}>
                                        <Global size="16" color="#FF3366" />
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Contact Info */}
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: '#FF3366', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>
                                📞 ข้อมูลติดต่อ (Contact Info)
                            </Typography>
                            <Stack spacing={2.5}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ color: '#FF3366', mt: 0.5 }}><Call size="20" variant="Bulk" /></Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#4A151B' }}>Phone Number</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {selectedSummaryCard?.customerPhone ? (
                                                <Typography component="span" variant="body2" sx={{ color: '#FF3366', fontWeight: 700, cursor: 'pointer', "&:hover": { textDecoration: 'underline' } }} onClick={() => window.location.href = `tel:${selectedSummaryCard.customerPhone}`}>
                                                    {selectedSummaryCard.customerPhone}
                                                </Typography>
                                            ) : "ไม่ได้ระบุเบอร์โทร"}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ color: '#FF3366', mt: 0.5 }}><Location size="20" variant="Bulk" /></Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#4A151B' }}>Delivery Address</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                                            {selectedSummaryCard?.customerAddress || "ไม่ได้ระบุที่อยู่"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Notes */}
                        <Box sx={{ p: 2, bgcolor: '#FFF0F3', borderRadius: 2, border: '1px dashed #FF3366' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <ClipboardText size="20" variant="Bulk" color="#FF3366" />
                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#4A151B' }}>Internal Note</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: '#4A151B', fontWeight: 600, opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                                {selectedSummaryCard?.note || "ไม่มีบันทึกเพิ่มเติม"}
                            </Typography>
                        </Box>

                        {/* Ordered Products */}
                        {selectedSummaryCard?.orderedProducts && selectedSummaryCard.orderedProducts.length > 0 && (
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: '#FF3366', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>
                                    💐 สินค้าที่สั่ง (Ordered Products)
                                </Typography>
                                <Stack spacing={1.5}>
                                    {selectedSummaryCard.orderedProducts.map((product) => (
                                        <Paper key={product.id} elevation={0} sx={{ p: 1.5, bgcolor: '#fcfcfc', border: '1px solid #eee', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {product.image ? (
                                                <Avatar src={product.image} variant="rounded" sx={{ width: 50, height: 50, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} />
                                            ) : (
                                                <Avatar variant="rounded" sx={{ width: 50, height: 50, bgcolor: '#FFF0F3' }}><Heart size="24" variant="Bulk" color="#FF3366" /></Avatar>
                                            )}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#4A151B' }}>{product.name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{product.category}</Typography>
                                            </Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#FF3366' }}>
                                                ฿{product.price.toLocaleString()}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#fcfcfc', borderTop: '1px solid #f0f0f0' }}>
                    <Button
                        fullWidth
                        onClick={() => setSummaryOpen(false)}
                        variant="contained"
                        sx={{
                            bgcolor: '#4A151B',
                            '&:hover': { bgcolor: '#2D0D10' },
                            borderRadius: 2,
                            fontWeight: 700,
                            py: 1.2
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            < Dialog
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
            </Dialog >

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
        </Box >
    );
}

