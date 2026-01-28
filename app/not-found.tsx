import Header from "./components/Header";
import Footer from "./components/Footer";
import { getContactSettings } from "@/lib/getContactSettings";
import NotFoundContent from "./components/NotFoundContent";
import ScrollToTop from "./components/ScrollToTop";
import SkipToContent from "./components/SkipToContent";

export default async function NotFound() {
    const contactSettings = await getContactSettings();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <SkipToContent />
            <Header contactSettings={contactSettings} forceDarkText={true} forceTransparent={true} />
            <main id="main-content" style={{ flex: 1 }} tabIndex={-1}>
                <NotFoundContent />
            </main>
            <Footer contactSettings={contactSettings} />
            <ScrollToTop />
        </div>
    );
}
