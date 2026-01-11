'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

interface MenuData {
    sections: MenuSection[];
    loading: boolean;
    error: string | null;
}

// Default fallback menu in case API fails
const defaultSections: MenuSection[] = [
    {
        title: "Rental",
        items: [
            { label: "LED Screen", href: "/products/rental/led-screen" },
            { label: "Lighting Systems", href: "/products/rental/lighting" },
            { label: "Sound Systems", href: "/products/rental/sound" },
        ]
    },
    {
        title: "Fixed Installation",
        items: [
            { label: "LED Screen", href: "/products/fixed/led-screen" }
        ]
    }
];

export function useMenuData(): MenuData {
    const [sections, setSections] = useState<MenuSection[]>(defaultSections);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMenu() {
            try {
                const res = await fetch('/api/categories/menu');
                if (!res.ok) throw new Error('Failed to fetch menu');

                const data = await res.json();
                if (data.success && data.sections && data.sections.length > 0) {
                    setSections(data.sections);
                }
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError('Failed to load menu');
                // Keep default sections as fallback
            } finally {
                setLoading(false);
            }
        }

        fetchMenu();
    }, []);

    return { sections, loading, error };
}
