import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/admin/users - Get all users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                position: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, name, email, password, role, position, status } = body;

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Username, Email and Password are required' }, { status: 400 });
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            return NextResponse.json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' }, { status: 400 });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validate role
        const validRoles = ['admin', 'sales', 'user'];
        const userRole = validRoles.includes(role) ? role : 'user';

        // Validate status
        const validStatuses = ['active', 'disabled'];
        const userStatus = validStatuses.includes(status) ? status : 'active';

        const user = await prisma.user.create({
            data: {
                username,
                name,
                email,
                password: hashedPassword,
                role: userRole,
                position,
                status: userStatus,
            },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                position: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
