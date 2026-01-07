import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: {
        default: "Admin Panel | SetEvent",
        template: "%s | Admin - SetEvent",
    },
    description: "SetEvent Admin Panel - จัดการงาน Event และลูกค้า",
    robots: {
        index: false,
        follow: false,
    },
};

export const viewport: Viewport = {
    themeColor: "#0A5C5A",
    width: "device-width",
    initialScale: 1,
};

export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
