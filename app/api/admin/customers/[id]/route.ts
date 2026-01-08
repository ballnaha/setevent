import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/customers/[id] - Get single customer
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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
        const { id } = await params;
        const body = await request.json();
        const { displayName, companyName, phone, email, status, salesId } = body;

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
        if (salesId !== undefined) updateData.salesId = salesId || null; // Allow unsetting
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
                sales: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
