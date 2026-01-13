import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ✅ Force check config
console.log("Cloudinary Current Config:", cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // ✅ Explicitly pass api_key here
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });

    console.log("✅ File uploaded to Cloudinary:", response.secure_url);

    fs.unlinkSync(path.resolve(localFilePath)); // delete temp file
    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(path.resolve(localFilePath));
    }
    return null;
  }
};

export { uploadOnCloudinary };
