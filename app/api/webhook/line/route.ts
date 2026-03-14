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

    // 1. ตรวจสอบว่าในข้อความมีการระบุรหัสงาน (Ref: INVITE_CODE) หรือไม่
    let eventIdToLink = null;
    let shouldUpdateContext = false;

    if (message.type === 'text') {
        const refMatch = message.text.match(/\(Ref:\s*([A-Z0-9]+)\)/i);
        if (refMatch) {
            const inviteCode = refMatch[1].toUpperCase(); // Ensure uppercase for DB lookup
            console.log(`🔍 Found Ref in message: ${inviteCode}`);
            const eventByRef = await prisma.event.findUnique({
                where: { inviteCode },
                select: { id: true }
            });
            if (eventByRef) {
                eventIdToLink = eventByRef.id;
                shouldUpdateContext = true; // ลูกค้าเปลี่ยนบริบทเป็นงานนี้
                console.log(`✅ Matched event: ${eventIdToLink}`);
            } else {
                console.log(`❌ No event found for inviteCode: ${inviteCode}`);
            }
        }
    }

    // 2. ถ้าไม่มี Ref ให้ใช้บริบทล่าสุดที่ลูกค้าเคยคุย (lastActiveEventId)
    if (!eventIdToLink && customer.lastActiveEventId) {
        // ตรวจสอบว่า event นั้นยังไม่จบ
        const lastEvent = await prisma.event.findFirst({
            where: {
                id: customer.lastActiveEventId,
                status: { notIn: ['completed', 'cancelled'] }
            },
            select: { id: true }
        });
        if (lastEvent) {
            eventIdToLink = lastEvent.id;
            console.log(`📌 Using last context: ${eventIdToLink}`);
        }
    }

    // 3. ถ้ายังไม่มี ให้หาจาก Event ล่าสุดที่ยังไม่จบ (ไม่ใช่ completed/cancelled)
    if (!eventIdToLink) {
        const latestActiveEvent = await prisma.event.findFirst({
            where: {
                customerId: customer.id,
                status: {
                    notIn: ['completed', 'cancelled']
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        eventIdToLink = latestActiveEvent?.id || null;
        if (eventIdToLink) {
            shouldUpdateContext = true; // เซ็ตงานนี้เป็นบริบทใหม่
            console.log(`🎯 Fallback to latest active event: ${eventIdToLink}`);
        }
    }

    // อัพเดท lastActiveEventId ถ้ามีการเปลี่ยนบริบท
    if (shouldUpdateContext && eventIdToLink) {
        await prisma.customer.update({
            where: { id: customer.id },
            data: { lastActiveEventId: eventIdToLink }
        });
        console.log(`💾 Updated customer context to event: ${eventIdToLink}`);
    }

    // บันทึก Chat Log พร้อม link กับ Event (ถ้ามี)
    if (message.type === 'text') {
        await prisma.chatlog.create({
            data: {
                id: crypto.randomUUID(),
                customerId: customer.id,
                eventId: eventIdToLink,
                message: message.text,
                direction: 'inbound',
                messageType: 'text',
            },
        });
    } else if (message.type === 'image') {
        await prisma.chatlog.create({
            data: {
                id: crypto.randomUUID(),
                customerId: customer.id,
                eventId: eventIdToLink,
                message: `[รูปภาพ: ${message.id}]`,
                direction: 'inbound',
                messageType: 'image',
            },
        });
    } else if (message.type === 'sticker') {
        await prisma.chatlog.create({
            data: {
                id: crypto.randomUUID(),
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
