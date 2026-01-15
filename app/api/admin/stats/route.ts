import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Build where clause based on role
        const customerWhere: any = {};
        const eventWhere: any = {};

        if (currentUser.role === 'sales') {
            customerWhere.events = { some: { salesId: currentUser.id } };
            eventWhere.salesId = currentUser.id;
        }

        const [totalEvents, totalCustomers, pendingEvents, completedEvents] = await Promise.all([
            prisma.event.count({
                where: eventWhere
            }),
            prisma.customer.count({
                where: customerWhere
            }),
            prisma.event.count({
                where: {
                    ...eventWhere,
                    status: { in: ['draft', 'confirmed', 'in-progress'] }
                }
            }),
            prisma.event.count({
                where: {
                    ...eventWhere,
                    status: 'completed'
                }
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
