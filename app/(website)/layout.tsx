import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { HomepageSchema } from "@/components/seo/JsonLdSchema";

export default function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HomepageSchema />
            <Header />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}

