import { Metadata } from 'next';
import BlogDetailContent from './BlogDetailContent';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        // Query DB directly to avoid triggering view increment in API
        const blog = await prisma.blog.findUnique({
            where: {
                slug: slug,
            },
            select: {
                title: true,
                excerpt: true,
                coverImage: true,
            }
        });

        if (!blog) {
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
    } catch {
        return {
            title: 'บทความ | SetEvent',
            description: 'บทความและสาระน่ารู้เกี่ยวกับการจัดงานอีเวนต์',
        };
    }
}


export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    let blog = null;

    try {
        blog = await prisma.blog.findUnique({
            where: {
                slug: slug,
                status: 'published'
            },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                content: true,
                coverImage: true,
                category: true,
                author: true,
                publishedAt: true,
                views: true,
            }
        });
    } catch (error) {
        console.error("Error fetching blog details:", error);
    }

    // Convert Date to string for client component
    const serializedBlog = blog ? {
        ...blog,
        publishedAt: blog.publishedAt.toISOString(),
        author: blog.author || 'Admin', // Ensure author is string
        category: blog.category || 'General',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        coverImage: blog.coverImage || ''
    } : null;

    return <BlogDetailContent params={params} initialBlog={serializedBlog} />;
}

