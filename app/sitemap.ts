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
        {
            url: `${baseUrl}/wedding-e-card`,
            lastModified: new Date('2026-03-24'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // ========================================
    // 📝 DYNAMIC BLOG POSTS
    // ========================================
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const blogs = await prisma.blog.findMany({
            where: { status: 'published' },
            select: { slug: true, updatedAt: true },
        });
        blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
        }));
    } catch (e) { console.error('Sitemap: Blogs error', e); }

    // ========================================
    // 📁 DYNAMIC CATEGORIES & PRODUCTS
    // ========================================
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        // Fetch all active categories to build nested slugs
        const categories = await prisma.category.findMany({
            where: { status: 'active' },
            select: { id: true, slug: true, parentId: true, updatedAt: true }
        });

        // Helper to build full slug path
        const getFullSlug = (catId: string): string => {
            const cat = categories.find(c => c.id === catId);
            if (!cat) return '';
            const parentSlug = cat.parentId ? getFullSlug(cat.parentId) : '';
            return parentSlug ? `${parentSlug}/${cat.slug}` : cat.slug;
        };

        const categoryRoutes = categories.map(cat => ({
            url: `${baseUrl}/products/${getFullSlug(cat.id)}`,
            lastModified: cat.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        productRoutes = [...categoryRoutes];
    } catch (e) { console.error('Sitemap: Products/Categories error', e); }

    // ========================================
    // 🎨 DYNAMIC PORTFOLIO
    // ========================================
    let portfolioRoutes: MetadataRoute.Sitemap = [];
    try {
        const portfolios = await prisma.portfolio.findMany({
            where: { status: 'active' },
            select: { slug: true, updatedAt: true }
        });
        portfolioRoutes = portfolios.map((p) => ({
            url: `${baseUrl}/portfolio/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.7,
        }));
    } catch (e) { console.error('Sitemap: Portfolio error', e); }

    // ========================================
    // 🔗 COMBINE ALL ROUTES
    // ========================================
    return [
        ...staticRoutes,
        ...blogRoutes,
        ...productRoutes,
        ...portfolioRoutes,
    ];
}

