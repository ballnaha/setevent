"use client";

import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
    Box,
    Typography,
    Button,
    Stack,
    Paper,
    CircularProgress,
    Chip,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    LinearProgress
} from '@mui/material';
import { CalendarSearch, Heart, Star, Warning2, ArrowDown2, InfoCircle, Chart } from 'iconsax-react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ScoreBreakdown {
    month: number;
    day: number;
    thongchai: number;
    zodiacGroom: number;
    zodiacBride: number;
    lunar: number;
}

const BREAKDOWN_LABELS: { key: keyof ScoreBreakdown; label: string; max: number; icon: string }[] = [
    { key: 'month', label: 'เดือนมงคล', max: 20, icon: '📅' },
    { key: 'day', label: 'อธิบดีวัน', max: 25, icon: '☀️' },
    { key: 'thongchai', label: 'วันธงชัย', max: 15, icon: '🚩' },
    { key: 'zodiacGroom', label: 'สมพงษ์นักษัตรเจ้าบ่าว', max: 15, icon: '🤵' },
    { key: 'zodiacBride', label: 'สมพงษ์นักษัตรเจ้าสาว', max: 15, icon: '👰‍♀️' },
    { key: 'lunar', label: 'จันทรคติ (ข้างขึ้น)', max: 10, icon: '🌙' },
];

interface CalculationResult {
    date: Date;
    rating: 'perfect' | 'good';
    description: string;
    reasons: string[];
    score: number;
    headline: string;
    prediction: string;
    goodColors: string;
    badColor: string;
    venueStyle: string;
    breakdown: ScoreBreakdown;
}

const DAY_NAMES_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const ZODIACS = ["วอก (ลิง)", "ระกา (ไก่)", "จอ (หมา)", "กุน (หมู)", "ชวด (หนู)", "ฉลู (วัว)", "ขาล (เสือ)", "เถาะ (กระต่าย)", "มะโรง (งูใหญ่)", "มะเส็ง (งูเล็ก)", "มะเมีย (ม้า)", "มะแม (แพะ)"];

const DAY_COLORS_VENUES: Record<number, { goodColors: string, badColor: string, venue: string }> = {
    0: { goodColors: 'แดง, ชมพู, เขียว', badColor: 'ฟ้า/น้ำเงิน', venue: 'สถานที่เปิดโล่ง รับแสงธรรมชาติกระจ่างใส หรือสไตล์คลาสสิกโก้หรู (พลังธาตุไฟ)' },
    1: { goodColors: 'ขาว, เหลือง, ฟ้า', badColor: 'แดง', venue: 'สถานที่ริมน้ำ ริมทะเล หรือห้องจัดเลี้ยงที่มีแชนเดอเลียร์สะท้อนแสงนวลตา (พลังธาตุดิน)' },
    2: { goodColors: 'ชมพู, ส้ม, ดำ', badColor: 'ขาว/เหลือง', venue: 'สถานที่ที่มีแนวโครงสร้างสถาปัตยกรรมโดดเด่น หรือสไตล์ลอฟต์ร่วมสมัย (พลังธาตุลม)' },
    3: { goodColors: 'เขียว, เหลือง, เทา', badColor: 'ชมพู', venue: 'สถานที่ใกล้ชิดธรรมชาติ สวนป่าร่มรื่น หรือ Glasshouse แนวทรอปิคอล (พลังธาตุน้ำ)' },
    4: { goodColors: 'ส้ม, แดง, ฟ้า', badColor: 'ม่วง/ดำ', venue: 'สถานที่ลักษณะเรือนไทยโบราณ โบสถ์ หรือโรงแรมที่มีความโอ่อ่าภูมิฐานสง่างาม (พลังธาตุดิน)' },
    5: { goodColors: 'ฟ้า, น้ำเงิน, ขาว, ชมพู', badColor: 'เทา/บรอนซ์', venue: 'สถานที่ประดับดอกไม้อลังการ สไตล์โรแมนติกหวานแหวว ท่ามกลางดนตรีไพเราะ (พลังธาตุน้ำ)' },
    6: { goodColors: 'ม่วง, ดำ, ฟ้า, แดง', badColor: 'เขียว', venue: 'สถานที่เก่าแก่วินเทจ หรือสตูดิโอที่มีกลิ่นอายประวัติศาสตร์คลาสสิก (พลังธาตุไฟ)' },
};

