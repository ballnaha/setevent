import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { lineUid } = await request.json();

        if (!lineUid) {
            return NextResponse.json({ error: 'LINE UID is required' }, { status: 400 });
        }

        // ดึงข้อมูลจาก Database (รวม mock data ที่ seed ไว้)
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
