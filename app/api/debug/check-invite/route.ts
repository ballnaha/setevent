import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/debug/check-invite?code=EFA05D
export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
        where: { inviteCode: code.toUpperCase() },
        select: {
            id: true,
            eventName: true,
            inviteCode: true,
            status: true,
            customer: {
                select: { displayName: true }
            }
        }
    });

    if (!event) {
        return NextResponse.json({
            found: false,
            message: `No event found with inviteCode: ${code.toUpperCase()}`
        });
    }

    return NextResponse.json({
        found: true,
        event: {
            id: event.id,
            eventName: event.eventName,
            inviteCode: event.inviteCode,
            status: event.status,
            customerName: event.customer.displayName
        },
        adminUrl: `/admin/progress/${event.id}`
    });
}
