"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component that forces the window to scroll to top on every route change.
 * This fixes issue where Next.js App Router doesn't always reset scroll position
 * on some browsers or with some MUI layout configurations.
 */
export default function PageScrollTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Scroll to top of the page when the pathname changes
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
