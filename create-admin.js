const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const username = 'admin';
    const passwordRaw = '123456';
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    const email = 'admin@setevent.com'; // Default email since it's unique

    const user = await prisma.user.upsert({
        where: { username: username },
        update: {
            password: hashedPassword,
            role: 'admin',
            email: email, // ensure email is set
        },
        create: {
            username: username,
            email: email,
            name: 'System Admin',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log('--- Admin User Created/Updated ---');
    console.log('Username:', username);
    console.log('Password:', passwordRaw);
    console.log('Email:', email);
    console.log('Role:', user.role);
    console.log('----------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
