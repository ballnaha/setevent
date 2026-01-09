'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Avatar,
    Chip,
    Stack,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Fade,
    Grid,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { SearchNormal1, User, Calendar, Edit2, Building, Call, Sms, ArrowRight2, CloseCircle, Refresh2 } from 'iconsax-react';
import TopSnackbar from '@/components/ui/TopSnackbar';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

interface SalesUser {
    id: string;
    name: string | null;
    email: string | null;
}

interface Customer {
    id: string;
    lineUid: string;
    displayName: string | null;
    pictureUrl: string | null;
    phone: string | null;
    email: string | null;
    companyName: string | null;
    salesId: string | null;
    status: string;
    createdAt: string;
    sales: SalesUser | null;
    _count: {
        events: number;
    };
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    new: { label: 'ใหม่', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
    pending: { label: 'รอติดต่อ', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    active: { label: 'ใช้งาน', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
};

export default function CustomersPage() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({ displayName: '', companyName: '', phone: '', email: '', status: 'new', salesId: '' });
    const [saving, setSaving] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

    useEffect(() => {
        fetchCustomers();
        fetchSalesUsers();
    }, []);

    async function handleSyncLine() {
        setSyncing(true);
        setSnackbar({ open: true, message: 'กำลังดึงข้อมูลจาก LINE OA...', severity: 'info' });
        try {
            const res = await fetch('/api/line/sync-followers', { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                setSnackbar({ open: true, message: `ดึงข้อมูลสำเร็จ! เพิ่มลูกค้าใหม่ ${data.new} คน`, severity: 'success' });
                fetchCustomers();
            } else {
                throw new Error(data.error || 'Failed to sync');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', severity: 'error' });
        } finally {
            setSyncing(false);
        }
    }

    useEffect(() => {
        let filtered = customers;

        // Filter by status
        if (statusFilter) {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Filter by search
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    c.displayName?.toLowerCase().includes(searchLower) ||
                    c.email?.toLowerCase().includes(searchLower) ||
                    c.phone?.includes(search) ||
                    c.companyName?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredCustomers(filtered);
    }, [customers, search, statusFilter]);

    async function fetchCustomers() {
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSalesUsers() {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            // Filter only sales users
            setSalesUsers(data.filter((u: any) => u.role === 'sales' || u.role === 'admin'));
        } catch (error) {
            console.error('Error fetching sales users:', error);
        }
    }

    function handleOpenEdit(customer: Customer) {
        setEditingCustomer(customer);
        setFormData({
            displayName: customer.displayName || '',
            companyName: customer.companyName || '',
            phone: customer.phone || '',
            email: customer.email || '',
            status: customer.status,
            salesId: customer.salesId || '',
        });
        setEditDialogOpen(true);
    }

    function handleCloseEdit() {
        setEditDialogOpen(false);
        setEditingCustomer(null);
        setFormData({ displayName: '', companyName: '', phone: '', email: '', status: 'new', salesId: '' });
    }

    async function handleSave() {
        if (!editingCustomer) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSnackbar({ open: true, message: 'อัพเดทข้อมูลลูกค้าสำเร็จ', severity: 'success' });
                handleCloseEdit();
                fetchCustomers();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update customer');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Box sx={{ pb: { xs: 10, md: 4 }, maxWidth: '100%', overflowX: 'hidden' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                mb: 1,
                                color: '#1a1a1a',
                            }}
                        >
                            ลูกค้าทั้งหมด
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                            จัดการข้อมูลลูกค้าจาก LINE • {customers.length} ลูกค้า
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="ดึงข้อมูลล่าสุดจาก LINE OA" arrow>
                            <Button
                                variant="outlined"
                                onClick={handleSyncLine}
                                disabled={loading || syncing}
                                startIcon={syncing ? <CircularProgress size={18} color="inherit" /> : <Refresh2 size={18} color="#1a1a1a" />}
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    textTransform: 'none',
                                    color: '#1a1a1a',
                                    borderColor: '#ddd',
                                    bgcolor: 'white',
                                    '&:hover': { bgcolor: '#f5f5f5', borderColor: '#ccc' },
                                }}
                            >
                                {syncing ? 'กำลังดึง...' : 'ดึงข้อมูล LINE'}
                            </Button>
                        </Tooltip>
                        <Tooltip title="รีเฟรชรายการลูกค้า" arrow>
                            <Button
                                variant="contained"
                                onClick={() => { setLoading(true); fetchCustomers(); }}
                                disabled={loading || syncing}
                                startIcon={loading && !syncing ? <CircularProgress size={18} color="inherit" /> : <Refresh2 size={18} color="white" />}
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    bgcolor: '#1a1a1a',
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 1,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    '&:hover': { bgcolor: '#333' },
                                    '&:disabled': { bgcolor: '#ccc' },
                                }}
                            >
                                รีเฟรช
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            {/* Search & Stats */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 3
            }}>
                <TextField
                    placeholder="ค้นหาชื่อ, บริษัท, อีเมล หรือเบอร์โทร..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            '& fieldset': { border: '1px solid #eee' },
                            '&:hover fieldset': { borderColor: '#ddd' },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchNormal1 size={20} color="#999" />
                            </InputAdornment>
                        ),
                        sx: { fontFamily: 'var(--font-prompt)' },
                    }}
                />

                {/* Filters - Swiper for mobile */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: { xs: 'calc(100vw - 32px)', md: '100%' }, // Mobile layout fix
                        mx: 'auto',
                        '& .swiper': {
                            width: '100%',
                            padding: '4px 4px 12px 4px !important',
                        },
                        '& .swiper-slide': {
                            width: 'auto',
                        }
                    }}
                >
                    <Swiper
                        slidesPerView="auto"
                        spaceBetween={10}
                        freeMode={true}
                        modules={[FreeMode]}
                        grabCursor={true}
                        observer={true}
                        observeParents={true}
                    >
                        <SwiperSlide>
                            <Chip
                                label={`ทั้งหมด (${customers.length})`}
                                onClick={() => setStatusFilter(null)}
                                sx={{
                                    height: 36,
                                    borderRadius: 3,
                                    px: 1,
                                    bgcolor: statusFilter === null ? '#1a1a1a' : 'white',
                                    color: statusFilter === null ? 'white' : '#666',
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    border: statusFilter === null ? 'none' : '1px solid #eee',
                                    boxShadow: statusFilter === null ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            />
                        </SwiperSlide>
                        {Object.entries(statusLabels).map(([key, config]) => {
                            const count = customers.filter(c => c.status === key).length;
                            const isActive = statusFilter === key;
                            return (
                                <SwiperSlide key={key}>
                                    <Chip
                                        label={`${config.label} (${count})`}
                                        onClick={() => setStatusFilter(isActive ? null : key)}
                                        sx={{
                                            height: 36,
                                            borderRadius: 3,
                                            px: 1,
                                            color: isActive ? 'white' : config.color,
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 500,
                                            border: isActive ? 'none' : `1px solid ${config.color}30`,
                                            bgcolor: isActive ? config.color : `${config.bgColor}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: isActive ? `0 4px 12px ${config.color}40` : 'none',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Box>
            </Box>

            {/* Table or Card List */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : (
                <>
                    {/* Desktop Table - Hidden on Mobile */}
                    <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', bgcolor: 'white' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ลูกค้า</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>บริษัท/องค์กร</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ติดต่อ</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานะ</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>Sales ที่ดูแล</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>จำนวนงาน</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>วันที่เพิ่ม</TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>จัดการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers.map((customer, index) => (
                                    <Fade in={true} timeout={200 + index * 30} key={customer.id}>
                                        <TableRow hover sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        src={customer.pictureUrl || undefined}
                                                        sx={{ width: 44, height: 44, border: '2px solid #f0f0f0' }}
                                                    >
                                                        <User size={20} />
                                                    </Avatar>
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500 }}>
                                                        {customer.displayName || 'ไม่ระบุชื่อ'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {customer.companyName ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Building size={16} color="#666" variant="Bold" />
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem', color: '#1a1a1a' }}>
                                                            {customer.companyName}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#ccc' }}>
                                                        ยังไม่ระบุ
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    {customer.email && (
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', color: 'gray' }}>
                                                            📧 {customer.email}
                                                        </Typography>
                                                    )}
                                                    {customer.phone && (
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', color: 'gray' }}>
                                                            📱 {customer.phone}
                                                        </Typography>
                                                    )}
                                                    {!customer.email && !customer.phone && (
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', color: '#ccc' }}>
                                                            -
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={statusLabels[customer.status]?.label || customer.status}
                                                    size="small"
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 500,
                                                        bgcolor: statusLabels[customer.status]?.bgColor || 'rgba(0,0,0,0.05)',
                                                        color: statusLabels[customer.status]?.color || '#666',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {customer.sales ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#F59E0B' }}>
                                                            {customer.sales.name?.charAt(0) || 'S'}
                                                        </Avatar>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                                            {customer.sales.name || customer.sales.email}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#ccc' }}>
                                                        ยังไม่มอบหมาย
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Calendar size={16} color="gray" />
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem' }}>
                                                        {customer._count.events} งาน
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'gray' }}>
                                                    {new Date(customer.createdAt).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="แก้ไขข้อมูล" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenEdit(customer)}
                                                        sx={{
                                                            bgcolor: '#f5f5f5',
                                                            '&:hover': { bgcolor: '#e8e8e8' }
                                                        }}
                                                    >
                                                        <Edit2 size={16} color="#666" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <Typography sx={{ color: '#999' }}>
                                                {search ? 'ไม่พบลูกค้าที่ค้นหา' : 'ยังไม่มีลูกค้า'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Mobile Card List - Visible on Mobile Only */}
                    <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
                        {filteredCustomers.map((customer, index) => (
                            <Fade in={true} timeout={200 + index * 30} key={customer.id}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                        border: '1px solid #f5f5f5',
                                        overflow: 'visible',
                                    }}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Avatar
                                                    src={customer.pictureUrl || undefined}
                                                    sx={{
                                                        width: 52,
                                                        height: 52,
                                                        border: '2px solid white',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    <User size={24} />
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1rem', color: '#1a1a1a' }}>
                                                        {customer.displayName || 'ไม่ระบุชื่อ'}
                                                    </Typography>
                                                    {customer.companyName && (
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Building size={14} variant="Bold" color="#666" />
                                                            {customer.companyName}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenEdit(customer)}
                                                sx={{ bgcolor: '#f9f9f9', ml: -1 }}
                                            >
                                                <Edit2 size={18} color="#666" />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                                            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 2 }}>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#999', mb: 0.5 }}>สถานะ</Typography>
                                                <Chip
                                                    label={statusLabels[customer.status]?.label || customer.status}
                                                    size="small"
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        height: 24,
                                                        bgcolor: statusLabels[customer.status]?.bgColor || 'rgba(0,0,0,0.05)',
                                                        color: statusLabels[customer.status]?.color || '#666',
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ bgcolor: '#f9f9f9', p: 1.5, borderRadius: 2 }}>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#999', mb: 0.5 }}>งานทั้งหมด</Typography>
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1a1a1a' }}>
                                                    {customer._count.events} งาน
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={1} sx={{ mb: 2 }}>
                                            {(customer.email || customer.phone) ? (
                                                <>
                                                    {customer.phone && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Call size={14} color="#3B82F6" variant="Bold" />
                                                            </Box>
                                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem', color: '#4B5563' }}>
                                                                {customer.phone}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    {customer.email && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Sms size={14} color="#10B981" variant="Bold" />
                                                            </Box>
                                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem', color: '#4B5563', wordBreak: 'break-all' }}>
                                                                {customer.email}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.85rem', color: '#ccc', textAlign: 'center', py: 1 }}>
                                                    - ไม่มีข้อมูลติดต่อ -
                                                </Typography>
                                            )}
                                        </Stack>

                                        <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>ดูแลโดย:</Typography>
                                                {customer.sales ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem', bgcolor: '#F59E0B' }}>
                                                            {customer.sales.name?.charAt(0) || 'S'}
                                                        </Avatar>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', fontWeight: 500 }}>
                                                            {customer.sales.name?.split(' ')[0]}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography sx={{ fontSize: '0.8rem', color: '#ccc' }}>-</Typography>
                                                )}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#bbb' }}>
                                                {new Date(customer.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography sx={{ color: '#999', fontFamily: 'var(--font-prompt)' }}>
                                    {search ? 'ไม่พบลูกค้าที่ค้นหา' : 'ยังไม่มีลูกค้าในระบบ'}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </>
            )}

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={handleCloseEdit}
                maxWidth="sm"
                fullWidth
                fullScreen={fullScreen}
                PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3 } }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box component="span">✏️ แก้ไขข้อมูลลูกค้า</Box>
                    {fullScreen && (
                        <IconButton onClick={handleCloseEdit} edge="end" color="inherit">
                            <CloseCircle size={24} color="#666" />
                        </IconButton>
                    )}
                </DialogTitle>
                <DialogContent>
                    {editingCustomer && (
                        <Box sx={{ pt: 1 }}>
                            {/* Customer Info Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                                <Avatar
                                    src={editingCustomer.pictureUrl || undefined}
                                    sx={{ width: 56, height: 56, border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                >
                                    <User size={24} />
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1a1a1a' }}>
                                        {editingCustomer.displayName || 'ไม่ระบุชื่อ'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>
                                        LINE UID: {editingCustomer.lineUid}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    label="ชื่อที่แสดง"
                                    fullWidth
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                    InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                />
                                <TextField
                                    label="ชื่อบริษัท/องค์กร"
                                    fullWidth
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="เช่น บริษัท ABC จำกัด, มหาวิทยาลัย XYZ"
                                    InputProps={{
                                        sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Building size={18} color="#666" />
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                    helperText="ระบุชื่อบริษัท/องค์กรเพื่อช่วยระบุลูกค้า"
                                />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        label="อีเมล"
                                        type="email"
                                        fullWidth
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                        InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                    <TextField
                                        label="เบอร์โทร"
                                        fullWidth
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                        InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                </Box>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>สถานะ</InputLabel>
                                    <Select
                                        value={formData.status}
                                        label="สถานะ"
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                    >
                                        {Object.entries(statusLabels).map(([key, config]) => (
                                            <MenuItem key={key} value={key}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        bgcolor: config.color
                                                    }} />
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>{config.label}</Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>Sales ที่ดูแล</InputLabel>
                                    <Select
                                        value={formData.salesId}
                                        label="Sales ที่ดูแล"
                                        onChange={(e) => setFormData({ ...formData, salesId: e.target.value })}
                                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                                    >
                                        <MenuItem value="">
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#999' }}>
                                                ยังไม่มอบหมาย
                                            </Typography>
                                        </MenuItem>
                                        {salesUsers.map((sales) => (
                                            <MenuItem key={sales.id} value={sales.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: '#F59E0B' }}>
                                                        {sales.name?.charAt(0) || 'S'}
                                                    </Avatar>
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>
                                                        {sales.name || sales.email}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button
                        onClick={handleCloseEdit}
                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2, px: 3 }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: '#1a1a1a',
                            borderRadius: 2,
                            px: 4,
                            '&:hover': { bgcolor: '#333' }
                        }}
                    >
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
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
