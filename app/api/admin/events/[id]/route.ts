import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkEventAuth(eventId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: 'Unauthorized', status: 401 };

    const currentUser = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { id: true, role: true }
    });
    if (!currentUser) return { error: 'User not found', status: 404 };

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, salesId: true }
    }) as any;
    if (!event) return { error: 'Event not found', status: 404 };

    if (currentUser.role === 'sales' && event.salesId !== currentUser.id) {
        return { error: 'Forbidden', status: 403 };
    }

    return { success: true, user: currentUser };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const auth = await checkEventAuth(id);
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

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
        const auth = await checkEventAuth(id);
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        const body = await request.json();
        const { eventName, customerId, salesId, eventDate, venue, description, notes, status } = body;

        // Validation for sales: Cannot change sales assigned to event if not admin
        if (salesId !== undefined && auth.user?.role !== 'admin' && salesId !== auth.user?.id) {
            return NextResponse.json({ error: 'Only admins can reassign sales' }, { status: 403 });
        }

        // If customer is being changed, verify access to new customer if sales (Optional: based on your business logic)
        // In the new logic, sales is linked to event, so they might handle events for any customer assigned to them.
        // For now, let's keep it simple. Admin can change anything. Sales can update their own events.

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                eventName,
                customerId,
                salesId,
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
        const auth = await checkEventAuth(id);
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

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
        const auth = await checkEventAuth(id);
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

        await prisma.event.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

