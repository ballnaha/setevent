import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://seteventthailand.com';

    return {
        rules: [
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/', '/liff/', '/valentine/'],
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/liff/', '/valentine/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
