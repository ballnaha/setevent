'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Routes to exclude from Google Analytics tracking
const EXCLUDED_ROUTES = ['/admin', '/liff', '/auth'];

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    const pathname = usePathname();

    // Don't track if no GA ID
    if (!gaId) return null;

    // Don't track admin and liff routes
    const shouldExclude = EXCLUDED_ROUTES.some(route =>
        pathname?.startsWith(route)
    );

    if (shouldExclude) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
            </Script>
        </>
    );
}

