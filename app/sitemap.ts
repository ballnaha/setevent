import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// 📅 Fixed dates for static pages (only update when content actually changes)
const STATIC_PAGE_DATES = {
    home: '2025-01-01',
    products: '2025-01-01',
    services: '2025-01-01',
    portfolio: '2025-01-01',
    promotions: '2025-01-01',
    contact: '2025-01-01',
    faq: '2025-01-01',
    about: '2025-01-01',
    blog: '2025-01-15',
    designs: '2025-01-10',
    privacyPolicy: '2025-01-01',
    termsOfService: '2025-01-01',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://seteventthailand.com';

    // ========================================
    // 📌 STATIC ROUTES (Fixed dates)
    // ========================================
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(STATIC_PAGE_DATES.home),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(STATIC_PAGE_DATES.products),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(STATIC_PAGE_DATES.services),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(STATIC_PAGE_DATES.portfolio),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/promotions`,
            lastModified: new Date(STATIC_PAGE_DATES.promotions),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(STATIC_PAGE_DATES.contact),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(STATIC_PAGE_DATES.faq),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(STATIC_PAGE_DATES.about),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(STATIC_PAGE_DATES.blog),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/designs`,
            lastModified: new Date(STATIC_PAGE_DATES.designs),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(STATIC_PAGE_DATES.privacyPolicy),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: new Date(STATIC_PAGE_DATES.termsOfService),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // ========================================
    // 📦 PRODUCT ROUTES (Static - update dates when adding new products)
    // ========================================
    const productRoutes: MetadataRoute.Sitemap = [
        '/products/rental/led-screen',
        '/products/rental/lighting',
        '/products/rental/sound',
        '/products/rental/stage',
        '/products/rental/motion-graphic',
        '/products/rental/interactive',
        '/products/rental/laser',
        '/products/rental/mapping',
        '/products/rental/flower-souvenirs',
        '/products/fixed/led-screen',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date('2025-01-01'),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // ========================================
    // 🖼️ PORTFOLIO CATEGORY ROUTES
    // ========================================
    const portfolioCategoryRoutes: MetadataRoute.Sitemap = [
        '/portfolio/marketing-event',
        '/portfolio/seminar-conference',
        '/portfolio/exhibition',
        '/portfolio/concert',
        '/portfolio/wedding',
        '/portfolio/fixed-installation',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date('2025-01-01'),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // ========================================
    // 📝 DYNAMIC BLOG POSTS (From Database)
    // ========================================
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const blogs = await prisma.blog.findMany({
            where: { status: 'published' },
            select: {
                slug: true,
                updatedAt: true,
            },
            orderBy: { publishedAt: 'desc' },
        });

        blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch blogs', error);
    }

    // ========================================
    // 🎨 DYNAMIC DESIGNS (From Database) - Optional
    // ========================================
    let designRoutes: MetadataRoute.Sitemap = [];
    try {
        const designs = await prisma.design.findMany({
            where: { status: 'active' },
            select: {
                id: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit for performance
        });

        designRoutes = designs.map((design) => ({
            url: `${baseUrl}/designs/${design.id}`,
            lastModified: design.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch designs', error);
    }

    // ========================================
    // 🔗 COMBINE ALL ROUTES
    // ========================================
    return [
        ...staticRoutes,
        ...productRoutes,
        ...portfolioCategoryRoutes,
        ...blogRoutes,
        ...designRoutes,
    ];
}
