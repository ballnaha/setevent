import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all blogs (admin)
export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { publishedAt: 'desc' },
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

// POST - Create new blog
export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Generate slug from title if not provided
        let slug = data.slug;
        if (!slug) {
            slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9ก-๙\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }

        // Check if slug exists
        const existing = await prisma.blog.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const blog = await prisma.blog.create({
            data: {
                title: data.title,
                slug: slug,
                excerpt: data.excerpt || null,
                content: data.content || null,
                coverImage: data.coverImage || null,
                author: data.author || 'Admin',
                category: data.category || 'General',
                status: data.status || 'draft',
                publishedAt: data.status === 'published' ? new Date() : undefined,
            },
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}
