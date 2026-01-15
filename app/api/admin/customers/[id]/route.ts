import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/customers/[id] - Get single customer
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Get user for role check
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { events: true },
                },
            },
        });

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }


        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/customers/[id] - Update customer
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { displayName, companyName, phone, email, status } = body;

        // Get user for role check
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if customer exists
        const existingCustomer = await prisma.customer.findUnique({ where: { id } });
        if (!existingCustomer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }


        // Build update data
        const updateData: any = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (companyName !== undefined) updateData.companyName = companyName;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;


        if (status !== undefined) {
            const validStatuses = ['new', 'pending', 'active'];
            if (validStatuses.includes(status)) {
                updateData.status = status;
            }
        }

        const customer = await prisma.customer.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: { events: true },
                },
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
