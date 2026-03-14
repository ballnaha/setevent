import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_CUSTOMER, MOCK_EVENTS, isMockMode } from '@/lib/liff';

export async function POST(request: NextRequest) {
    try {
        const { lineUid, displayName, pictureUrl } = await request.json();

        if (!lineUid) {
            return NextResponse.json({ error: 'LINE UID is required' }, { status: 400 });
        }

        // 🧪 Mock Mode
        if (lineUid.startsWith('U_mock_')) {
            console.log('🧪 API Mock Mode: check-status');
            return NextResponse.json({
                status: 'active',
                displayName: MOCK_CUSTOMER.displayName,
                events: MOCK_EVENTS,
            });
        }

        // 🔐 Production Mode
        let customer = await prisma.customer.findUnique({
            where: { lineUid },
            include: {
                event: {
                    where: { status: { not: 'cancelled' } },
                    orderBy: { eventDate: 'desc' },
                    select: {
                        id: true,
                        eventName: true,
                        eventDate: true,
                        venue: true,
                        status: true,
                    },
                },
            },
        });

        // ❌ ลูกค้าใหม่
        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    lineUid,
                    displayName,
                    pictureUrl,
                    status: 'new',
                },
                include: {
                    event: true,
                },
            });

            return NextResponse.json({
                status: 'new',
                displayName,
            });
        }

        // อัพเดท profile ล่าสุด
        await prisma.customer.update({
            where: { lineUid },
            data: {
                displayName,
                pictureUrl,
            },
        });

        // ⏳ Pending
        if (customer.event.length === 0) {
            return NextResponse.json({
                status: 'pending',
                displayName: customer.displayName,
            });
        }

        // ✅ Active
        return NextResponse.json({
            status: 'active',
            displayName: customer.displayName,
            events: customer.event,
        });
    } catch (error) {
        console.error('Check status error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
