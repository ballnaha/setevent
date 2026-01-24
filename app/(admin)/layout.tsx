import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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

export default async function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <>
            {children}
        </>
    );
}
