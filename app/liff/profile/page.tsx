'use client';

import { Container, Typography, Card, CardContent, Avatar, Box, Divider, Stack, Button, IconButton, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Call, Sms, Building, LogoutCurve, ArrowRight2, Setting2, ShieldTick, User, Notification } from 'iconsax-react';
import { initializeLiff, LiffProfile, closeLiff } from '@/lib/liff';

export default function LiffProfilePage() {
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [customerInfo, setCustomerInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const userProfile = await initializeLiff();
                if (userProfile) {
                    setProfile(userProfile);

                    // Fetch customer info
                    const res = await fetch('/api/liff/profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ lineUid: userProfile.userId }),
                    });
                    const data = await res.json();
                    setCustomerInfo(data.customer);
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const handleClose = () => {
        closeLiff();
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            border: '3px solid #E2E8F0',
                            borderTopColor: '#3B82F6',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B' }}>
                    กำลังโหลดโปรไฟล์...
                </Typography>
            </Container>
        );
    }

    const infoItems = [
        { icon: <Building size={22} variant="Bulk" color="#3B82F6" />, label: 'บริษัท / องค์กร', value: customerInfo?.companyName || 'ไม่ระบุข้อมูล', sub: 'Company Information' },
        { icon: <Call size={22} variant="Bulk" color="#10B981" />, label: 'เบอร์โทรศัพท์ติดต่อ', value: customerInfo?.phone || 'ไม่ระบุข้อมูล', sub: 'Primary Phone Number' },
        { icon: <Sms size={22} variant="Bulk" color="#F59E0B" />, label: 'อีเมลแอดเดรส', value: customerInfo?.email || 'ไม่ระบุข้อมูล', sub: 'Contact Email' },
    ];

    return (
        <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 12 }}>
            {/* Header / Background Area */}
            <Box
                sx={{
                    height: 220,
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 4
                }}
            >
                {/* Decorative Elements */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }} />
                <Box sx={{ position: 'absolute', bottom: -100, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)' }} />

                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        src={profile?.pictureUrl}
                        alt={profile?.displayName}
                        sx={{
                            width: 100,
                            height: 100,
                            border: '4px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 5,
                            right: 5,
                            width: 24,
                            height: 24,
                            bgcolor: '#10B981',
                            borderRadius: '50%',
                            border: '3px solid #0F172A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ShieldTick size={12} variant="Bold" color="white" />
                    </Box>
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        mt: 2,
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    {profile?.displayName}
                </Typography>
                <Box
                    sx={{
                        mt: 0.5,
                        px: 1.5,
                        py: 0.2,
                        borderRadius: 10,
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.75rem',
                            color: '#60A5FA',
                            fontWeight: 600,
                            letterSpacing: 0.5
                        }}
                    >
                        PREMIUM MEMBER
                    </Typography>
                </Box>
            </Box>

            <Container maxWidth="sm" sx={{ mt: -3, position: 'relative', zIndex: 1 }}>

                {/* Info List */}
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#1E293B',
                        mb: 2,
                        ml: 1
                    }}
                >
                    ข้อมูลส่วนตัว
                </Typography>

                <Stack spacing={2} sx={{ mb: 4 }}>
                    {infoItems.map((item, index) => (
                        <Card
                            key={index}
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                border: '1px solid #F1F5F9',
                                bgcolor: 'white',
                                transition: 'transform 0.2s',
                                '&:active': { transform: 'scale(0.98)' }
                            }}
                        >
                            <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(0,0,0,0.02)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>
                                        {item.label}
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}>
                                        {item.value}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}

