'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    TextField,
    Button,
    Avatar,
    InputAdornment,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    Grid
} from '@mui/material';
import { User, Sms, Lock, ShieldSecurity, Briefcase, UserSquare, Edit } from 'iconsax-react';
import { useSession } from 'next-auth/react';
import TopSnackbar from '@/components/ui/TopSnackbar';

interface UserProfile {
    id: string;
    username: string | null;
    name: string | null;
    email: string | null;
    role: string;
    position: string | null;
    status: string;
    createdAt: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        position: '',
        password: '',
        confirmPassword: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch('/api/admin/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormData(prev => ({
                    ...prev,
                    username: data.username || '',
                    name: data.name || '',
                    email: data.email || '',
                    position: data.position || ''
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setSnackbar({ open: true, message: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (formData.password && formData.password !== formData.confirmPassword) {
            setSnackbar({ open: true, message: 'รหัสผ่านไม่ตรงกัน', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    name: formData.name,
                    email: formData.email,
                    position: formData.position, // Note: Position might not be updatable depending on logic, but including for now
                    password: formData.password || undefined,
                    confirmPassword: formData.confirmPassword || undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                setProfile(data);
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                setSnackbar({ open: true, message: 'อัพเดทโปรไฟล์สำเร็จ', severity: 'success' });
            } else {
                throw new Error(data.error || 'Failed to update profile');
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress sx={{ color: 'var(--primary)' }} />
            </Box>
        );
    }

    const roleColor = profile?.role === 'admin' ? '#DC2626' : profile?.role === 'sales' ? '#F59E0B' : '#10B981';
    const RoleIcon = profile?.role === 'admin' ? ShieldSecurity : profile?.role === 'sales' ? UserSquare : User;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: '#1a1a1a' }}>
                    โปรไฟล์ของฉัน
                </Typography>
                <Typography sx={{ color: '#666', mt: 0.5, fontFamily: 'var(--font-prompt)' }}>
                    จัดการข้อมูลส่วนตัวและรหัสผ่าน
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Left Column: Avatar & Quick Info */}
                <Box sx={{ flex: { md: '0 0 350px' } }}>
                    <Card sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '0 auto',
                                mb: 2,
                                bgcolor: `${roleColor}15`,
                                color: roleColor,
                                fontSize: '3rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-prompt)',
                                border: `2px solid ${roleColor}30`
                            }}
                        >
                            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>

                        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1a1a1a' }}>
                            {profile?.name}
                        </Typography>

                        <Typography sx={{ color: '#666', fontSize: '0.9rem', mb: 2, fontFamily: 'var(--font-prompt)' }}>
                            {profile?.email}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<RoleIcon size={16} color={roleColor} />}
                                label={profile?.role?.toUpperCase()}
                                size="small"
                                sx={{
                                    bgcolor: `${roleColor}15`,
                                    color: roleColor,
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 600,
                                    border: `1px solid ${roleColor}30`
                                }}
                            />
                            {profile?.status === 'active' && (
                                <Chip
                                    label="Active"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10B981',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600
                                    }}
                                />
                            )}
                        </Box>
                    </Card>
                </Box>

                {/* Right Column: Edit Form */}
                <Box sx={{ flex: 1 }}>
                    <Card sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            แก้ไขข้อมูล
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Username"
                                value={formData.username}
                                disabled
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2, bgcolor: '#f9f9f9' }
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            <TextField
                                label="ชื่อ-นามสกุล"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Edit size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 }
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            <TextField
                                label="อีเมล"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Sms size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 }
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            <TextField
                                label="ตำแหน่ง"
                                value={formData.position}
                                disabled
                                fullWidth
                                helperText="*ตำแหน่งไม่สามารถแก้ไขได้"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Briefcase size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2, bgcolor: '#f9f9f9' }
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#1a1a1a' }}>
                                เปลี่ยนรหัสผ่าน
                            </Typography>

                            <TextField
                                label="รหัสผ่านใหม่"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                fullWidth
                                placeholder="เว้นว่างไว้หากไม่ต้องการเปลี่ยน"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 }
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            <TextField
                                label="ยืนยันรหัสผ่านใหม่"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                fullWidth
                                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                                helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? "รหัสผ่านไม่ตรงกัน" : ""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={20} color="#999" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 }
                                }}
                                InputLabelProps={{ sx: { fontFamily: 'var(--font-prompt)' } }}
                            />

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSave}
                                    disabled={saving}
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        bgcolor: '#1a1a1a',
                                        borderRadius: 2,
                                        px: 6,
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
                                    {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Box>

            <TopSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Box>
    );
}
