
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
                // 1. First resize the image (1200px max for faster loading)
                // For GIF: use animated: true to preserve animation frames
                let pipeline = sharp(buffer, { animated: isGif })
                    .resize(1200, 1200, {
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

                        // Resize watermark to 10% of image width (Reduced from 15%)
                        const wmWidth = Math.max(Math.round(width * 0.10), 80);

                        const watermarkBuffer = await sharp(watermarkPath)
                            .resize(wmWidth)
                            .toBuffer();

                        const wmMetadata = await sharp(watermarkBuffer).metadata();
                        const wmHeight = wmMetadata.height || 40;

                        // Calculate position (bottom-right with padding)
                        const padding = Math.round(width * 0.02); // 2% padding

                        // Create website text watermark using SVG with Cinzel font and wide spacing
                        const rawText = "SETEVENTTHAILAND.COM";
                        const websiteText = rawText.split('').join(' '); // Add space between every letter

                        const fontSize = Math.max(Math.round(width * 0.012), 11); // Reduced from 0.018
                        // Increase width calculation to account for extra spaces and Cinzel's width
                        const textWidth = Math.round(fontSize * websiteText.length * 0.55);
                        const textHeight = Math.round(fontSize * 1.5);

                        const textSvg = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}">
                                <text 
                                    x="50%" 
                                    y="${fontSize}" 
                                    text-anchor="middle"
                                    font-family="Cinzel, serif" 
                                    font-size="${fontSize}" 
                                    font-weight="400" 
                                    fill="white" 
                                    opacity="1"
                                >${websiteText}</text>
                            </svg>`;

                        const textBuffer = await sharp(Buffer.from(textSvg))
                            .png()
                            .toBuffer();

                        // Position for logo (above text)
                        const logoLeft = width - wmWidth - padding;
                        const textTop = height - textHeight - padding;
                        const logoTop = textTop - wmHeight - Math.round(padding * 0.3);

                        // Position for text (below logo, right aligned)
                        const textLeft = width - textWidth - padding;

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
                    buffer = await intermediateBuffer;
                    // Note: intermediateBuffer already contains the WebP converted data from pipeline.webp() 
                    // Wait, let's fix the logic to be more efficient
                    buffer = await pipeline.webp({ quality: 80 }).toBuffer();
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
