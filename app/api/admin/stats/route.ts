import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [totalEvents, totalCustomers, pendingEvents, completedEvents] = await Promise.all([
            prisma.event.count(),
            prisma.customer.count(),
            prisma.event.count({
                where: {
                    status: { in: ['draft', 'confirmed', 'in-progress'] }
                }
            }),
            prisma.event.count({
                where: { status: 'completed' }
            }),
        ]);

        return NextResponse.json({
            totalEvents,
            totalCustomers,
            pendingEvents,
            completedEvents,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
