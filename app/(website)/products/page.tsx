import { Metadata } from 'next';
import ProductsContent from './ProductsContent';

export const metadata: Metadata = {
    title: 'Products & Services | SET EVENT',
    description: 'บริการจัดงานอีเวนต์ครบวงจร ให้เช่าอุปกรณ์ แสง สี เสียง เวที จอ LED และโครงสร้างบูธ',
    keywords: ['สินค้า', 'บริการ', 'เช่าอุปกรณ์', 'แสง สี เสียง', 'เครื่องเสียง', 'จอ LED', 'โครงสร้างเวที', 'SET EVENT']
};

export default function ProductsPage() {
    return <ProductsContent />;
}
