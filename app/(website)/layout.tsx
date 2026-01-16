import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import SkipToContent from "../components/SkipToContent";
import { HomepageSchema } from "@/components/seo/JsonLdSchema";

export default function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Skip to main content link for keyboard navigation */}
            <SkipToContent />
            <HomepageSchema />
            <Header />
            <main id="main-content" style={{ flex: 1 }} tabIndex={-1}>
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}

