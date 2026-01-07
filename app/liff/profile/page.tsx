'use client';

import { Container, Typography, Card, CardContent, Avatar, Box, Divider, Stack, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Call, Sms, Building, LogoutCurve } from 'iconsax-react';
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
            <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
                <Typography>กำลังโหลด...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            {/* Profile Card */}
            <Card sx={{ borderRadius: 3, mb: 3, overflow: 'visible' }}>
                <Box
                    sx={{
                        height: 80,
                        background: 'linear-gradient(135deg, var(--primary) 0%, #0d7472 100%)',
                        borderRadius: '12px 12px 0 0',
                    }}
                />
                <CardContent sx={{ pt: 0, pb: 3, position: 'relative' }}>
                    <Avatar
                        src={profile?.pictureUrl}
                        alt={profile?.displayName}
                        sx={{
                            width: 80,
                            height: 80,
                            border: '4px solid white',
                            position: 'absolute',
                            top: -40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                    />
                    <Box sx={{ pt: 6, textAlign: 'center' }}>
                        <Typography
                            variant="h6"
                            sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}
                        >
                            {profile?.displayName}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.85rem',
                                color: 'var(--primary)',
                            }}
                        >
                            SETEVENT Member
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            mb: 2,
                            color: 'var(--foreground)',
                        }}
                    >
                        ข้อมูลติดต่อ
                    </Typography>
                    <Stack spacing={2} divider={<Divider />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Building size={20} color="var(--primary)" variant="Bulk" />
                            <Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: 'gray' }}>
                                    บริษัท
                                </Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>
                                    {customerInfo?.companyName || '-'}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Call size={20} color="var(--primary)" variant="Bulk" />
                            <Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: 'gray' }}>
                                    เบอร์โทร
                                </Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>
                                    {customerInfo?.phone || '-'}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Sms size={20} color="var(--primary)" variant="Bulk" />
                            <Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: 'gray' }}>
                                    อีเมล
                                </Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem' }}>
                                    {customerInfo?.email || '-'}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Close Button */}
            <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutCurve size={20} />}
                onClick={handleClose}
                sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontFamily: 'var(--font-prompt)',
                    borderColor: 'rgba(0,0,0,0.2)',
                    color: 'gray',
                }}
            >
                ปิดหน้านี้
            </Button>
        </Container>
    );
}
