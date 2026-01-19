const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Valentine data...');

    const valentine = await prisma.valentineCard.upsert({
        where: { slug: 'my-love' },
        update: {},
        create: {
            slug: 'my-love',
            title: 'For My Love',
            openingText: 'Tap to open your surprise',
            greeting: "Happy Valentine's Day",
            subtitle: 'Take My Heart',
            message: 'Every moment with you is a treasure.\nI Love You Forever ❤️',
            signer: 'Love, Make',
            musicUrl: '/valentine-song.mp3',
            backgroundColor: '#FFF0F3',
            memories: {
                create: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1974&auto=format&fit=crop',
                        caption: 'Our First Date ❤️',
                        order: 1
                    },
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2071&auto=format&fit=crop',
                        caption: 'Sweet Moments 📸',
                        order: 2
                    },
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1974&auto=format&fit=crop',
                        caption: 'Holding Hands 🤝',
                        order: 3
                    },
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop',
                        caption: 'Forever Love 💍',
                        order: 4
                    },
                    {
                        type: 'youtube',
                        url: 'cTpcStBG2eE',
                        caption: 'Our Sweet Journey 🎥',
                        order: 5
                    },
                    {
                        type: 'tiktok',
                        url: '7591516289156369685',
                        caption: 'Fun Times 🎵',
                        order: 6
                    }
                ]
            }
        }
    });

    console.log('✅ Valentine card seeded:', valentine.slug);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
