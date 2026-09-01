import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "c0sydm1p",
  api_key: process.env.CLOUDINARY_API_KEY || "969396882978217",
  api_secret: process.env.CLOUDINARY_API_SECRET || "8ouCu0IpD0pUxAYgGBBHsUL6ft8",
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const isPdf = file.name.endsWith(".pdf") || mimeType.includes("pdf");
    const resourceType = isPdf ? "raw" : "auto";

    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: `portfolio_${folder}`,
      resource_type: resourceType,
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Cloudinary upload route error:", err);
    return NextResponse.json({ error: msg || "Failed to upload file to Cloudinary." }, { status: 500 });
  }
}
