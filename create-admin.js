const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const email = 'admin@seteventthailand.com';
    const passwordRaw = 'password123';
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    const user = await prisma.user.upsert({
        where: { email: email },
        update: {
            password: hashedPassword, // อัพเดทพาสเวิร์ดถ้ายูสเซอร์มีอยู่แล้ว
            role: 'admin',
        },
        create: {
            email: email,
            name: 'Admin',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log('Admin user updated/created');
    console.log('Email:', email);
    console.log('Password:', passwordRaw);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
