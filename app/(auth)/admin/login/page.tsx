'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { Sms, Lock, LoginCurve, User } from 'iconsax-react';

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                username: credentials.username,
                password: credentials.password,
                redirect: false,
            });

            if (result?.error) {
                setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else {
                router.push('/admin');
                router.refresh();
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            sx={{
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/logo_white.png"
                            alt="SETEVENT Logo"
                            style={{ height: '60px', width: 'auto' }}
                        />
                    </Box>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.7)' }}>
                        เข้าสู่ระบบผู้ดูแลระบบ (Admin)
                    </Typography>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ffcdd2',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        name="username"
                        placeholder="ชื่อผู้ใช้"
                        value={credentials.username}
                        onChange={handleChange}
                        sx={{
                            mb: 2.5,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.05)',
                                borderRadius: 2,
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <User size={20} color="rgba(255,255,255,0.6)" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        name="password"
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={credentials.password}
                        onChange={handleChange}
                        sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.05)',
                                borderRadius: 2,
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock size={20} color="rgba(255,255,255,0.6)" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            bgcolor: 'var(--primary)',
                            backgroundImage: 'linear-gradient(90deg, #0A5C5A 0%, #064544 100%)',
                            boxShadow: '0 4px 15px rgba(10, 92, 90, 0.4)',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(10, 92, 90, 0.6)',
                                transform: 'translateY(-1px)',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
                    </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.8rem'
                        }}
                    >
                        &copy; 2026 SetEvent. All rights reserved.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
