import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/liff/my-events?lineUid=xxx
// ดึงรายการงานทั้งหมดของลูกค้าจาก LINE UID
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const lineUid = searchParams.get('lineUid');

        if (!lineUid) {
            return NextResponse.json({ error: 'Missing LINE UID' }, { status: 400 });
        }

        // Find customer by LINE UID
        const customer = await prisma.customer.findUnique({
            where: { lineUid },
            include: {
                events: {
                    where: {
                        // เฉพาะงานที่ยังไม่ปิด
                        status: {
                            notIn: ['completed', 'cancelled']
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        eventName: true,
                        inviteCode: true,
                        eventDate: true,
                        venue: true,
                        status: true,
                    }
                }
            }
        });

        if (!customer) {
            return NextResponse.json({
                success: true,
                customer: null,
                events: [],
                status: 'new', // ลูกค้าใหม่ ยังไม่เคยทักแชท
            });
        }

        // Check customer status
        if (customer.status === 'pending') {
            return NextResponse.json({
                success: true,
                customer: {
                    id: customer.id,
                    displayName: customer.displayName,
                },
                events: [],
                status: 'pending', // รอทีมงานติดต่อกลับ
            });
        }

        // Return events
        return NextResponse.json({
            success: true,
            customer: {
                id: customer.id,
                displayName: customer.displayName,
            },
            events: customer.events,
            status: customer.events.length > 0 ? 'has-events' : 'no-events',
        });

    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
