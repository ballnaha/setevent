import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { lineUid } = await request.json();

        if (!lineUid) {
            return NextResponse.json({ error: 'LINE UID is required' }, { status: 400 });
        }

        // ดึงข้อมูลจาก Database (รวม mock data ที่ seed ไว้)
        const customer = await prisma.customer.findUnique({
            where: { lineUid },
            include: {
                events: {
                    // where: {
                    //    status: {
                    //        notIn: ['completed', 'cancelled']
                    //    }
                    // },
                    orderBy: { eventDate: 'desc' },
                    select: {
                        id: true,
                        eventName: true,
                        inviteCode: true,
                        eventDate: true,
                        venue: true,
                        status: true,
                        totalPrice: true,
                        createdAt: true,
                        review: {
                            select: {
                                id: true,
                                rating: true,
                                comment: true
                            }
                        }
                    },
                },
            },
        });

        if (!customer) {
            return NextResponse.json({ events: [] });
        }

        const events = customer.events.map((evt: any) => ({
            ...evt,
            isReviewed: !!evt.review,
            reviewRating: evt.review?.rating,
            reviewComment: evt.review?.comment
        }));

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Events fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
