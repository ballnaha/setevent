import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
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
