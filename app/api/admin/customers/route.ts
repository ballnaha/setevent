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

        // Admin and Sales roles can see all customers
        // Filtering by event assignment is handled in the events API
        // Admin and other roles can see all customers

        const customers = await prisma.customer.findMany({
            where: whereClause,
            include: {
                _count: {
                    select: { events: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
