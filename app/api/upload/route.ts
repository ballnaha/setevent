
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "general";
        const useWatermark = formData.get("watermark") === "true";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const isGif = file.type === "image/gif";
        const fileSizeInMB = file.size / (1024 * 1024);

        // 🚀 ULTRA FAST PATH: Bypass EVERYTHING for small GIFs (< 2MB)
        if (isGif && fileSizeInMB < 2) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, "_").toLowerCase();
            const relativeUploadDir = path.join("uploads", safeFolder);
            const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);

            try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }

            const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
            const filepath = path.join(uploadDir, filename);
            await fs.writeFile(filepath, buffer);

            return NextResponse.json({
                url: `/${relativeUploadDir.replace(/\\/g, "/")}/${filename}`
            });
        }

        let buffer: Buffer = Buffer.from(await file.arrayBuffer());

        // Resize logic using sharp
        let isWebP = false;

        if (file.type.startsWith("image/")) {
            try {
                // 1. First resize the image (1920px max for faster loading but clear quality)
                // For GIF: use animated: true to preserve animation frames
                let pipeline = sharp(buffer, { animated: isGif })
                    .resize(1920, 1920, {
                        fit: 'inside',
                        withoutEnlargement: true
                    });

                // Get intermediate buffer to calculate dimensions for watermark
                let intermediateBuffer = await pipeline.toBuffer();

                // 2. Apply Watermark if explicitly requested
                if (useWatermark) {
                    try {
                        const metadata = await sharp(intermediateBuffer).metadata();
                        const width = metadata.width || 1000;
                        const height = metadata.height || 1000;

                        const watermarkPath = path.join(process.cwd(), "public", "images", "logo_white.png");

                        // Check if watermark exists
                        await fs.access(watermarkPath);

                        // Resize watermark to 7.5% of image width (Reduced for a smaller logo)
                        const wmWidth = Math.max(Math.round(width * 0.075), 60);

                        const watermarkBuffer = await sharp(watermarkPath)
                            .resize(wmWidth)
                            .toBuffer();

                        const wmMetadata = await sharp(watermarkBuffer).metadata();
                        const wmHeight = wmMetadata.height || 40;

                        // Calculate position (bottom-right with padding)
                        const paddingX = Math.round(width * 0.06); // 6% padding from right - moves watermark to the left
                        const paddingY = Math.round(width * 0.03); // 3% padding from bottom

                        // Create website text watermark using SVG with Cinzel font and wide spacing
                        const rawText = "SETEVENTTHAILAND.COM";
                        const websiteText = rawText.split('').join(' '); // Add space between every letter

                        const fontSize = Math.max(Math.round(width * 0.009), 10); // Reduced font size
                        // Give plenty of width for the SVG so text doesn't clip
                        const textWidth = Math.round(fontSize * websiteText.length * 0.8);
                        const textHeight = Math.round(fontSize * 1.5);

                        const textSvg = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}">
                                <text 
                                    x="100%" 
                                    y="${fontSize}" 
                                    text-anchor="end"
                                    font-family="Cinzel, serif" 
                                    font-size="${fontSize}" 
                                    font-weight="400" 
                                    fill="white" 
                                    opacity="0.9"
                                >${websiteText}</text>
                            </svg>`;

                        const textBuffer = await sharp(Buffer.from(textSvg))
                            .png()
                            .toBuffer();

                        // Text position (bottom right)
                        const textLeft = width - textWidth - paddingX;
                        const textTop = height - textHeight - paddingY;

                        // Logo position (above text, right aligned too)
                        const logoLeft = width - wmWidth - paddingX;
                        const logoTop = textTop - wmHeight - Math.round(paddingY * 0.3);

                        // Apply both watermarks
                        intermediateBuffer = await sharp(intermediateBuffer)
                            .composite([
                                {
                                    input: watermarkBuffer,
                                    top: Math.max(0, logoTop),
                                    left: Math.max(0, logoLeft),
                                    blend: 'over'
                                },
                                {
                                    input: textBuffer,
                                    top: Math.max(0, textTop),
                                    left: Math.max(0, textLeft),
                                    blend: 'over'
                                }
                            ])
                            .toBuffer();

                    } catch (wmError) {
                        console.error("Watermarking failed, proceeding with original:", wmError);
                        // If watermark fails, we just continue with intermediateBuffer (the resized image)
                    }
                }

                // 3. Final format conversion
                // For GIF: skip processing if file is already small (< 2MB) to save CPU time
                if (isGif) {
                    const fileSizeInMB = file.size / (1024 * 1024);
                    if (fileSizeInMB < 2) {
                        // Skip sharp processing for small GIFs - just use original buffer
                        buffer = Buffer.from(await file.arrayBuffer());
                    } else {
                        // Only process large GIFs
                        buffer = await pipeline.gif().toBuffer();
                    }
                    isWebP = false;
                } else {
                    // Fix: Use intermediateBuffer which contains the applied watermark
                    buffer = await sharp(intermediateBuffer).webp({ quality: 90 }).toBuffer();
                    isWebP = true;
                }
            } catch (err) {
                console.error("Image processing error:", err);
                // Continue with original buffer if processing fails
                buffer = Buffer.from(await file.arrayBuffer());
            }
        }

        // Create a safe filename
        let filename = Date.now() + "_" + file.name.replace(/\s+/g, "_");

        // If converted to WebP, change extension
        if (isWebP) {
            filename = filename.replace(/\.[^/.]+$/, "") + ".webp";
        }

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
