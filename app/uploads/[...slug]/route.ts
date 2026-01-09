
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string[] }> }
) {
    try {
        const { slug } = await context.params;

        // Construct the file path securely
        // slug is an array of path segments, e.g. ['eventId', 'filename.jpg']
        // We join them to ensure cross-platform compatibility
        const relativePath = slug.join(path.sep);
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, relativePath);

        // Security Check: Ensure the resolved path is still within public/uploads
        // This prevents directory traversal attacks like ../../etc/passwd
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        if (!fs.existsSync(resolvedPath)) {
            return new NextResponse('File not found', { status: 404 });
        }

        const stats = fs.statSync(resolvedPath);
        if (!stats.isFile()) {
            return new NextResponse('Not a file', { status: 400 });
        }

        const fileBuffer = fs.readFileSync(resolvedPath);
        const ext = path.extname(resolvedPath).toLowerCase();

        // Determine Content-Type
        let contentType = 'application/octet-stream';
        switch (ext) {
            // Images
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            case '.heic':
            case '.heif':
                contentType = 'image/heic';
                break;
            // Documents
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.doc':
                contentType = 'application/msword';
                break;
            case '.docx':
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case '.xls':
                contentType = 'application/vnd.ms-excel';
                break;
            case '.xlsx':
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
        }

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error('Error serving static file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
