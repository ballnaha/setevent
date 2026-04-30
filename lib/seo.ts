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

export const RECOMMENDED_SEO_KEYWORDS = [
  'เช่าจอ LED กรุงเทพ',
  'เช่าจอ LED งานแต่ง',
  'เช่าจอ LED งานสัมมนา',
  'เช่าเครื่องเสียงงานอีเว้นท์',
  'เช่าเครื่องเสียงงานแต่ง',
  'เช่าเครื่องเสียงงานสัมมนา',
  'เช่าไฟเวทีงานอีเว้นท์',
  'เช่าเวทีงานแต่ง',
  'เช่าเวทีงานสัมมนา',
  'รับจัดงานอีเว้นท์ครบวงจร',
  'รับจัดงานอีเว้นท์ กรุงเทพ',
  'รับจัดงานแต่งงานครบวงจร',
  'จัดงานแต่งงานราคาประหยัด',
  'จัดงานสัมมนาราคาประหยัด',
  'จัดงานเปิดตัวสินค้า',
  'อุปกรณ์จัดงานแต่งงาน',
  'อุปกรณ์จัดงานสัมมนา',
  'ให้เช่าอุปกรณ์จัดงาน',
  'เช่า led wall',
  'เช่า led screen',
  'จอ LED งานอีเว้นท์',
  'จอ LED งานแต่งงาน',
  'จอ LED งานสัมมนา',
  'event organizer thailand',
  'event production thailand'
];

/**
 * Common SEO Fallbacks for the site
 */
export const SEO_FALLBACKS = {
  product: (name: string, category: string = '') =>
    `บริการเช่า ${name} ${category ? `ในหมวดหมู่ ${category}` : ''} ราคาถูก สำหรับงานแต่ง งานสัมมนา และอีเว้นท์ทุกรูปแบบ พร้อมทีมงานติดตั้งมืออาชีพจาก SET EVENT Thailand ครบวงจรที่คุณกำหนดงบเองได้`,

  category: (name: string) =>
    `รวมสินค้าและบริการในหมวด ${name} สำหรับจัดงานอีเว้นท์ทุกประเภท เช่าจอ LED เครื่องเสียง แสงสีเสียง ครบวงจรในราคาประหยัดจาก SET EVENT Thailand`,

  portfolio: (title: string, category: string = '') =>
    `ชมตัวอย่างผลงาน ${title} ${category ? `ประเภท ${category}` : ''} จากทีมงาน SET EVENT Thailand บริการจัดงานอีเว้นท์มืออาชีพทั่วไทยด้วยระบบภาพและเสียงมาตรฐาน`,

  blog: (title: string, excerpt: string | null | undefined = '') =>
    excerpt || `อ่านบทความ ${title} เกร็ดความรู้และเทคนิคการจัดงานอีเว้นท์ เช่าจอ LED และระบบแสงสีเสียงจากผู้เชี่ยวชาญ SET EVENT Thailand`,

  promotion: (title: string, description: string | null | undefined = '') =>
    description || `รับดีลพิเศษเช่าอุปกรณ์งานอีเว้นท์: ${title} โปรโมชั่นราคาถูกที่สุดจาก SET EVENT Thailand ครบวงจรสำหรับงานแต่งและสัมมนา จองเลยวันนี้!`,

  design: () =>
    `รวมไอเดียการออกแบบเวที Stage Design, Wedding Planner และงานอีเว้นท์ระดับพรีเมียม สวยงาม ทันสมัย สร้างสรรค์โดยทีมงานมืออาชีพจาก SET EVENT Thailand`
};
