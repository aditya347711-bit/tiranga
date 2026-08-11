import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if URL is present
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
}

/**
 * Uploads a base64 data URL photo to Cloudinary CDN and returns the secure URL.
 * Fallbacks gracefully to returning the original photo string if Cloudinary upload fails or is unconfigured.
 */
export async function uploadImageToCloudinary(
  photoDataUrl: string | null | undefined
): Promise<string | null> {
  if (!photoDataUrl || typeof photoDataUrl !== "string") {
    return null;
  }

  // If already a remote CDN URL (e.g. Cloudinary URL or http/https link), return as is
  if (photoDataUrl.startsWith("http://") || photoDataUrl.startsWith("https://")) {
    return photoDataUrl;
  }

  // If base64 image data URL
  if (photoDataUrl.startsWith("data:image/")) {
    try {
      const uploadResult = await cloudinary.uploader.upload(photoDataUrl, {
        folder: "tiranga_id_cards",
        resource_type: "auto",
      });

      if (uploadResult && uploadResult.secure_url) {
        console.log("Cloudinary image upload success:", uploadResult.secure_url);
        return uploadResult.secure_url;
      }
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to base64 photo:", error);
    }
  }

  return photoDataUrl;
}
