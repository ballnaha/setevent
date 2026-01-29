import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import SkipToContent from "../components/SkipToContent";
import { HomepageSchema } from "@/components/seo/JsonLdSchema";
import { getContactSettings } from "@/lib/getContactSettings";
import { getMenuData } from "@/lib/getMenuData";

export default async function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch contact settings and menu data at server-side (no client-side API call needed)
    const [contactSettings, menuData] = await Promise.all([
        getContactSettings(),
        getMenuData()
    ]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Skip to main content link for keyboard navigation */}
            <SkipToContent />
            <HomepageSchema />
            <Header contactSettings={contactSettings} initialMenuData={menuData} />
            <main id="main-content" style={{ flex: 1 }} tabIndex={-1}>
                {children}
            </main>
            <Footer contactSettings={contactSettings} />
            <ScrollToTop />
        </div>
    );
}
