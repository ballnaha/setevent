import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://seteventthailand.com';

    // Base routes
    const routes = [
        '',
        '/products',
        '/services',
        '/portfolio',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Product routes
    const productRoutes = [
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
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Portfolio routes
    const portfolioRoutes = [
        '/portfolio/marketing-event',
        '/portfolio/seminar-conference',
        '/portfolio/exhibition',
        '/portfolio/concert',
        '/portfolio/wedding',
        '/portfolio/fixed-installation',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...productRoutes, ...portfolioRoutes];
}
