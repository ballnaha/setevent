import { Metadata } from 'next';
import BlogDetailContent from './BlogDetailContent';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>;
};

// Start of Selection
const getBlog = cache(async (slug: string) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                slug: slug,
            }
        });

        if (!blog || blog.status !== 'published') {
            return null;
        }

        return blog;
    } catch (error) {
        console.error("Error fetching blog details:", error);
        return null;
    }
});

// Start of Selection
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const blog = await getBlog(decodedSlug);

    if (!blog) {
        // End of Selection
        return {
            title: 'บทความ | SetEvent',
            description: 'บทความและสาระน่ารู้เกี่ยวกับการจัดงานอีเวนต์',
        };
    }

    return {
        title: blog.title,
        description: blog.excerpt || blog.title,
        openGraph: {
            title: blog.title,
            description: blog.excerpt || blog.title,
            images: blog.coverImage ? [blog.coverImage] : [],
        },
    };
}


export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const blog = await getBlog(decodedSlug);

    if (!blog) {
        notFound();
    }

    // Convert Date to string for client component
    const serializedBlog = {
        ...blog,
        publishedAt: blog.publishedAt.toISOString(),
        author: blog.author || 'Admin', // Ensure author is string
        category: blog.category || 'General',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        coverImage: blog.coverImage || ''
    };

    return <BlogDetailContent params={params} initialBlog={serializedBlog} />;
}

