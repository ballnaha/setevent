import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import SkipToContent from "../components/SkipToContent";
import { HomepageSchema } from "@/components/seo/JsonLdSchema";
import { getContactSettings } from "@/lib/getContactSettings";

export default async function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch contact settings at server-side (no client-side API call needed)
    const contactSettings = await getContactSettings();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Skip to main content link for keyboard navigation */}
            <SkipToContent />
            <HomepageSchema />
            <Header contactSettings={contactSettings} />
            <main id="main-content" style={{ flex: 1 }} tabIndex={-1}>
                {children}
            </main>
            <Footer contactSettings={contactSettings} />
            <ScrollToTop />
        </div>
    );
}
