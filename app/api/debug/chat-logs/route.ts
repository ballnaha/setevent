import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/debug/chat-logs?eventId=xxx
export async function GET(request: NextRequest) {
    const eventId = request.nextUrl.searchParams.get('eventId');

    if (!eventId) {
        return NextResponse.json({ error: 'Missing eventId parameter' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, eventName: true, inviteCode: true }
    });

    if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const chatLogs = await prisma.chatLog.findMany({
        where: { eventId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
            id: true,
            message: true,
            direction: true,
            messageType: true,
            eventId: true,
            createdAt: true
        }
    });

    return NextResponse.json({
        event,
        totalChatLogs: chatLogs.length,
        chatLogs: chatLogs.map(log => ({
            ...log,
            messageTruncated: log.message.substring(0, 100) + (log.message.length > 100 ? '...' : '')
        }))
    });
}