// คู่ชง (ปะทะ) 6 คู่
const CLASHES: Record<number, number> = {
    0: 6, 6: 0,   // วอก ชง ขาล
    1: 7, 7: 1,   // ระกา ชง เถาะ
    2: 8, 8: 2,   // จอ ชง มะโรง
    3: 9, 9: 3,   // กุน ชง มะเส็ง
    4: 10, 10: 4, // ชวด ชง มะเมีย
    5: 11, 11: 5  // ฉลู ชง มะแม
};

// เดือนมงคลสมรส (ม.ค., มี.ค., พ.ค., ส.ค., พ.ย.)
const THAI_GOOD_MONTHS: Record<number, string> = {
    0: 'มกราคม (ตรงกับเดือน 2 ไทย)',
    2: 'มีนาคม (ตรงกับเดือน 4 ไทย)',
    4: 'พฤษภาคม (ตรงกับเดือน 6 ไทย)',
    7: 'สิงหาคม (ตรงกับเดือน 9 ไทย)',
    10: 'พฤศจิกายน (ตรงกับเดือน 12 ไทย)',
};

export default function AuspiciousCalculator() {
    const [groomDate, setGroomDate] = useState<Dayjs | null>(null);
    const [brideDate, setBrideDate] = useState<Dayjs | null>(null);

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<CalculationResult[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getDayZodiac = (date: Date) => {
        const baseDate = new Date(2024, 0, 1);
        const diffTime = date.getTime() - baseDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return (4 + (diffDays % 12) + 12) % 12;
    };

    const THONGCHAI_MAP: Record<number, number> = {
        0: 0, 4: 0, 8: 0,    // ม.ค. พ.ค. ก.ย. → อาทิตย์
        1: 1, 5: 1, 9: 1,    // ก.พ. มิ.ย. ต.ค. → จันทร์
        2: 2, 6: 2, 10: 2,   // มี.ค. ก.ค. พ.ย. → อังคาร
        3: 3, 7: 3, 11: 3,   // เม.ย. ส.ค. ธ.ค. → พุธ
    };

    const DAY_RULING: Record<number, { planet: string; element: string; quality: string }> = {
        0: { planet: 'พระอาทิตย์', element: 'ไฟ', quality: 'บารมี อำนาจ' },
        1: { planet: 'พระจันทร์', element: 'น้ำ', quality: 'เสน่ห์ ความอ่อนโยน' },
        2: { planet: 'พระอังคาร', element: 'ไฟ', quality: 'ความแข็งกร้าว' },
        3: { planet: 'พระพุธ', element: 'ดิน', quality: 'ปัญญา การสื่อสาร' },
        4: { planet: 'พระพฤหัสบดี', element: 'น้ำ', quality: 'ความเมตตา ครูอาจารย์' },
        5: { planet: 'พระศุกร์', element: 'น้ำ', quality: 'ความรัก ความสุข ศิลปะ' },
        6: { planet: 'พระเสาร์', element: 'ไฟ', quality: 'ความทุกข์ อุปสรรค' },
    };

    const TRINE_GROUPS = [
        [4, 8, 0],     // ชวด-มะโรง-วอก (กลุ่มธาตุน้ำ)
        [5, 9, 1],     // ฉลู-มะเส็ง-ระกา (กลุ่มธาตุทอง)
        [6, 10, 2],    // ขาล-มะเมีย-จอ (กลุ่มธาตุไม้)
        [7, 11, 3],    // เถาะ-มะแม-กุน (กลุ่มธาตุไฟ)
    ];
    const TRINE_NAMES = ['ธาตุน้ำ (Water)', 'ธาตุทอง (Metal)', 'ธาตุไม้ (Wood)', 'ธาตุไฟ (Fire)'];

    const getTrineGroup = (zodiac: number) => TRINE_GROUPS.findIndex(g => g.includes(zodiac));

    const getLunarDay = (date: Date) => {
        const KNOWN_NEW_MOON = new Date(2024, 0, 11).getTime(); // ~11 ม.ค. 2024 = วันเดือนดับ
        const SYNODIC_MONTH = 29.53059;
        const diff = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
        const lunarAge = ((diff % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
        return Math.floor(lunarAge) + 1; // 1-30
    };

    const generatePrediction = (reasons: string[], score: number, dayOfWeek: number): { headline: string; detail: string } => {
        const parts: string[] = [];
        let headline = '✨ วันดีศรีมงคล ราบรื่นร่มเย็น';

        const hasThongchai = reasons.some(r => r.includes('[วันธงชัย]'));
        const hasLunarFull = reasons.some(r => r.includes('วันเพ็ญ'));
        const hasLunarWax = reasons.some(r => r.includes('ข้างขึ้น'));
        const hasDirectGroom = reasons.some(r => r.includes('[สมพงษ์ตรง]') && r.includes('เจ้าบ่าว'));
        const hasDirectBride = reasons.some(r => r.includes('[สมพงษ์ตรง]') && r.includes('เจ้าสาว'));
        const hasTrine = reasons.some(r => r.includes('[ตรีโกณ]'));
        const hasGoodMonth = reasons.some(r => r.includes('[เดือนมงคล]'));

        if (hasDirectGroom && hasDirectBride) {
            headline = '❤️ สมพงษ์คู่แท้ รักกันปานจะกลืนกิน';
        } else if (hasDirectBride && !hasDirectGroom) {
            headline = '🌺 แต่งวันนี้เจ้าสาวจะเป็นใหญ่ ได้รับการชูเชิดพิเศษ';
        } else if (hasDirectGroom && !hasDirectBride) {
            headline = 'ผู้นำครอบครัวแข็งแกร่ง ฐานะมั่นคงยั่งยืน';
        } else if (hasThongchai && dayOfWeek === 5) {
            headline = '💎 แต่งวันนี้จะได้ลาภเงินทองไหลมาเทมา';
        } else if (hasLunarFull) {
            headline = '🌕 ชีวิตคู่สว่างไสว สมบูรณ์พูนสุขดั่งจันทร์เพ็ญ';
        } else if (hasThongchai) {
            headline = '🚩 ทำอะไรก็มีแต่ชัยชนะ กิจการรุ่งเรือง';
        } else if (dayOfWeek === 5) {
            headline = '💰 ร่ำรวยความสุขและทรัพย์สิน';
        }

        if (hasThongchai) {
            parts.push('เป็นวันแห่งชัยชนะ การเริ่มต้นใหม่จะประสบความสำเร็จ ผ่านอุปสรรคได้ราบรื่น');
        }
        if (hasDirectGroom && hasDirectBride) {
            parts.push('ดวงชะตาของทั้งเจ้าบ่าวและเจ้าสาวสมพงษ์กับวันนี้โดยตรง ชีวิตสมรสจะมีความเข้าใจกันเป็นอย่างดี');
        } else if (hasDirectGroom) {
            parts.push('ดวงเจ้าบ่าวจะเป็นผู้นำพาครอบครัวด้วยความมั่นคง เพราะวันนี้หนุนดวงชะตาเจ้าบ่าวโดยตรง');
        } else if (hasDirectBride) {
            parts.push('ดวงเจ้าสาวจะเป็นศูนย์กลางของครอบครัว วันนี้เสริมบุญบารมีเจ้าสาวอย่างพิเศษ');
        } else if (hasTrine) {
            parts.push('ธาตุนักษัตรของคุณทั้งคู่สอดคล้องกับพลังของวัน จะช่วยเสริมสร้างความสัมพันธ์ให้แข็งแกร่ง');
        }
        if (hasLunarFull) {
            parts.push('พระจันทร์เต็มดวงส่องสว่าง เปรียบเสมือนชีวิตคู่ที่สมบูรณ์และเปี่ยมด้วยความสุข');
        } else if (hasLunarWax) {
            parts.push('ดวงจันทร์กำลังเจริญขึ้น เปรียบเสมือนความรักที่จะเติบโตขึ้นเรื่อยๆ ไม่มีวันเสื่อมคลาย');
        }
        if (hasGoodMonth && dayOfWeek === 5) {
            parts.push('เดือนมงคลผนวกกับวันศุกร์ (วันแห่งความสุข) คาดว่าชีวิตคู่จะราบรื่น มีทรัพย์สินและความสุขเป็นเลิศ');
        } else if (hasGoodMonth && dayOfWeek === 1) {
            parts.push('เดือนมงคลผนวกกับวันจันทร์ (วันแห่งเสน่ห์) คู่สมรสจะมีเสน่ห์ดึงดูดกัน รักกันยืนยาว');
        } else if (hasGoodMonth) {
            parts.push('การจัดงานในเดือนนี้จะได้รับพลังเสริมจากฤดูกาล ทำให้ทุกสิ่งลงตัว');
        }

        if (parts.length === 0) {
            parts.push('วันนี้ผ่านเกณฑ์มงคลหลายประการ คาดว่าชีวิตสมรสจะราบรื่น มีความสุข');
        }

        return { headline, detail: parts.join(' ') };
    };

    const calculateDates = (e: React.FormEvent) => {
        e.preventDefault();
        if (!groomDate || !brideDate) return;

        setError(null);
        if (groomDate.isAfter(dayjs()) || brideDate.isAfter(dayjs())) {
            setError('วันเกิดต้องอยู่ก่อนวันปัจจุบันเท่านั้นครับ');
            return;
        }

        setLoading(true);
        setResults(null);

        setTimeout(() => {
            const groomDateObj = groomDate.toDate();
            const brideDateObj = brideDate.toDate();

            const groomYear = groomDateObj.getFullYear();
            const brideYear = brideDateObj.getFullYear();

            // ใช้ปีนักษัตรแบบไทย (ง่ายๆ ตามปี ค.ศ.)
            const groomZodiac = (groomYear + 12 - 4) % 12; // 0 = ชวด ? ไม่สิ อิงตามโค้ดเดิม
            // โค้ดเดิม: const groomZodiac = groomDateObj.getFullYear() % 12;
            // แต่ getDayZodiac ใช้สูตรต่างออกไป 
            // ให้ยึดตามโค้ดเดิมที่เคยทำงานได้
            const gz = groomDateObj.getFullYear() % 12;
            const bz = brideDateObj.getFullYear() % 12;

            const groomTrine = getTrineGroup(gz);
            const brideTrine = getTrineGroup(bz);

            const scoredDates: { date: Date; score: number; reasons: string[]; breakdown: ScoreBreakdown }[] = [];
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();

            for (let mOffset = 1; mOffset <= 12; mOffset++) {
                const evalYear = currentYear + Math.floor((currentMonth + mOffset) / 12);
                const evalMonth = (currentMonth + mOffset) % 12;
                const daysInMonth = new Date(evalYear, evalMonth + 1, 0).getDate();

                for (let d = 1; d <= daysInMonth; d++) {
                    const date = new Date(evalYear, evalMonth, d);
                    const dayOfWeek = date.getDay();
                    const dayZodiac = getDayZodiac(date);
                    const lunarDay = getLunarDay(date);
                    const dayTrine = getTrineGroup(dayZodiac);

                    let score = 0;
                    const reasons: string[] = [];
                    const bd: ScoreBreakdown = { month: 0, day: 0, thongchai: 0, zodiacGroom: 0, zodiacBride: 0, lunar: 0 };

                    if (evalMonth in THAI_GOOD_MONTHS) {
                        bd.month = 20; score += 20;
                        reasons.push(`✅ [เดือนมงคล] ${THAI_GOOD_MONTHS[evalMonth]} — ตามตำราพรหมประสิทธิ์`);
                    }

                    if (dayZodiac === CLASHES[gz]) score -= 100;
                    if (dayZodiac === CLASHES[bz]) score -= 100;

                    const ruling = DAY_RULING[dayOfWeek];
                    if (dayOfWeek === 5) { bd.day = 25; score += 25; reasons.push(`✅ [อธิบดีวัน] วันศุกร์ ดาวพระศุกร์ครอง — เสริมความรัก ความสุข`); }
                    else if (dayOfWeek === 1) { bd.day = 18; score += 18; reasons.push(`✅ [อธิบดีวัน] วันจันทร์ ดาวพระจันทร์ครอง — เสริมเสน่ห์`); }
                    else if (dayOfWeek === 4) { bd.day = 14; score += 14; reasons.push(`✅ [อธิบดีวัน] วันพฤหัสบดี — เสริมความเมตตา`); }
                    else if (dayOfWeek === 0) { bd.day = 12; score += 12; reasons.push(`✅ [อธิบดีวัน] วันอาทิตย์ — เสริมบารมี`); }
                    else if (dayOfWeek === 3) score -= 5;
                    else score -= 50;

                    if (THONGCHAI_MAP[evalMonth] === dayOfWeek) {
                        bd.thongchai = 15; score += 15;
                        reasons.push(`✅ [วันธงชัย] ประจำเดือน — หมายถึงชัยชนะ ความสำเร็จ`);
                    }

                    if (dayZodiac === gz) { bd.zodiacGroom = 15; score += 15; reasons.push(`✅ [สมพงษ์ตรง] นักษัตรวันตรงกับเจ้าบ่าว`); }
                    else if (dayTrine === groomTrine && dayTrine >= 0) { bd.zodiacGroom = 10; score += 10; reasons.push(`✅ [ตรีโกณ] นักษัตรวันเกื้อหนุนดวงเจ้าบ่าว`); }

                    if (dayZodiac === bz) { bd.zodiacBride = 15; score += 15; reasons.push(`✅ [สมพงษ์ตรง] นักษัตรวันตรงกับเจ้าสาว`); }
                    else if (dayTrine === brideTrine && dayTrine >= 0) { bd.zodiacBride = 10; score += 10; reasons.push(`✅ [ตรีโกณ] นักษัตรวันเกื้อหนุนดวงเจ้าสาว`); }

                    if (lunarDay === 15) { bd.lunar = 10; score += 10; reasons.push(`✅ [จันทรคติ] วันเพ็ญสว่างไสวที่สุด`); }
                    else if (lunarDay >= 3 && lunarDay <= 14) { bd.lunar = 5; score += 5; reasons.push(`✅ [จันทรคติ] ตกข้างขึ้นเป็นช่วงเจริญงอกงาม`); }

                    if (score > 30) scoredDates.push({ date, score, reasons, breakdown: bd });
                }
            }

            scoredDates.sort((a, b) => b.score - a.score);
            const topDatesList: typeof scoredDates = [];
            const seenMonths = new Set<string>();
            for (const item of scoredDates) {
                const mKey = `${item.date.getFullYear()}-${item.date.getMonth()}`;
                if (!seenMonths.has(mKey) || topDatesList.length >= 2) {
                    topDatesList.push(item);
                    seenMonths.add(mKey);
                }
                if (topDatesList.length >= 3) break;
            }
            topDatesList.sort((a, b) => b.score - a.score || a.date.getTime() - b.date.getTime());

            const maxScoreVal = topDatesList.length > 0 ? topDatesList[0].score : 0;
            const formatted = topDatesList.map(item => {
                const isPerfect = item.score === maxScoreVal;
                const posReasons = item.reasons.filter(r => r.startsWith('✅'));
                const dow = item.date.getDay();
                const pred = generatePrediction(posReasons, item.score, dow);
                const cv = DAY_COLORS_VENUES[dow];

                return {
                    date: item.date,
                    rating: isPerfect ? 'perfect' : 'good',
                    description: isPerfect ? 'ผ่านเกณฑ์โหราศาสตร์ครบถ้วน เป็นฤกษ์มหามงคลลำดับที่ 1' : 'ฤกษ์ดีผ่านเกณฑ์สำคัญ สมพงษ์กับดวงชะตา',
                    reasons: posReasons,
                    score: item.score,
                    headline: pred.headline,
                    prediction: pred.detail,
                    goodColors: cv.goodColors,
                    badColor: cv.badColor,
                    venueStyle: cv.venue,
                    breakdown: item.breakdown
                } as CalculationResult;
            });

            setResults(formatted);
            setLoading(false);
        }, 1500);
    };

    const formatDate = (date: Date) => {
        const adYear = date.getFullYear();
        const dateString = date.toLocaleDateString('th-TH', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
        return `${dateString} ค.ศ. ${adYear}`;
    };

    return (
        <Paper elevation={0} sx={{
            p: { xs: 3, md: 5 }, borderRadius: 6, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)',
            backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
        }}>
            <Box textAlign="center" mb={4}>
                <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', mb: 2 }}>
                    <CalendarSearch size={40} variant="Bulk" color="#D4AF37" />
                </Box>
                <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 1, color: 'var(--foreground)' }}>
                    คำนวณฤกษ์แต่งงาน <span style={{ color: '#D4AF37' }}>เบื้องต้น</span>
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.7 }}>
                    ระบบจะคำนวณเดือนและวันมงคลสมรสที่ดีที่สุดในช่วง 1 ปีข้างหน้า อิงจากดวงสมพงษ์ของคุณทั้งสอง
                </Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <form onSubmit={calculateDates}>
                    <Stack spacing={3}>
                        {error && (
                            <Alert severity="error" sx={{ fontFamily: 'var(--font-prompt)', borderRadius: 3, mb: 1 }}>
                                {error}
                            </Alert>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                            <DatePicker
                                label="วันเกิดเจ้าบ่าว (ค.ศ. เท่านั้น)" format="DD/MM/YYYY" value={groomDate} onChange={(nV) => { setGroomDate(nV); setError(null); }}
                                slotProps={{ textField: { fullWidth: true, required: true, sx: { '& .MuiOutlinedInput-root': { fontFamily: 'var(--font-prompt)' } } } }}
                            />
                            <DatePicker
                                label="วันเกิดเจ้าสาว (ค.ศ. เท่านั้น)" format="DD/MM/YYYY" value={brideDate} onChange={(nV) => { setBrideDate(nV); setError(null); }}
                                slotProps={{ textField: { fullWidth: true, required: true, sx: { '& .MuiOutlinedInput-root': { fontFamily: 'var(--font-prompt)' } } } }}
                            />
                        </Box>
                        <Button
                            type="submit" disabled={loading || !groomDate || !brideDate} variant="contained" size="large"
                            sx={{ bgcolor: '#D4AF37', color: 'white', py: 1.5, borderRadius: '12px', fontFamily: 'var(--font-prompt)', fontWeight: 600, '&:hover': { bgcolor: '#B8860B' } }}
                        >
                            {loading ? <CircularProgress size={28} color="inherit" /> : 'คำนวณฤกษ์มงคล'}
                        </Button>
                    </Stack>
                </form>
            </LocalizationProvider>

            <Box sx={{ mt: 5, mb: 1 }}>
                <Accordion elevation={0} sx={{ bgcolor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px !important' }}>
                    <AccordionSummary expandIcon={<ArrowDown2 size={20} color="#D4AF37" />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <InfoCircle size={22} color="#D4AF37" variant="Bulk" />
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: '#D4AF37' }}>หลักโหราศาสตร์ที่เราใช้คำนวณ</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
                        <Stack spacing={2.5}>
                            {BREAKDOWN_LABELS.map((item, i) => (
                                <Box key={i}>
                                    <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>{item.icon} {i + 1}. {item.label} ({item.max} คะแนน)</Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.8 }}>อิงตามตำราโหราศาสตร์ไทยฉบับดั้งเดิมและจันทรคติ</Typography>
                                </Box>
                            ))}
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>✨ 7. สีมงคลและสถานที่จัดงาน</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.8 }}>วิเคราะห์ตามทักษาปกรณ์และพลังธาตุวันเกิด</Typography>
                            </Box>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {results && (
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 4, textAlign: 'center' }}>ผลการคำนวณฤกษ์แต่งงานของคุณ</Typography>
                    <Stack spacing={4}>
                        {results.map((result, idx) => (
                            <Box key={idx} sx={{
                                p: { xs: 3, sm: 5 }, borderRadius: 6,
                                border: idx === 0 ? '2px solid #D4AF37' : '1px solid var(--border-color)',
                                background: idx === 0 ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)' : 'rgba(255, 255, 255, 0.02)',
                                transition: 'all 0.4s ease', position: 'relative', overflow: 'hidden',
                                boxShadow: idx === 0 ? '0 24px 48px rgba(212, 175, 55, 0.15)' : '0 4px 20px rgba(0,0,0,0.03)',
                                '&:hover': { transform: 'translateY(-5px)', borderColor: '#D4AF37' }
                            }}>
                                {idx === 0 && (
                                    <Box sx={{ position: 'absolute', top: 20, right: -40, bgcolor: '#D4AF37', color: 'black', px: 6, py: 0.5, transform: 'rotate(45deg)', fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: '0.7rem' }}>
                                        BEST CHOICE
                                    </Box>
                                )}

                                <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Box sx={{ width: 64, height: 64, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: idx === 0 ? 'linear-gradient(135deg, #D4AF37, #FFD700)' : 'var(--border-color)', color: idx === 0 ? 'white' : '#D4AF37' }}>
                                            {idx === 0 ? <Heart size={32} variant="Bold" /> : <Star size={32} variant="Bulk" />}
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800 }}>{formatDate(result.date)}</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.6 }}>{result.description}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#D4AF37', letterSpacing: 1.5 }}>คะแนนมงคลสุทธิ</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 900, color: idx === 0 ? '#D4AF37' : 'inherit' }}>{result.score}</Typography>
                                            <Typography variant="h6" sx={{ opacity: 0.3 }}>/100</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                                    {/* Left: Visualization & Breakdown */}
                                    <Box sx={{ flex: { xs: '1 1 100%', lg: '7' }, width: '100%' }}>
                                        <Box sx={{ p: 3, borderRadius: 4, border: '1px solid var(--border-color)', height: '100%' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#D4AF37' }}>
                                                <Chart size={20} /> วิเคราะห์ความสมพงษ์
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                                                <Box sx={{ width: 250 }}>
                                                    <ReactApexChart
                                                        type="radar" height={250}
                                                        series={[{ name: 'คะแนน', data: Object.values(result.breakdown).map((v, i) => Math.round((v / BREAKDOWN_LABELS[i].max) * 100)) }]}
                                                        options={{
                                                            chart: { toolbar: { show: false } }, stroke: { width: 2, colors: ['#D4AF37'] }, fill: { opacity: 0.2, colors: ['#D4AF37'] },
                                                            xaxis: { categories: BREAKDOWN_LABELS.map(l => l.label), labels: { style: { colors: '#D4AF37', fontSize: '10px' } } },
                                                            yaxis: { show: false, max: 100 }, plotOptions: { radar: { polygons: { strokeColors: 'rgba(212, 175, 55, 0.1)' } } }
                                                        }}
                                                    />
                                                </Box>
                                                <Stack spacing={1} sx={{ flexGrow: 1, width: '100%' }}>
                                                    {BREAKDOWN_LABELS.map(lbl => (
                                                        <Box key={lbl.key}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{lbl.label}</Typography>
                                                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#D4AF37' }}>{result.breakdown[lbl.key]}/{lbl.max}</Typography>
                                                            </Box>
                                                            <LinearProgress variant="determinate" value={(result.breakdown[lbl.key] / lbl.max) * 100} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(212, 175, 55, 0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#D4AF37' } }} />
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Right: Prediction & Tips */}
                                    <Box sx={{ flex: { xs: '1 1 100%', lg: '5' }, width: '100%' }}>
                                        <Stack spacing={3}>
                                            <Box sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                                                <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 700, mb: 1 }}>{result.headline}</Typography>
                                                <Typography variant="body2" sx={{ lineHeight: 1.8, opacity: 0.9 }}>{result.prediction}</Typography>
                                            </Box>
                                            <Box sx={{ p: 3, borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'rgba(255,255,255,0.01)' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#D4AF37' }}>✨ เคล็ดลับจัดงาน</Typography>
                                                <Stack spacing={2}>
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, display: 'block', mb: 1 }}>ธีมสีมงคล (Auspicious Colors)</Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                                                            {result.goodColors.split(',').map((colorName, cIdx) => {
                                                                const trimmedName = colorName.trim();
                                                                const COLOR_MAP: Record<string, string> = {
                                                                    'แดง': '#FFB3BA', 'ชมพู': '#FFD1DC', 'เขียว': '#B2F2BB', 'ฟ้า': '#BAE1FF',
                                                                    'น้ำเงิน': '#AEC6CF', 'ขาว': '#FFFFFF', 'เหลือง': '#FFFFBA', 'ส้ม': '#FFD8B1',
                                                                    'ดำ': '#696969', 'เทา': '#D3D3D3', 'ม่วง': '#E0BBE4', 'บรอนซ์': '#C0C0C0', 'น้ำเงิน/ฟ้า': '#BAE1FF'
                                                                };
                                                                const colorHex = COLOR_MAP[trimmedName] || '#DDD';
                                                                return (
                                                                    <Box key={cIdx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.05)', px: 1, py: 0.5, borderRadius: 2, border: '1px solid var(--border-color)' }}>
                                                                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: colorHex, border: '1px solid rgba(0,0,0,0.1)' }} />
                                                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{trimmedName}</Typography>
                                                                    </Box>
                                                                );
                                                            })}
                                                        </Box>
                                                        <Typography variant="caption" sx={{ opacity: 0.5 }}>เลี่ยง: {result.badColor}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800, display: 'block', mb: 0.5 }}>สถานที่แนะนำ</Typography>
                                                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{result.venueStyle}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                                {result.reasons.length > 0 && (
                                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {result.reasons.map((r, i) => (
                                            <Chip key={i} label={r.replace(/✅ \[.*?\] /, '')} size="small" variant="outlined" sx={{ fontSize: '0.7rem', opacity: 0.7 }} />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Stack>
                    <Box sx={{ mt: 5, p: 3, borderRadius: 4, bgcolor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, fontSize: '0.85rem' }}>
                            <strong style={{ color: '#D4AF37' }}>📌 หมายเหตุ:</strong> การได้คะแนนเต็ม 100 นั้นเป็นไปได้ยากมากเนื่องจากต้องมีเงื่อนไขสมพงษ์ครบทุกมิติ โดยทั่วไปคะแนน 60 ขึ้นไปถือว่าเป็นฤกษ์มงคลที่ดีมากแล้วครับ
                        </Typography>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}
