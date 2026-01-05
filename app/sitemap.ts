import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://setevent.co.th';

    // Future: Fetch dynamic categories or services from DB
    const serviceRoutes = [
        '/services/equipment-rental',
        '/services/event-organizer',
        '/services/wedding-organizer',
    ];

    const routes = ['', '/services', '/contact', ...serviceRoutes].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
