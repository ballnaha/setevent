import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user from database to check role
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Build where clause based on role
        const whereClause: any = {};

        // If user is sales, only show events from their assigned customers
        if (currentUser.role === 'sales') {
            whereClause.customer = {
                salesId: currentUser.id
            };
        }
        // Admin and other roles can see all events

        const events = await prisma.event.findMany({
            where: whereClause,
            include: {
                customer: {
                    select: {
                        id: true,
                        displayName: true,
                        pictureUrl: true,
                        lineUid: true,
                        companyName: true,
                        salesId: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
