import { Metadata } from 'next';
import BlogDetailContent from './BlogDetailContent';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006'}/api/blogs/${slug}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return {
                title: 'บทความ | SetEvent',
                description: 'บทความและสาระน่ารู้เกี่ยวกับการจัดงานอีเวนต์',
            };
        }

        const blog = await res.json();

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
