import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { randomBytes } from 'crypto';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user from database to check role
        // For NextAuth with username, session.user might not have email depending on how it was set up in [...nextauth]
        // But the previous code used email, so we stick with session logic or adapt if userId is available.
        // Looking at authOptions, token.sub is mapped to session.user.id. It's safer to use ID if possible.
        const userId = (session.user as any).id;

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
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

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { eventName, customerId, eventDate, venue, description, totalPrice, notes } = body;

        if (!eventName || !customerId) {
            return NextResponse.json({ error: 'Event name and Customer are required' }, { status: 400 });
        }

        // Validate Customer
        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Generate Invite Code (Unique)
        let inviteCode = randomBytes(3).toString('hex').toUpperCase(); // 6 chars
        let isUnique = false;
        while (!isUnique) {
            const existing = await prisma.event.findUnique({ where: { inviteCode } });
            if (!existing) {
                isUnique = true;
            } else {
                inviteCode = randomBytes(3).toString('hex').toUpperCase();
            }
        }

        const newEvent = await prisma.event.create({
            data: {
                eventName,
                customerId,
                inviteCode,
                eventDate: eventDate ? new Date(eventDate) : undefined,
                venue,
                description,
                totalPrice,
                notes,
                status: 'draft'
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        displayName: true,
                        pictureUrl: true,
                    }
                }
            }
        });

        return NextResponse.json(newEvent, { status: 201 });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
