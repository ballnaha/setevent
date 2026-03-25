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
    const baseUrl = 'https://seteventthailand.com';

    if (!blog) {
        return {
            title: 'บทความ | SetEvent Thailand',
            description: 'บทความและสาระน่ารู้เกี่ยวกับการจัดงานอีเวนต์',
        };
    }

    const title = `${blog.title} | SetEvent Thailand`;
    const description = blog.excerpt || blog.title;
    const imageUrl = blog.coverImage 
        ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${baseUrl}${blog.coverImage}`)
        : `${baseUrl}/images/og-image.jpg`;

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/blog/${decodedSlug}`,
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/blog/${decodedSlug}`,
            siteName: 'SetEvent Thailand',
            locale: 'th_TH',
            type: 'article',
            publishedTime: blog.publishedAt.toISOString(),
            authors: [blog.author || 'Admin'],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
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

