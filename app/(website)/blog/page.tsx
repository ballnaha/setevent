
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

export default function BlogPage() {
    return <BlogContent />;
}
