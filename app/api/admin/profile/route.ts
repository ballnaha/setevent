import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                position: true,
                image: true,
                createdAt: true,
                status: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const body = await request.json();
        const { username, name, email, password, confirmPassword } = body;

        // Validation
        if (!email || !name) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check uniqueness if changing
        if (username && username !== user.username) {
            const exists = await prisma.user.findUnique({ where: { username } });
            if (exists) return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }

        if (email !== user.email) {
            const exists = await prisma.user.findUnique({ where: { email } });
            if (exists) return NextResponse.json({ error: 'Email already taken' }, { status: 400 });
        }

        const updateData: any = {
            name,
            email,
            username
        };

        if (password) {
            if (password !== confirmPassword) {
                return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                position: true,
                image: true,
                createdAt: true
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
