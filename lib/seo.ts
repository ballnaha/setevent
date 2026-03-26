/**
 * SEO utility functions to standardize meta descriptions and other SEO tags.
 * Aim for meta descriptions between 120-160 characters.
 */

export function getSEODescription(
  description: string | null | undefined,
  fallback: string,
  maxLength: number = 160
): string {
  if (!description || description.trim() === '') {
    // If fallback is provided, use it and ensure it's within limits
    return fallback.length > maxLength 
      ? fallback.substring(0, maxLength - 3) + '...' 
      : fallback;
  }

  // Strip HTML tags if any (basic regex)
  const plainText = description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate and add ellipsis
  return plainText.substring(0, maxLength - 3) + '...';
}

/**
 * Common SEO Fallbacks for the site
 */
export const SEO_FALLBACKS = {
  product: (name: string, category: string = '') => 
    `บริการเช่า ${name} ${category ? `ในหมวดหมู่ ${category}` : ''} ราคาถูก สำหรับงานแต่ง งานสัมมนา และอีเวนต์ทุกรูปแบบ พร้อมทีมงานติดตั้งมืออาชีพจาก SET EVENT Thailand ครบวงจรที่คุณกำหนดงบเองได้`,
  
  category: (name: string) => 
    `รวมสินค้าและบริการในหมวด ${name} สำหรับจัดงานอีเวนต์ทุกประเภท เช่าจอ LED เครื่องเสียง แสงสีเสียง ครบวงจรในราคาประหยัดจาก SET EVENT Thailand`,
  
  portfolio: (title: string, category: string = '') => 
    `ชมตัวอย่างผลงาน ${title} ${category ? `ประเภท ${category}` : ''} จากทีมงาน SET EVENT Thailand บริการจัดงานอีเวนต์มืออาชีพทั่วไทยด้วยระบบภาพและเสียงมาตรฐาน`,
    
  blog: (title: string, excerpt: string | null | undefined = '') => 
    excerpt || `อ่านบทความ ${title} เกร็ดความรู้และเทคนิคการจัดงานอีเวนต์ เช่าจอ LED และระบบแสงสีเสียงจากผู้เชี่ยวชาญ SET EVENT Thailand`
};
