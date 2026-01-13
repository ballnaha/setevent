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

export default function BlogDetailPage({ params }: Props) {
    return <BlogDetailContent params={params} />;
}
