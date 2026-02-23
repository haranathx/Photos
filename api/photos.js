import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default async function handler(req, res) {
  try {
    // =====================================================
    // GET ALL PHOTOS
    // =====================================================
    if (req.method === "GET") {
      const resources = await cloudinary.v2.search
        .expression("folder:gallery")
        .sort_by("created_at", "desc")
        .max_results(100)
        .execute();

      const images = resources.resources.map((img) => ({
        id: img.public_id,

        // 🔥 Unsplash Style High Quality + Metadata Removed
        url: cloudinary.v2.url(img.public_id, {
          width: 1800,
          quality: "auto:best",
          fetch_format: "auto",
          progressive: true,
          flags: "strip_profile", // remove EXIF metadata
        }),
      }));

      return res.status(200).json(images);
    }

    // =====================================================
    // METHOD NOT ALLOWED
    // =====================================================
    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}