import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type for menu item
interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

// GET /api/categories/menu - Get categories formatted for navigation menu
export async function GET() {
    try {
        // Fetch all active categories with their children
        const categories = await prisma.category.findMany({
            where: { status: 'active' },
            include: {
                children: {
                    where: { status: 'active' },
                    include: {
                        children: {
                            where: { status: 'active' },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        });

        // Get only root categories (parentId is null)
        const rootCategories = categories.filter(cat => cat.parentId === null);

        // Transform to menu sections format
        const sections: MenuSection[] = rootCategories.map(rootCat => {
            const buildMenuItem = (cat: typeof categories[0]): MenuItem => {
                const menuItem: MenuItem = {
                    label: cat.name,
                    href: `/products/${cat.slug}`
                };

                // Check if this category has children
                const catWithChildren = categories.find(c => c.id === cat.id);
                if (catWithChildren && 'children' in catWithChildren &&
                    Array.isArray(catWithChildren.children) &&
                    catWithChildren.children.length > 0) {
                    menuItem.children = catWithChildren.children.map((child: any) => {
                        const childMenuItem: MenuItem = {
                            label: child.name,
                            href: `/products/${rootCat.slug}/${child.slug}`
                        };

                        // Handle 3rd level children
                        if (child.children && child.children.length > 0) {
                            childMenuItem.children = child.children.map((grandChild: any) => ({
                                label: grandChild.name,
                                href: `/products/${rootCat.slug}/${child.slug}/${grandChild.slug}`
                            }));
                        }

                        return childMenuItem;
                    });
                }

                return menuItem;
            };

            return {
                title: rootCat.name,
                items: rootCat.children?.map((child: any) => {
                    const menuItem: MenuItem = {
                        label: child.name,
                        href: `/products/${rootCat.slug}/${child.slug}`
                    };

                    if (child.children && child.children.length > 0) {
                        menuItem.children = child.children.map((grandChild: any) => ({
                            label: grandChild.name,
                            href: `/products/${rootCat.slug}/${child.slug}/${grandChild.slug}`
                        }));
                    }

                    return menuItem;
                }) || []
            };
        });

        return NextResponse.json({
            success: true,
            sections,
            // Also return flat list for potential use
            allCategories: categories.map(c => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                parentId: c.parentId
            }))
        });
    } catch (error) {
        console.error("Error fetching menu categories:", error);
        return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
    }
}
