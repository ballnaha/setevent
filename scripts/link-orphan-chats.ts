import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔗 Linking orphan chat logs to events...\n');

    // ดึง chat logs ที่ยังไม่ได้ link กับ event
    const orphanLogs = await prisma.chatlog.findMany({
        where: { eventId: null },
        include: { customer: true },
        orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${orphanLogs.length} orphan chat logs\n`);

    let linkedCount = 0;
    let skippedCount = 0;

    for (const log of orphanLogs) {
        // หา event ที่สร้างก่อน/หลังข้อความนี้ไม่เกิน 7 วัน และยังไม่จบ หรือ event ที่ active ล่าสุด
        const relatedEvent = await prisma.event.findFirst({
            where: {
                customerId: log.customerId,
            },
            orderBy: { createdAt: 'desc' }
        });

        if (relatedEvent) {
            await prisma.chatlog.update({
                where: { id: log.id },
                data: { eventId: relatedEvent.id }
            });
            console.log(`✅ Linked log "${log.message.substring(0, 30)}..." to event "${relatedEvent.eventName}"`);
            linkedCount++;
        } else {
            console.log(`⚠️  No event found for customer ${log.customer.displayName || log.customerId}`);
            skippedCount++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Linked: ${linkedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
