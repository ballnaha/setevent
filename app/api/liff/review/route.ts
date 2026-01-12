import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/liff/review
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, rating, comment } = body;

        if (!eventId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if event exists and belongs to customer (optional stricter check)
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Create or Update Review
        // Upsert allows user to update their review if they submit again
        const review = await prisma.review.upsert({
            where: {
                eventId: eventId
            },
            update: {
                rating: parseInt(rating),
                comment: comment
            },
            create: {
                eventId: eventId,
                rating: parseInt(rating),
                comment: comment
            }
        });

        return NextResponse.json({ success: true, review });

    } catch (error) {
        console.error('Error saving review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
