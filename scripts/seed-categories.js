
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rentalItems = [
    {
        label: "LED Screen",
        href: "/products/rental/led-screen",
        children: [
            { label: "Indoor", href: "/products/rental/led-screen/indoor" },
            { label: "Outdoor", href: "/products/rental/led-screen/outdoor" },
        ]
    },
    { label: "Lighting Systems", href: "/products/rental/lighting" },
    { label: "Sound Systems", href: "/products/rental/sound" },
    { label: "Stage", href: "/products/rental/stage" },
    { label: "Motion Graphic", href: "/products/rental/motion-graphic" },
    { label: "Interactive", href: "/products/rental/interactive" },
    { label: "Laser", href: "/products/rental/laser" },
    { label: "Mapping", href: "/products/rental/mapping" },
    { label: "Flower & Souvenirs", href: "/products/rental/flower-souvenirs" },
];

const fixedItems = [
    { label: "LED Screen", href: "/products/fixed/led-screen" }
];

async function main() {
    console.log('Seeding categories...');

    // 1. Create Root Categories: Rental, Fixed Installation
    // Check or create 'Rental'
    let rental = await prisma.category.findFirst({ where: { slug: 'rental' } });
    if (!rental) {
        rental = await prisma.category.create({
            data: { name: 'Rental', slug: 'rental', description: 'บริการเช่าอุปกรณ์สำหรับงานอีเว้นท์', order: 1 }
        });
        console.log('Created Rental category');
    }

    // Check or create 'Fixed Installation'
    let fixed = await prisma.category.findFirst({ where: { slug: 'fixed-installation' } });
    if (!fixed) {
        fixed = await prisma.category.create({
            data: { name: 'Fixed Installation', slug: 'fixed-installation', description: 'บริการติดตั้งถาวร', order: 2 }
        });
        console.log('Created Fixed Installation category');
    }

    // 2. Create Sub Categories for Rental
    for (let i = 0; i < rentalItems.length; i++) {
        const item = rentalItems[i];
        const slug = item.href.split('/').pop();

        let cat = await prisma.category.findFirst({ where: { slug: slug } });
        if (!cat) {
            cat = await prisma.category.create({
                data: {
                    name: item.label,
                    slug: slug,
                    description: item.label,
                    parentId: rental.id,
                    order: i
                }
            });
            console.log(`Created ${item.label} (Rental)`);
        }

        // 3. Create Child Categories (e.g. Indoor/Outdoor for LED Screen)
        if (item.children) {
            for (let j = 0; j < item.children.length; j++) {
                const child = item.children[j];
                const childSlug = child.href.split('/').pop(); // might duplicates if generic names like indoor/outdoor
                // Make slug unique by prefixing parent slug if needed to prevent collision, but href usually unique.
                // Assuming child.href is like /products/rental/led-screen/indoor
                // We use only the last part, but if another category has 'indoor', generic name collision:
                // Better use composite slug or just simple slug and hope for best or full path slug.
                // For this project, let's use what's in href. However, slug needs to be unique in DB.
                // 'Indoor' for LED Screen rental vs 'Indoor' for something else?
                // Modify slug to be unique: led-screen-indoor
                const uniqueSlug = `${slug}-${childSlug}`;

                let subCat = await prisma.category.findFirst({ where: { slug: uniqueSlug } });
                if (!subCat) {
                    await prisma.category.create({
                        data: {
                            name: child.label,
                            slug: uniqueSlug,
                            description: child.label,
                            parentId: cat.id,
                            order: j
                        }
                    });
                    console.log(`Created ${child.label} under ${item.label}`);
                }
            }
        }
    }

    // 4. Create Sub Categories for Fixed Installation
    for (let i = 0; i < fixedItems.length; i++) {
        const item = fixedItems[i];
        const slug = 'fixed-' + item.href.split('/').pop(); // prefix fixed to led-screen to differentiate from rental led-screen

        let cat = await prisma.category.findFirst({ where: { slug: slug } });
        if (!cat) {
            await prisma.category.create({
                data: {
                    name: item.label,
                    slug: slug,
                    description: item.label,
                    parentId: fixed.id,
                    order: i
                }
            });
            console.log(`Created ${item.label} (Fixed)`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
