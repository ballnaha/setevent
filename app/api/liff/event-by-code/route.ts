import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/liff/event-by-code?code=xxx&lineUid=xxx
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const inviteCode = searchParams.get('code');
        const lineUid = searchParams.get('lineUid');

        if (!inviteCode) {
            return NextResponse.json({ error: 'Missing invite code' }, { status: 400 });
        }

        if (!lineUid) {
            return NextResponse.json({ error: 'Missing LINE UID' }, { status: 400 });
        }

        // Find event by invite code
        const event = await prisma.event.findUnique({
            where: { inviteCode },
            include: {
                customer: {
                    select: {
                        id: true,
                        lineUid: true,
                        displayName: true,
                    }
                },
                timelines: {
                    orderBy: { createdAt: 'desc' }
                },
                bookings: true,
            }
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Verify the LINE user is the owner of this event
        if (event.customer.lineUid !== lineUid) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
        }

        // If no timelines exist, create default ones
        if (event.timelines.length === 0) {
            const defaultTimelines = [
                { title: 'ยืนยันรายละเอียดงาน', description: 'ทีมงานติดต่อยืนยันรายละเอียด', order: 1 },
                { title: 'ใบเสนอราคา', description: 'จัดทำและส่งใบเสนอราคา', order: 2 },
                { title: 'ชำระเงินมัดจำ', description: 'ชำระเงินมัดจำ 50%', order: 3 },
                { title: 'เตรียมอุปกรณ์', description: 'จัดเตรียมอุปกรณ์ตามรายการ', order: 4 },
                { title: 'วันจัดงาน', description: 'ติดตั้งและดำเนินการ', order: 5 },
                { title: 'เสร็จสิ้น', description: 'งานเสร็จสมบูรณ์', order: 6 },
            ];

            await prisma.eventTimeline.createMany({
                data: defaultTimelines.map(t => ({
                    eventId: event.id,
                    ...t,
                    status: t.order === 1 ? 'in-progress' : 'pending',
                }))
            });

            // Refetch with new timelines
            const updatedEvent = await prisma.event.findUnique({
                where: { id: event.id },
                include: {
                    timelines: { orderBy: { createdAt: 'desc' } },
                    bookings: true,
                }
            });

            return NextResponse.json({
                success: true,
                event: updatedEvent,
            });
        }

        return NextResponse.json({
            success: true,
            event: {
                id: event.id,
                eventName: event.eventName,
                inviteCode: event.inviteCode,
                eventDate: event.eventDate,
                venue: event.venue,
                description: event.description,
                status: event.status,
                totalPrice: event.totalPrice,
                timelines: event.timelines,
                bookings: event.bookings,
            },
        });

    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
