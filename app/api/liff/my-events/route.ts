import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/liff/my-events?lineUid=xxx
// ดึงรายการงานทั้งหมดของลูกค้าจาก LINE UID
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const lineUid = searchParams.get('lineUid');

        if (!lineUid) {
            return NextResponse.json({ error: 'Missing LINE UID' }, { status: 400 });
        }

        // Find customer by LINE UID
        const customer = await prisma.customer.findUnique({
            where: { lineUid },
            include: {
                events: {
                    where: {
                        // Show all events except cancelled
                        status: {
                            notIn: ['cancelled']
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        eventName: true,
                        inviteCode: true,
                        eventDate: true,
                        venue: true,
                        status: true,
                        _count: {
                            select: { chatLogs: true }
                        },
                        // Fetch recent chat logs to find an image sent to customer
                        chatLogs: {
                            where: {
                                direction: 'outbound'
                            },
                            orderBy: { createdAt: 'desc' },
                            take: 10,
                            select: {
                                message: true,
                                messageType: true
                            }
                        },
                        review: {
                            select: {
                                id: true,
                                rating: true
                            }
                        }
                    }
                }
            }
        });

        if (!customer) {
            return NextResponse.json({
                success: true,
                customer: null,
                events: [],
                status: 'new',
            });
        }

        // ...

        // Map events to include task count and find latest image
        const eventsWithDetails = customer.events.map((evt: any) => {
            let latestImageUrl = null;

            // Find first image in chat logs
            for (const log of evt.chatLogs) {
                try {
                    // Check if it's a status message with images
                    if (log.message.trim().startsWith('{')) {
                        const parsed = JSON.parse(log.message);
                        if (parsed.imageUrls && Array.isArray(parsed.imageUrls) && parsed.imageUrls.length > 0) {
                            latestImageUrl = parsed.imageUrls[0];
                            break;
                        }
                    }
                    // Add other image checks if needed
                } catch (e) {
                    continue;
                }
            }

            return {
                id: evt.id,
                eventName: evt.eventName,
                inviteCode: evt.inviteCode,
                eventDate: evt.eventDate,
                venue: evt.venue,
                status: evt.status,
                tasksCount: evt._count.chatLogs,
                // Use latest image found, or fallback to a default event placeholder (not customer pic)
                customerPictureUrl: latestImageUrl,
                isReviewed: !!evt.review
            };
        });

        // Return events
        return NextResponse.json({
            success: true,
            customer: {
                id: customer.id,
                displayName: customer.displayName,
                pictureUrl: customer.pictureUrl,
            },
            events: eventsWithDetails,
            status: eventsWithDetails.length > 0 ? 'has-events' : 'no-events',
        });

    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
