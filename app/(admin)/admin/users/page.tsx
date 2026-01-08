'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    InputAdornment,
    Fade,
    Tooltip,
} from '@mui/material';
import { Add, Edit2, Trash, UserSquare, ShieldSecurity, User as UserIcon, SearchNormal1, Warning2 } from 'iconsax-react';
import TopSnackbar from '@/components/ui/TopSnackbar';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    position: string | null;
    createdAt: string;
}

const roleConfig: Record<string, { label: string; color: string; bgColor: string; gradientFrom: string; gradientTo: string; icon: any }> = {
    admin: {
        label: 'Admin',
        color: '#DC2626',
        bgColor: 'rgba(220, 38, 38, 0.08)',
        gradientFrom: '#DC2626',
        gradientTo: '#991B1B',
        icon: ShieldSecurity
    },
    sales: {
        label: 'Sales',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.08)',
        gradientFrom: '#F59E0B',
        gradientTo: '#D97706',
        icon: UserSquare
    },
    user: {
        label: 'User',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        gradientFrom: '#10B981',
        gradientTo: '#059669',
        icon: UserIcon
    },
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user', position: '' });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            setFilteredUsers(users.filter(u =>
                u.name?.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query) ||
                u.position?.toLowerCase().includes(query)
            ));
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    async function fetchUsers() {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleOpenDialog(user?: User) {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                role: user.role,
                position: user.position || ''
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user', position: '' });
        }
        setDialogOpen(true);
    }

    function handleCloseDialog() {
        setDialogOpen(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'user', position: '' });
    }

    async function handleSave() {
        if (!formData.email) {
            setSnackbar({ open: true, message: 'กรุณากรอกอีเมล', severity: 'error' });
            return;
        }
        if (!editingUser && !formData.password) {
            setSnackbar({ open: true, message: 'กรุณากรอกรหัสผ่าน', severity: 'error' });
            return;
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            setSnackbar({ open: true, message: 'รหัสผ่านไม่ตรงกัน', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
            const method = editingUser ? 'PATCH' : 'POST';

            const body: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                position: formData.position || null,
            };
            if (formData.password) {
                body.password = formData.password;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setSnackbar({ open: true, message: editingUser ? 'อัพเดทผู้ใช้สำเร็จ' : 'เพิ่มผู้ใช้สำเร็จ', severity: 'success' });
                handleCloseDialog();
                fetchUsers();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save user');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setSaving(false);
        }
    }

    function openDeleteDialog(user: User) {
        setDeletingUser(user);
        setDeleteDialogOpen(true);
    }

    function closeDeleteDialog() {
        setDeleteDialogOpen(false);
        setDeletingUser(null);
    }

    async function handleConfirmDelete() {
        if (!deletingUser) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/users/${deletingUser.id}`, { method: 'DELETE' });
            if (res.ok) {
                setSnackbar({ open: true, message: 'ลบผู้ใช้สำเร็จ', severity: 'success' });
                fetchUsers();
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'ไม่สามารถลบผู้ใช้ได้', severity: 'error' });
        } finally {
            setDeleting(false);
            closeDeleteDialog();
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress sx={{ color: 'var(--primary)' }} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 3,
                mb: 4
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1a1a1a' }}>
                        จัดการผู้ใช้งาน
                    </Typography>
                    <Typography sx={{ color: '#666', mt: 0.5, fontSize: '0.95rem' }}>
                        จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ • {users.length} ผู้ใช้
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add size={20} color="white" />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        bgcolor: '#1a1a1a',
                        fontFamily: 'var(--font-prompt)',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                        '&:hover': {
                            bgcolor: '#333',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    เพิ่มผู้ใช้ใหม่
                </Button>
            </Box>

            {/* Search & Stats Bar */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                mb: 3
            }}>
                {/* Search */}
                <TextField
                    placeholder="ค้นหาผู้ใช้..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        maxWidth: { md: 400 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: 'white',
                            '&:hover fieldset': { borderColor: '#999' },
                            '&.Mui-focused fieldset': { borderColor: '#1a1a1a' },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchNormal1 size={18} color="#999" />
                            </InputAdornment>
                        ),
                        sx: { fontFamily: 'var(--font-prompt)' }
                    }}
                />

                {/* Role Stats */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {Object.entries(roleConfig).map(([key, config]) => {
                        const count = users.filter(u => u.role === key).length;
                        return (
                            <Chip
                                key={key}
                                label={`${config.label}: ${count}`}
                                size="small"
                                sx={{
                                    bgcolor: config.bgColor,
                                    color: config.color,
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 500,
                                    border: `1px solid ${config.color}20`,
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* Users Grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3
            }}>
                {filteredUsers.map((user, index) => {
                    const role = roleConfig[user.role] || roleConfig.user;
                    const RoleIcon = role.icon;
                    return (
                        <Fade in={true} timeout={300 + index * 50} key={user.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    border: '1px solid #f0f0f0',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                                        borderColor: role.color + '40',
                                    }
                                }}
                            >
                                {/* Gradient Header */}
                                <Box sx={{
                                    height: 6,
                                    background: `linear-gradient(90deg, ${role.gradientFrom}, ${role.gradientTo})`
                                }} />

                                <Box sx={{ p: 3 }}>
                                    {/* Avatar & Role */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: role.bgColor,
                                                color: role.color,
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-prompt)',
                                            }}
                                        >
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </Avatar>
                                        <Chip
                                            icon={<RoleIcon size={14} />}
                                            label={role.label}
                                            size="small"
                                            sx={{
                                                height: 26,
                                                bgcolor: role.bgColor,
                                                color: role.color,
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                '& .MuiChip-icon': { color: role.color }
                                            }}
                                        />
                                    </Box>

                                    {/* User Info */}
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.1rem', color: '#1a1a1a', mb: 0.5 }}>
                                        {user.name || 'ไม่ระบุชื่อ'}
                                    </Typography>
                                    <Typography sx={{ color: '#666', fontSize: '0.85rem', mb: 0.5 }}>
                                        {user.email}
                                    </Typography>
                                    {user.position && (
                                        <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>
                                            {user.position}
                                        </Typography>
                                    )}

                                    {/* Divider */}
                                    <Box sx={{ borderTop: '1px solid #f0f0f0', my: 2 }} />

                                    {/* Actions & Date */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ color: '#bbb' }}>
                                            สร้างเมื่อ {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="แก้ไข" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(user)}
                                                    sx={{
                                                        bgcolor: '#f5f5f5',
                                                        '&:hover': { bgcolor: '#e8e8e8' }
                                                    }}
                                                >
                                                    <Edit2 size={16} color="#666" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="ลบ" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openDeleteDialog(user)}
                                                    sx={{
                                                        bgcolor: 'rgba(239, 68, 68, 0.08)',
                                                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' }
                                                    }}
                                                >
                                                    <Trash size={16} color="#EF4444" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        </Fade>
                    );
                })}
            </Box>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ color: '#999', fontSize: '1.1rem' }}>
                        {searchQuery ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ยังไม่มีผู้ใช้งาน'}
                    </Typography>
                    {!searchQuery && (
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                            sx={{ mt: 2, fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                        >
                            เพิ่มผู้ใช้คนแรก
                        </Button>
                    )}
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, pb: 1 }}>
                    {editingUser ? '✏️ แก้ไขผู้ใช้' : '➕ เพิ่มผู้ใช้ใหม่'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="ชื่อ-นามสกุล"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <TextField
                            label="อีเมล"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />
                        <TextField
                            label="ตำแหน่ง"
                            fullWidth
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="เช่น ผู้จัดการ, เจ้าหน้าที่ขาย"
                            InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                            InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label={editingUser ? 'รหัสผ่านใหม่' : 'รหัสผ่าน'}
                                type="password"
                                fullWidth
                                required={!editingUser}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                helperText={editingUser ? 'เว้นว่างถ้าไม่ต้องการเปลี่ยน' : ''}
                                InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />
                            <TextField
                                label="ยืนยันรหัสผ่าน"
                                type="password"
                                fullWidth
                                required={!!formData.password}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                                helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'รหัสผ่านไม่ตรงกัน' : ''}
                                InputProps={{ sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 } }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel sx={{ fontFamily: 'var(--font-prompt)' }}>บทบาท</InputLabel>
                            <Select
                                value={formData.role}
                                label="บทบาท"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2 }}
                            >
                                {Object.entries(roleConfig).map(([key, config]) => (
                                    <MenuItem key={key} value={key}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: config.bgColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <config.icon size={16} color={config.color} />
                                            </Box>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)' }}>{config.label}</Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                    <Box sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                    }}>
                        <Warning2 size={32} color="#EF4444" variant="Bold" />
                    </Box>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.25rem', color: '#1a1a1a' }}>
                        ยืนยันการลบ
                    </Typography>
                </Box>
                <DialogContent sx={{ textAlign: 'center', pt: 0 }}>
                    <Typography sx={{ color: '#666', mb: 1 }}>
                        คุณกำลังจะลบผู้ใช้
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1a1a1a' }}>
                        {deletingUser?.name || deletingUser?.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', mt: 2 }}>
                        การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                    <Button
                        onClick={closeDeleteDialog}
                        variant="outlined"
                        disabled={deleting}
                        sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 2, px: 4 }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: '#EF4444',
                            borderRadius: 2,
                            px: 4,
                            '&:hover': { bgcolor: '#DC2626' }
                        }}
                    >
                        {deleting ? 'กำลังลบ...' : 'ลบผู้ใช้'}
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
