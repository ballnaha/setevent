import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const inviteCode = 'A05504';

    const event = await prisma.event.findUnique({
        where: { inviteCode },
        include: {
            customer: true,
            chatLogs: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!event) {
        console.log(`Event ${inviteCode} not found`);
        return;
    }

    const output: string[] = [];

    output.push('='.repeat(60));
    output.push(`Event: ${event.eventName}`);
    output.push(`Event ID: ${event.id}`);
    output.push(`Customer: ${event.customer.displayName}`);
    output.push(`Customer LINE UID: ${event.customer.lineUid}`);
    output.push('='.repeat(60));

    output.push(`\nChat Logs linked to this event: ${event.chatLogs.length}`);

    event.chatLogs.forEach((log, i) => {
        output.push(`\n--- Chat Log ${i + 1} ---`);
        output.push(`ID: ${log.id}`);
        output.push(`Direction: ${log.direction}`);
        output.push(`Type: ${log.messageType}`);
        output.push(`Created: ${log.createdAt}`);
        output.push(`Full Message:`);
        output.push(log.message);
    });

    // Also check ALL chat logs for this customer
    const allCustomerChats = await prisma.chatLog.findMany({
        where: { customerId: event.customer.id },
        orderBy: { createdAt: 'desc' }
    });

    output.push('\n' + '='.repeat(60));
    output.push(`ALL Chat Logs for this customer: ${allCustomerChats.length}`);

    allCustomerChats.forEach((log, i) => {
        output.push(`\n--- Customer Chat ${i + 1} ---`);
        output.push(`ID: ${log.id}`);
        output.push(`Event ID: ${log.eventId || 'NOT LINKED'}`);
        output.push(`Direction: ${log.direction}`);
        output.push(`Type: ${log.messageType}`);
        output.push(`Created: ${log.createdAt}`);
        output.push(`Full Message:`);
        output.push(log.message);
    });

    // Write to file
    fs.writeFileSync('chat-log-output.txt', output.join('\n'));
    console.log('Output written to chat-log-output.txt');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
