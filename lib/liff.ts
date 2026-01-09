import liff from '@line/liff';

// ตรวจสอบว่าควรใช้ Mock Mode หรือไม่
const IS_MOCK = process.env.NODE_ENV === 'development' &&
    (!process.env.NEXT_PUBLIC_LIFF_ID || process.env.NEXT_PUBLIC_LIFF_ID === 'mock');

let isInitialized = false;

export interface LiffProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
}

// Mock Profile สำหรับทดสอบ (ตรงกับ seed.ts)
const MOCK_PROFILE: LiffProfile = {
    userId: 'U28a72146890f8dfa7fbbac7560d3195e',
    displayName: 'ทดสอบ ลูกค้า',
    pictureUrl: 'https://i.pravatar.cc/150?u=setevent-mock',
    statusMessage: 'Testing SETEVENT LIFF',
};

// Mock Customer สำหรับทดสอบ (ตรงกับ seed.ts)
export const MOCK_CUSTOMER = {
    id: 'cust-001',
    lineUid: 'U28a72146890f8dfa7fbbac7560d3195e',
    displayName: 'ทดสอบ ลูกค้า',
    pictureUrl: 'https://i.pravatar.cc/150?u=setevent-mock',
    phone: '081-234-5678',
    email: 'test@example.com',
    companyName: 'บริษัท ทดสอบ จำกัด',
    status: 'active',
};

// Mock Events สำหรับทดสอบ
export const MOCK_EVENTS = [
    {
        eventName: 'งานแต่งงาน คุณสมชาย & คุณสมหญิง',
        inviteCode: 'WEDDING001',
        eventDate: new Date('2025-02-14'),
        venue: 'โรงแรมเซ็นทารา แกรนด์',
        status: 'confirmed',
    },
    {
        eventName: 'งานเปิดตัวสินค้า XYZ',
        inviteCode: 'LAUNCH002',
        eventDate: new Date('2025-03-01'),
        venue: 'สยามพารากอน ฮอลล์',
        status: 'in-progress',
    }
];

export async function initializeLiff(): Promise<LiffProfile | null> {

    // 🧪 Mock Mode - ใช้ข้อมูลจำลอง
    if (IS_MOCK) {
        console.log('🧪 LIFF Mock Mode: Using mock profile');

        // Allow overriding via URL param
        let mockProfile = { ...MOCK_PROFILE };
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const overrideUid = params.get('lineUid') || params.get('mockId');
            if (overrideUid) {
                mockProfile.userId = overrideUid;
                mockProfile.displayName = `Mock User (${overrideUid.slice(0, 4)}..)`;
            }
        }

        // จำลอง delay เหมือน LIFF จริง
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockProfile;
    }

    // 🔐 Production Mode - ใช้ LIFF จริง
    if (!process.env.NEXT_PUBLIC_LIFF_ID) {
        console.error('LIFF ID is not set');
        return null;
    }

    try {
        if (!isInitialized) {
            await liff.init({
                liffId: process.env.NEXT_PUBLIC_LIFF_ID,
                withLoginOnExternalBrowser: true, // รองรับเปิดนอก LINE App
            });
            isInitialized = true;

            // ✅ Clear URL parameters หลัง login (ลบ code, state, etc.)
            if (typeof window !== 'undefined' && window.location.search) {
                const url = new URL(window.location.href);
                const hasAuthParams = url.searchParams.has('code') ||
                    url.searchParams.has('state') ||
                    url.searchParams.has('liffClientId');

                if (hasAuthParams && liff.isLoggedIn()) {
                    // ลบ query parameters ออกจาก URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    console.log('✅ Cleared LIFF auth parameters from URL');
                }
            }
        }

        if (!liff.isLoggedIn()) {
            liff.login();
            return null;
        }

        const profile = await liff.getProfile();

        return {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
        };
    } catch (error) {
        console.error('LIFF initialization error:', error);
        return null;
    }
}

export function closeLiff() {
    if (IS_MOCK) {
        console.log('🧪 LIFF Mock Mode: Close window (no action)');
        return;
    }

    if (liff.isInClient()) {
        liff.closeWindow();
    }
}

export function isInLineApp(): boolean {
    if (IS_MOCK) return false;
    return liff.isInClient();
}

export function isMockMode(): boolean {
    return IS_MOCK;
}

export { liff };
