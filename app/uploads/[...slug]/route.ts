import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    try {
        const { slug } = await params;

        if (!slug || slug.length === 0) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        // Construct path check for multiple possible directories
        // to handle dev, standard prod, standalone prod, etc.
        const possiblePaths = [
            path.join(process.cwd(), "public", "uploads", ...slug),
            path.join(process.cwd(), "uploads", ...slug),
        ];

        let fileBuffer: Buffer | null = null;
        let resolvedPath: string | null = null;

        for (const p of possiblePaths) {
            try {
                // Check if file is readable
                await fs.access(p, fs.constants.R_OK);
                fileBuffer = await fs.readFile(p);
                resolvedPath = p;
                break;
            } catch {
                // Continue checking next path
            }
        }

        if (!fileBuffer || !resolvedPath) {
            console.error(`Uploads route: File not found for slug: ${slug.join("/")}`);
            return new NextResponse("File not found", { status: 404 });
        }

        // Determine the content-type from file extension
        const ext = path.extname(resolvedPath).toLowerCase();
        let contentType = "application/octet-stream";
        
        switch (ext) {
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".gif":
                contentType = "image/gif";
                break;
            case ".webp":
                contentType = "image/webp";
                break;
            case ".svg":
                contentType = "image/svg+xml";
                break;
            case ".avif":
                contentType = "image/avif";
                break;
            case ".ico":
                contentType = "image/x-icon";
                break;
            case ".pdf":
                contentType = "application/pdf";
                break;
            case ".doc":
            case ".docx":
                contentType = "application/msword";
                break;
            case ".xls":
            case ".xlsx":
                contentType = "application/vnd.ms-excel";
                break;
            case ".mp4":
                contentType = "video/mp4";
                break;
            case ".webm":
                contentType = "video/webm";
                break;
        }

        // Return the file buffer with content type and client caching instructions
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error serving uploaded file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
