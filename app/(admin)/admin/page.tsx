'use client';

import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { Calendar, People, Message, TickCircle } from 'iconsax-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
    totalEvents: number;
    totalCustomers: number;
    pendingEvents: number;
    completedEvents: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'งานทั้งหมด',
            value: stats?.totalEvents || 0,
            icon: Calendar,
            color: '#0A5C5A',
            bgColor: 'rgba(10, 92, 90, 0.1)'
        },
        {
            title: 'ลูกค้าทั้งหมด',
            value: stats?.totalCustomers || 0,
            icon: People,
            color: '#3B82F6',
            bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
            title: 'งานรอดำเนินการ',
            value: stats?.pendingEvents || 0,
            icon: Message,
            color: '#F59E0B',
            bgColor: 'rgba(245, 158, 11, 0.1)'
        },
        {
            title: 'งานเสร็จสิ้น',
            value: stats?.completedEvents || 0,
            icon: TickCircle,
            color: '#10B981',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
    ];

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 700,
                    mb: 1,
                    color: '#1a1a1a',
                }}
            >
                Dashboard
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray', mb: 4 }}>
                ภาพรวมการจัดการงาน Event
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {statCards.map((card, index) => (
                    <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 18px)' } }}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '0.85rem',
                                                color: 'gray',
                                                mb: 1,
                                            }}
                                        >
                                            {card.title}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton width={60} height={40} />
                                        ) : (
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 700,
                                                    color: '#1a1a1a',
                                                }}
                                            >
                                                {card.value.toLocaleString()}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 2,
                                            bgcolor: card.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {card.icon ? <card.icon size={24} color={card.color} variant="Bold" /> : <Box sx={{ width: 24, height: 24 }} />}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
