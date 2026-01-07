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
} from '@mui/material';
import { SearchNormal1, User, Calendar } from 'iconsax-react';

interface Customer {
    id: string;
    lineUid: string;
    displayName: string | null;
    pictureUrl: string | null;
    phone: string | null;
    email: string | null;
    status: string;
    createdAt: string;
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
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (search) {
            const searchLower = search.toLowerCase();
            setFilteredCustomers(
                customers.filter(
                    (c) =>
                        c.displayName?.toLowerCase().includes(searchLower) ||
                        c.email?.toLowerCase().includes(searchLower) ||
                        c.phone?.includes(search)
                )
            );
        } else {
            setFilteredCustomers(customers);
        }
    }, [customers, search]);

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
                    👥 ลูกค้าทั้งหมด
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                    จัดการข้อมูลลูกค้าจาก LINE
                </Typography>
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(70% - 8px)' } }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทร..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchNormal1 size={18} color="gray" />
                                        </InputAdornment>
                                    ),
                                    sx: { fontFamily: 'var(--font-prompt)', borderRadius: 2 },
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.85rem',
                                    color: 'gray',
                                }}
                            >
                                ลูกค้าทั้งหมด {filteredCustomers.length} คน
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: 'var(--primary)' }} />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ลูกค้า</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>ติดต่อ</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>สถานะ</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>จำนวนงาน</TableCell>
                                <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600 }}>วันที่เพิ่ม</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCustomers.map((customer) => (
                                <TableRow key={customer.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={customer.pictureUrl || undefined}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                <User size={20} />
                                            </Avatar>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 500 }}>
                                                {customer.displayName || 'ไม่ระบุชื่อ'}
                                            </Typography>
                                        </Box>
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
                                                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', color: 'gray' }}>
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
                                                bgcolor: statusLabels[customer.status]?.bgColor || 'rgba(0,0,0,0.05)',
                                                color: statusLabels[customer.status]?.color || '#666',
                                            }}
                                        />
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
