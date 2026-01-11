
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "general";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Create a safe filename
        const filename = Date.now() + "_" + file.name.replace(/\s+/g, "_");

        // Sanitize folder name (allow simple alphanumeric and hyphens/underscores)
        const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, "_").toLowerCase();

        // Define the upload directory (public/uploads/[folder])
        // using path.join ensures correct OS separators
        const relativeUploadDir = path.join("uploads", safeFolder);
        const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);

        // Return the public URL
        // Force forward slashes for URL even on Windows
        const publicUrl = `/${relativeUploadDir.replace(/\\/g, "/")}/${filename}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }

        // URL format should be like /uploads/folder/filename.ext
        // We need to resolve this to the file system path
        // Remove leading slash if present
        const relativePath = url.startsWith('/') ? url.substring(1) : url;

        // Basic security check: ensure it starts with 'uploads/'
        // Note: On windows path might use \, but URL uses /. We check URL string here.
        if (!relativePath.startsWith('uploads/')) {
            return NextResponse.json({ error: "Invalid file path (must start with uploads/)" }, { status: 400 });
        }

        const filepath = path.join(process.cwd(), "public", relativePath);

        try {
            await fs.unlink(filepath);
            return NextResponse.json({ success: true });
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                // File not found, consider it simplified success
                return NextResponse.json({ success: true, message: "File already pending or missing" });
            }
            throw error;
        }

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
