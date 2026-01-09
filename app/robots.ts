import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/liff/'],
        },
        sitemap: 'https://seteventthailand.com/sitemap.xml',
    };
}
