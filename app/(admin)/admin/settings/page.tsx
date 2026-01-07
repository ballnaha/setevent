'use client';

import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Divider } from '@mui/material';
import { Notification, Message } from 'iconsax-react';

export default function SettingsPage() {
    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        mb: 1,
                        color: '#1a1a1a',
                    }}
                >
                    ⚙️ ตั้งค่า
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                    จัดการการตั้งค่าระบบ
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Notification Settings */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(10, 92, 90, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Notification size={22} color="var(--primary)" variant="Bold" />
                                </Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.1rem' }}>
                                    การแจ้งเตือน
                                </Typography>
                            </Box>

                            <FormControlLabel
                                control={<Switch defaultChecked color="primary" />}
                                label="แจ้งเตือนเมื่อมีลูกค้าใหม่"
                                sx={{ fontFamily: 'var(--font-prompt)', mb: 2, width: '100%' }}
                            />
                            <Divider sx={{ my: 1 }} />
                            <FormControlLabel
                                control={<Switch defaultChecked color="primary" />}
                                label="แจ้งเตือนเมื่อมีข้อความใหม่"
                                sx={{ fontFamily: 'var(--font-prompt)', mb: 2, width: '100%' }}
                            />
                            <Divider sx={{ my: 1 }} />
                            <FormControlLabel
                                control={<Switch color="primary" />}
                                label="แจ้งเตือนทางอีเมล"
                                sx={{ fontFamily: 'var(--font-prompt)', width: '100%' }}
                            />
                        </CardContent>
                    </Card>
                </Box>

                {/* LINE Settings */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(0, 185, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Message size={22} color="#00B900" variant="Bold" />
                                </Box>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1.1rem' }}>
                                    LINE Bot
                                </Typography>
                            </Box>

                            <FormControlLabel
                                control={<Switch defaultChecked color="primary" />}
                                label="เปิดใช้งาน LINE Bot"
                                sx={{ fontFamily: 'var(--font-prompt)', mb: 2, width: '100%' }}
                            />
                            <Divider sx={{ my: 1 }} />
                            <FormControlLabel
                                control={<Switch defaultChecked color="primary" />}
                                label="ตอบกลับอัตโนมัติ"
                                sx={{ fontFamily: 'var(--font-prompt)', mb: 2, width: '100%' }}
                            />
                            <Divider sx={{ my: 1 }} />
                            <FormControlLabel
                                control={<Switch defaultChecked color="primary" />}
                                label="ส่งข้อความต้อนรับ"
                                sx={{ fontFamily: 'var(--font-prompt)', width: '100%' }}
                            />
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
