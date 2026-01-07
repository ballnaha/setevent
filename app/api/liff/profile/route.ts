import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_CUSTOMER } from '@/lib/liff';

export async function POST(request: NextRequest) {
    try {
        const { lineUid } = await request.json();

        if (!lineUid) {
            return NextResponse.json({ error: 'LINE UID is required' }, { status: 400 });
        }

        // 🧪 Mock Mode
        if (lineUid.startsWith('U_mock_')) {
            console.log('🧪 API Mock Mode: profile');
            return NextResponse.json({ customer: MOCK_CUSTOMER });
        }

        // 🔐 Production Mode
        const customer = await prisma.customer.findUnique({
            where: { lineUid },
            select: {
                id: true,
                lineUid: true,
                displayName: true,
                pictureUrl: true,
                phone: true,
                email: true,
                companyName: true,
                status: true,
                createdAt: true,
            },
        });

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ customer });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
