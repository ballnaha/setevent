
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const eventId = formData.get('eventId') as string || 'General';
        const type = formData.get('type') as string || 'image'; // 'image' or 'file'

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate File Size (Max 15MB)
        const MAX_SIZE = 15 * 1024 * 1024; // 15MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File size too large (Max 15MB)' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate clean filename
        // Allow dots for internal extensions, remove other bad chars
        const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const nameWithoutExt = path.parse(originalName).name;

        // Base Upload Directory
        const baseDir = path.join(process.cwd(), 'public/uploads');
        // Specific Folder for this event
        const targetDir = path.join(baseDir, eventId);

        // Ensure directory exists
        await mkdir(targetDir, { recursive: true });

        // Generate Filename
        const timestamp = Date.now();

        if (type === 'image') {
            // Validate allowed image types
            const ext = path.extname(file.name).toLowerCase();
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
            if (!allowedImageExtensions.includes(ext)) {
                return NextResponse.json({
                    error: `ไฟล์นามสกุล ${ext} ไม่รองรับ (รองรับเฉพาะรูปภาพ JPG, PNG, GIF, WebP)`
                }, { status: 400 });
            }

            const filename = `${timestamp}-${nameWithoutExt}.jpg`;
            const filePath = path.join(targetDir, filename);

            // Resize and Optimize Image (Main)
            await sharp(buffer)
                .resize(1024, 1024, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80, mozjpeg: true })
                .toFile(filePath);

            // Generate Thumbnail (Preview)
            const thumbFilename = `${timestamp}-${nameWithoutExt}_thumb.jpg`;
            const thumbPath = path.join(targetDir, thumbFilename);

            await sharp(buffer)
                .resize(240, 240, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80, mozjpeg: true })
                .toFile(thumbPath);

            const fileUrl = `/uploads/${eventId}/${filename}`;
            return NextResponse.json({ url: fileUrl, success: true, type: 'image' });

        } else {
            // Generic File Upload
            // Use original extension for files
            const ext = path.extname(file.name).toLowerCase();

            // Validate allowed file types
            const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
            if (!allowedExtensions.includes(ext)) {
                return NextResponse.json({
                    error: `ไฟล์นามสกุล ${ext} ไม่รองรับ (รองรับเฉพาะ PDF, Word, Excel)`
                }, { status: 400 });
            }

            const safeName = nameWithoutExt + ext;
            const filename = `${timestamp}-${safeName}`;
            const filePath = path.join(targetDir, filename);

            await writeFile(filePath, buffer);

            const fileUrl = `/uploads/${eventId}/${filename}`;
            return NextResponse.json({
                url: fileUrl,
                success: true,
                type: 'file',
                originalName: file.name,
                size: file.size
            });
        }
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
