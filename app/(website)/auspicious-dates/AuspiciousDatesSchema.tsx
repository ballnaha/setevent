import Script from 'next/script';

export function AuspiciousDatesSchema() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'บริการหาฤกษ์มงคลสมรส ฤกษ์แต่งงาน',
        provider: {
            '@type': 'LocalBusiness',
            name: 'SET EVENT Thailand',
            image: 'https://seteventthailand.com/images/logo_black1.png',
            telephone: '081-234-5678', // Placeholder from settings
            url: 'https://seteventthailand.com'
        },
        description: 'บริการหาฤกษ์มงคลสมรส หาฤกษ์แต่งงาน วันเวลาที่เป็นปฐมฤกษ์แห่งการเริ่มต้นชีวิตคู่ของคุณอย่างสมบูรณ์แบบ ออกแบบให้เหมาะสมกับดวงชะตาของคู่บ่าวสาว',
        areaServed: 'TH',
        url: 'https://seteventthailand.com/auspicious-dates',
        serviceType: 'Wedding Auspicious Dates Consulting',
        offers: {
            '@type': 'Offer',
            price: '0', // Adjust if they charge money
            priceCurrency: 'THB',
            url: 'https://seteventthailand.com/auspicious-dates',
            priceValidUntil: '2027-12-31'
        }
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'หน้าแรก',
                item: 'https://seteventthailand.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'บริการแต่งงาน',
                item: 'https://seteventthailand.com/wedding-e-card' // fallback parent
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: 'หาฤกษ์มงคลสมรส',
                item: 'https://seteventthailand.com/auspicious-dates'
            }
        ]
    };

    return (
        <>
            <Script
                id="auspicious-dates-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Script
                id="auspicious-dates-breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
        </>
    );
}
