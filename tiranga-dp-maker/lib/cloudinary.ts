import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
    });
}

export async function uploadDpToCloudinary(
    photoDataUrl: string | null | undefined,
    frameType: string = "circle"
): Promise<string | null> {
    if (!photoDataUrl || typeof photoDataUrl !== "string") {
        return null;
    }

    if (photoDataUrl.startsWith("http://") || photoDataUrl.startsWith("https://")) {
        return photoDataUrl;
    }

    if (photoDataUrl.startsWith("data:image/")) {
        try {
            const uploadResult = await cloudinary.uploader.upload(photoDataUrl, {
                folder: `tiranga_dp/${frameType}`,
                resource_type: "auto",
            });

            if (uploadResult && uploadResult.secure_url) {
                return uploadResult.secure_url;
            }
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
        }
    }

    return photoDataUrl;
}
