import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedMockData() {
    console.log('🌱 Starting seed...');

    // Create/Update Admin User
    const adminPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            username: 'admin',
            role: 'admin',
            password: adminPassword,
        },
        create: {
            email: 'admin@example.com',
            username: 'admin',
            name: 'Admin User',
            role: 'admin',
            password: adminPassword,
        }
    });
    console.log('✅ Admin user ready:', admin.username);

    // Mock LINE UID (ใช้ตัวเดียวกับ mock mode ใน liff.ts)
    const mockLineUid = 'U28a72146890f8dfa7fbbac7560d3195e';

    // ตรวจสอบว่ามี customer นี้อยู่แล้วหรือไม่
    let customer = await prisma.customer.findUnique({
        where: { lineUid: mockLineUid }
    });

    if (!customer) {
        // สร้าง Customer
        customer = await prisma.customer.create({
            data: {
                lineUid: mockLineUid,
                displayName: 'ทดสอบ ลูกค้า',
                pictureUrl: 'https://profile.line-scdn.net/0h-fake-url',
                phone: '081-234-5678',
                email: 'test@example.com',
                companyName: 'บริษัท ทดสอบ จำกัด',
                status: 'active',
                firstMessageAt: new Date(),
            }
        });
        console.log('✅ Created customer:', customer.displayName);
    } else {
        console.log('ℹ️ Customer already exists:', customer.displayName);
    }

    // สร้าง Events
    const eventsData = [
        {
            eventName: 'งานแต่งงาน คุณสมชาย & คุณสมหญิง',
            inviteCode: 'WEDDING001',
            eventDate: new Date('2025-02-14'),
            venue: 'โรงแรมเซ็นทารา แกรนด์',
            description: 'งานแต่งงานสุดหรู พร้อมเครื่องเสียงและแสงสี',
            status: 'confirmed',
        },
        {
            eventName: 'งานเปิดตัวสินค้า XYZ',
            inviteCode: 'LAUNCH002',
            eventDate: new Date('2025-03-01'),
            venue: 'สยามพารากอน ฮอลล์',
            description: 'งานเปิดตัวสินค้าใหม่ ต้องการเวทีและระบบแสงเสียงครบชุด',
            status: 'in-progress',
        },
        {
            eventName: 'งานสัมมนาประจำปี 2025',
            inviteCode: 'SEMINAR003',
            eventDate: new Date('2025-04-15'),
            venue: 'ศูนย์ประชุมแห่งชาติสิริกิติ์',
            description: 'งานสัมมนาใหญ่ 500 คน',
            status: 'draft',
        },
    ];

    for (const eventData of eventsData) {
        // ตรวจสอบว่า event นี้มีอยู่แล้วหรือไม่
        const existingEvent = await prisma.event.findUnique({
            where: { inviteCode: eventData.inviteCode }
        });

        if (!existingEvent) {
            const event = await prisma.event.create({
                data: {
                    customerId: customer.id,
                    ...eventData,
                }
            });

            // สร้าง Timeline สำหรับ event นี้ (พร้อมรูปภาพ mock)
            const timelines = [
                {
                    title: 'ยืนยันรายละเอียดงาน',
                    description: 'ทีมงานติดต่อยืนยันรายละเอียดเรียบร้อยแล้ว',
                    order: 1,
                    status: 'completed',
                    progress: 100,
                    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 วันก่อน
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    images: null,
                },
                {
                    title: 'ใบเสนอราคา',
                    description: 'จัดทำและส่งใบเสนอราคาให้ลูกค้าแล้ว',
                    order: 2,
                    status: eventData.status === 'draft' ? 'pending' : 'completed',
                    progress: eventData.status !== 'draft' ? 100 : null,
                    completedAt: eventData.status !== 'draft' ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : null,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    images: null,
                },
                {
                    title: 'ชำระเงินมัดจำ',
                    description: 'ลูกค้าชำระเงินมัดจำ 50% เรียบร้อย',
                    order: 3,
                    status: eventData.status === 'confirmed' || eventData.status === 'in-progress' ? 'completed' : 'pending',
                    progress: eventData.status === 'confirmed' || eventData.status === 'in-progress' ? 100 : null,
                    completedAt: eventData.status === 'confirmed' || eventData.status === 'in-progress' ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) : null,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    images: JSON.stringify(['https://picsum.photos/seed/payment/400/300']),
                },
                {
                    title: 'กำลังติดตั้งจอ LED',
                    description: 'ทีมงานกำลังติดตั้งจอ LED หน้าเวที เสร็จไปแล้ว 50%',
                    order: 4,
                    status: eventData.status === 'in-progress' ? 'in-progress' : 'pending',
                    progress: eventData.status === 'in-progress' ? 50 : null,
                    completedAt: null,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ชั่วโมงก่อน
                    // ใส่ 2 รูป
                    images: eventData.status === 'in-progress' ? JSON.stringify([
                        'https://picsum.photos/seed/led-screen/400/300',
                        'https://picsum.photos/seed/led-detail/400/300'
                    ]) : null,
                },
                {
                    title: 'ติดตั้งเครื่องเสียง',
                    description: 'ติดตั้งระบบเครื่องเสียง Line Array',
                    order: 5,
                    status: eventData.status === 'in-progress' ? 'in-progress' : 'pending',
                    progress: eventData.status === 'in-progress' ? 30 : null,
                    completedAt: null,
                    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 ชั่วโมงก่อน
                    // ใส่ 3 รูป
                    images: eventData.status === 'in-progress' ? JSON.stringify([
                        'https://picsum.photos/seed/sound-system/400/300',
                        'https://picsum.photos/seed/speaker-left/400/300',
                        'https://picsum.photos/seed/mixer/400/300'
                    ]) : null,
                },
            ];

            await prisma.eventTimeline.createMany({
                data: timelines.map(t => ({
                    eventId: event.id,
                    title: t.title,
                    description: t.description,
                    order: t.order,
                    status: t.status,
                    progress: t.progress,
                    completedAt: t.completedAt,
                    createdAt: t.createdAt,
                    images: t.images,
                }))
            });

            // สร้าง Bookings
            const bookings = [
                { serviceName: 'เครื่องเสียง Line Array', quantity: 1, price: 25000 },
                { serviceName: 'ไฟเวที LED', quantity: 4, price: 8000 },
                { serviceName: 'เวทีสำเร็จรูป 4x6 เมตร', quantity: 1, price: 15000 },
            ];

            await prisma.booking.createMany({
                data: bookings.map(b => ({
                    eventId: event.id,
                    serviceName: b.serviceName,
                    quantity: b.quantity,
                    price: b.price,
                }))
            });

            console.log('✅ Created event:', eventData.eventName);
        } else {
            console.log('ℹ️ Event already exists:', eventData.eventName);
        }
    }

    console.log('🎉 Seed completed!');
}

seedMockData()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// npx tsx prisma/seed.ts