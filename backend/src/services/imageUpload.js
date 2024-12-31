import cloudinary from "../config/cloudinaryConfig.js";
import { format } from "date-fns";
import fs from "fs/promises";

const generateUniqueFileName = (folder) => {
  const timestamp = format(new Date(), "yyyyMMddHHmmss");
  const randomAlphabet = String.fromCharCode(
    65 + Math.floor(Math.random() * 26)
  );
  return `AD_${randomAlphabet}${timestamp}`;
};

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
    const uniqueFileName = generateUniqueFileName(folder);

    const result = await cloudinary.uploader.upload(file.path, {
      public_id: uniqueFileName,
      folder: folder,
      resource_type: "auto",
      quality: "auto:best",
      fetch_format: "auto",
    });

    console.log(`Image uploaded successfully - ID: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  } finally {
    await deleteTemporaryFile(file.path);
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    console.log(`Image deleted successfully - ID: ${publicId}`);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export const updateImage = async (file, publicId, folder = "") => {
  try {
    // Delete existing image
    await deleteImage(publicId);

    // Upload new image
    const newImage = await uploadImage(file, folder);

    console.log(`Image updated successfully - New ID: ${newImage.publicId}`);

    return newImage;
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error(`Image update failed: ${error.message}`);
  }
};


export const uploadMultipleImages = async (files, folder = "") => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    console.log(
      `Multiple images uploaded successfully - Count: ${results.length}`
    );
    return results;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error(`Multiple images upload failed: ${error.message}`);
  }
};

export const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) => deleteImage(publicId));
    const results = await Promise.all(deletePromises);

    console.log(
      `Multiple images deleted successfully - Count: ${results.length}`
    );
    return results;
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    throw new Error(`Multiple images deletion failed: ${error.message}`);
  }
};

export const updateMultipleImages = async (files, publicIds, folder = "") => {
  try {
    // Delete existing images
    await deleteMultipleImages(publicIds);

    // Upload new images
    const newImages = await uploadMultipleImages(files, folder);

    console.log(
      `Multiple images updated successfully - Count: ${newImages.length}`
    );
    return newImages;
  } catch (error) {
    console.error("Error updating multiple images:", error);
    throw new Error(`Multiple images update failed: ${error.message}`);
  }
};
