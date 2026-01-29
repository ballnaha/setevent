import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = process.argv[2];
    if (!slug) {
        console.error('Please provide a slug: npx tsx prisma/seed-scores.ts <slug>');
        process.exit(1);
    }

    const card = await prisma.valentineCard.findUnique({
        where: { slug },
    });

    if (!card) {
        console.error(`Card with slug "${slug}" not found.`);
        process.exit(1);
    }

    const mockups = [
        { name: 'สมชาย หัวใจดี', score: 1250 },
        { name: 'สมหญิง รักจริง', score: 1100 },
        { name: 'ก้องเกียรติ สุดหล่อ', score: 980 },
        { name: 'รุ่งนภา ฟ้าใส', score: 950 },
        { name: 'มานะ ขยันหมั่นเพียร', score: 870 },
        { name: 'อารีย์ รักสัตว์', score: 820 },
        { name: 'ชูใจ ใจบุญ', score: 790 },
        { name: 'ปิติ ยินดี', score: 750 },
        { name: 'วีระ ผู้กล้า', score: 680 },
        { name: 'วิไล แสนสวย', score: 640 },
        { name: 'นารี มีสุข', score: 590 },
        { name: 'ประสงค์ สำเร็จ', score: 550 },
        { name: 'จินตนา พาฝัน', score: 510 },
        { name: 'สมยศ ตระกูลดี', score: 480 },
        { name: 'วิชัย มีชัย', score: 450 },
        { name: 'สุนิสา น่ารัก', score: 420 },
        { name: 'อภิชาติ ผิวพรรณ', score: 380 },
        { name: 'รัตนา ดวงดี', score: 350 },
        { name: 'บุญเลิศ เกิดเก่ง', score: 320 },
        { name: 'ทิพย์วรรณ ฝันหวาน', score: 290 },
    ];

    console.log(`Inserting 20 mockup scores for card: ${card.title} (${slug})`);

    for (const mockup of mockups) {
        const randomId = 'mock_' + Math.random().toString(36).substr(2, 9);
        await prisma.valentineScore.create({
            data: {
                cardId: card.id,
                playerId: randomId,
                name: mockup.name,
                score: mockup.score,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time in last 24h
            },
        });
    }

    console.log('Successfully inserted 20 mockup scores!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
