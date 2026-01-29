import { prisma } from "@/lib/prisma";

export interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
    icon?: any;
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

export async function getMenuData(): Promise<MenuSection[]> {
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

        return sections;
    } catch (error) {
        console.error("Error fetching menu categories:", error);
        return [];
    }
}
