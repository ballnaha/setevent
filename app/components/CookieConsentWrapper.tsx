'use client';

import dynamic from 'next/dynamic';

// Lazy load CookieConsent เพื่อไม่ให้ block initial render
const CookieConsentComponent = dynamic(
    () => import('./CookieConsent'),
    {
        ssr: false,
        loading: () => null,
    }
);

export default function CookieConsentWrapper() {
    return <CookieConsentComponent />;
}
