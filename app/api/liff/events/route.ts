import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_EVENTS } from '@/lib/liff';

export async function POST(request: NextRequest) {
    try {
        const { lineUid } = await request.json();

        if (!lineUid) {
            return NextResponse.json({ error: 'LINE UID is required' }, { status: 400 });
        }

        // 🧪 Mock Mode
        if (lineUid.startsWith('U_mock_')) {
            console.log('🧪 API Mock Mode: events');
            return NextResponse.json({ events: MOCK_EVENTS });
        }

        // 🔐 Production Mode
        const customer = await prisma.customer.findUnique({
            where: { lineUid },
            include: {
                events: {
                    where: { status: { not: 'cancelled' } },
                    orderBy: { eventDate: 'desc' },
                    select: {
                        id: true,
                        eventName: true,
                        inviteCode: true,
                        eventDate: true,
                        venue: true,
                        status: true,
                        totalPrice: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!customer) {
            return NextResponse.json({ events: [] });
        }

        return NextResponse.json({ events: customer.events });
    } catch (error) {
        console.error('Events fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
