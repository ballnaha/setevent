
import React from 'react';
import type { Metadata } from 'next';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
    title: 'บทความและสาระน่ารู้ | SetEvent Thailand',
    description: 'อัปเดตเทรนด์งานอีเวนต์ ความรู้เรื่องจอ LED ระบบเสียง แสง สี และไอเดียจัดงานแต่งงาน โดยทีมงานมืออาชีพ',
    keywords: 'บทความอีเวนต์, ความรู้จอ LED, ไอเดียจัดงานแต่ง, ระบบเสียงงานแต่ง, เช่าจอ LED ความรู้',
    openGraph: {
        title: 'บทความและสาระน่ารู้ | SetEvent Thailand',
        description: 'รวมบทความที่น่าสนใจสำหรับผู้จัดงานอีเวนต์',
        url: 'https://seteventthailand.com/blog',
        siteName: 'SetEvent Thailand',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'SetEvent Blog',
            },
        ],
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/blog',
    },
};

import prisma from '@/lib/prisma';

// Fetch blogs directly from database for better performance (Server Component)
async function getBlogs() {
    try {
        const blogs = await prisma.blog.findMany({
            where: { status: 'published' },
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                coverImage: true,
                category: true,
                author: true,
                publishedAt: true,
                views: true,
            }
        });

        // Transform data to match interface
        return blogs.map(blog => ({
            ...blog,
            author: blog.author || 'Admin',
            publishedAt: blog.publishedAt.toISOString(),
            // Add required fields for props matching
            category: blog.category || 'General',
            excerpt: blog.excerpt || '',
            coverImage: blog.coverImage || ''
        }));
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return [];
    }
}

export default async function BlogPage() {
    const blogs = await getBlogs();
    return <BlogContent initialBlogs={blogs} />;
}
