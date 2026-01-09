import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// LINE Webhook Handler
// รับ events จาก LINE (ข้อความ, follow, unfollow, etc.)
export async function POST(request: NextRequest) {
    try {
        // Verify LINE Signature (ควรทำใน Production)
        // const signature = request.headers.get('x-line-signature');
        // TODO: Verify signature with LINE_CHANNEL_SECRET

        const body = await request.json();
        const events = body.events || [];

        for (const event of events) {
            await handleEvent(event);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handleEvent(event: any) {
    const { type, source, message, timestamp } = event;
    const lineUid = source?.userId;

    if (!lineUid) return;

    switch (type) {
        case 'message':
            await handleMessage(lineUid, message, timestamp);
            break;

        case 'follow':
            // User เพิ่มเพื่อน LINE OA
            await handleFollow(lineUid);
            break;

        case 'unfollow':
            // User บล็อค LINE OA
            await handleUnfollow(lineUid);
            break;

        case 'postback':
            // User กดปุ่มใน Flex Message
            await handlePostback(lineUid, event.postback);
            break;
    }
}

async function handleMessage(lineUid: string, message: any, timestamp: number) {
    // ดึง Profile จาก LINE
    const profile = await getLineProfile(lineUid);

    // บันทึกหรืออัพเดท Customer
    const customer = await prisma.customer.upsert({
        where: { lineUid },
        create: {
            lineUid,
            displayName: profile?.displayName,
            pictureUrl: profile?.pictureUrl,
            status: 'pending',
            firstMessageAt: new Date(timestamp),
        },
        update: {
            displayName: profile?.displayName,
            pictureUrl: profile?.pictureUrl,
        },
    });

    // หา Event ล่าสุดที่ยังไม่จบ (ไม่ใช่ completed/cancelled) เพื่อ link ข้อความ
    const latestActiveEvent = await prisma.event.findFirst({
        where: {
            customerId: customer.id,
            status: {
                notIn: ['completed', 'cancelled']
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const eventIdToLink = latestActiveEvent?.id || null;

    // บันทึก Chat Log พร้อม link กับ Event (ถ้ามี)
    if (message.type === 'text') {
        await prisma.chatLog.create({
            data: {
                customerId: customer.id,
                eventId: eventIdToLink,
                message: message.text,
                direction: 'inbound',
                messageType: 'text',
            },
        });
    } else if (message.type === 'image') {
        await prisma.chatLog.create({
            data: {
                customerId: customer.id,
                eventId: eventIdToLink,
                message: `[รูปภาพ: ${message.id}]`,
                direction: 'inbound',
                messageType: 'image',
            },
        });
    } else if (message.type === 'sticker') {
        await prisma.chatLog.create({
            data: {
                customerId: customer.id,
                eventId: eventIdToLink,
                message: `[สติกเกอร์: ${message.packageId}/${message.stickerId}]`,
                direction: 'inbound',
                messageType: 'sticker',
            },
        });
    }

    console.log(`📩 New message from ${profile?.displayName || lineUid}: ${message.text || message.type}${eventIdToLink ? ` (linked to event ${eventIdToLink})` : ''}`);
}

async function handleFollow(lineUid: string) {
    const profile = await getLineProfile(lineUid);

    await prisma.customer.upsert({
        where: { lineUid },
        create: {
            lineUid,
            displayName: profile?.displayName,
            pictureUrl: profile?.pictureUrl,
            status: 'new',
        },
        update: {
            displayName: profile?.displayName,
            pictureUrl: profile?.pictureUrl,
        },
    });

    console.log(`👋 New follower: ${profile?.displayName || lineUid}`);
}

async function handleUnfollow(lineUid: string) {
    // อัพเดท status หรือลบออก (ขึ้นกับ business logic)
    await prisma.customer.update({
        where: { lineUid },
        data: { status: 'blocked' },
    }).catch(() => { }); // Ignore if not found

    console.log(`🚫 Unfollowed: ${lineUid}`);
}

async function handlePostback(lineUid: string, postback: any) {
    console.log(`🔘 Postback from ${lineUid}: ${postback.data}`);
    // TODO: Handle postback actions
}

// ดึง Profile จาก LINE
async function getLineProfile(lineUid: string) {
    try {
        const response = await fetch(`https://api.line.me/v2/bot/profile/${lineUid}`, {
            headers: {
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error('Get profile error:', error);
        return null;
    }
}
