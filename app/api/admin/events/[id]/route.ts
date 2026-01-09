
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                customer: true,
            },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Fetch chat logs for this event only
        const chatLogs = await prisma.chatLog.findMany({
            where: {
                eventId: id
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });

        return NextResponse.json({ event, chatLogs });
    } catch (error) {
        console.error('Error fetching event details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Update Event (Full Update)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { eventName, customerId, eventDate, venue, description, notes, status } = body;

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                eventName,
                customerId,
                eventDate: eventDate ? new Date(eventDate) : null,
                venue,
                description,
                notes,
                ...(status && { status }) // Update status if provided
            },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH Event (Partial Update)
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        // Allow updating any field, but typically used for status
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('Error patching event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete Event
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await prisma.event.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

