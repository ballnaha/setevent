// scripts/optimize-images.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesToOptimize = [
    { input: 'public/images/banner1-4.webp', output: 'public/images/banner1-4-mobile.webp', width: 828, quality: 70 },
    { input: 'public/images/concert.webp', output: 'public/images/concert-mobile.webp', width: 828, quality: 70 },
];

async function optimizeImages() {
    for (const img of imagesToOptimize) {
        try {
            const inputPath = path.join(process.cwd(), img.input);
            const outputPath = path.join(process.cwd(), img.output);

            await sharp(inputPath)
                .resize(img.width)
                .webp({ quality: img.quality })
                .toFile(outputPath);

            const originalSize = fs.statSync(inputPath).size;
            const newSize = fs.statSync(outputPath).size;

            console.log(`✅ ${img.input}`);
            console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
            console.log(`   Optimized: ${(newSize / 1024).toFixed(1)}KB`);
            console.log(`   Reduced: ${((1 - newSize / originalSize) * 100).toFixed(1)}%\n`);
        } catch (err) {
            console.error(`❌ Error processing ${img.input}:`, err.message);
        }
    }
}

optimizeImages();
