import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const inviteCode = 'A05504';
    const event = await prisma.event.findUnique({
        where: { inviteCode },
        include: {
            chatLogs: true,
            customer: true
        }
    });

    if (!event) {
        console.log(`Event ${inviteCode} not found`);
        return;
    }

    console.log(`Event found: ${event.eventName} (${event.id})`);
    console.log(`Customer: ${event.customer.displayName} (${event.customer.lineUid})`);
    console.log(`Chat Logs count: ${event.chatLogs.length}`);
    console.log(JSON.stringify(event.chatLogs, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
