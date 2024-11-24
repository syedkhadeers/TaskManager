import cloudinary from "../config/cloudinaryConfig.js";
import { format } from "date-fns";
import fs from "fs/promises";

const deleteTemporaryFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Temporary file deleted: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting temporary file: ${filePath}`, error);
  }
};

export const uploadImage = async (file, folder = "") => {
  try {
    const uploadDate = format(new Date(), "yyyyMMdd_HHmmss");
    const fileName = file.originalname.split(".")[0];
    const uniqueFileName = `${fileName}_${uploadDate}`;

    const result = await cloudinary.uploader.upload(file.path, {
      public_id: uniqueFileName,
      folder: folder,
    });

    console.log(
      `Image uploaded - ID: ${result.public_id}, Name: ${result.original_filename}`
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  } finally {
    await deleteTemporaryFile(file.path);
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Image deleted - ID: ${publicId}`);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Image deletion failed");
  }
};

export const updateImage = async (file, oldPublicId, folder = "") => {
  try {
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    const newImage = await uploadImage(file, folder);
    return newImage;
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Image update failed");
  }
};
