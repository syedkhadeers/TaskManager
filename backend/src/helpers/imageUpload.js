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

export const uploadMultipleImages = async (files, folder = "") => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Multiple images upload failed");
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

export const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) => deleteImage(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    throw new Error("Multiple images deletion failed");
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

export const updateMultipleImages = async (
  files,
  oldPublicIds = [],
  folder = ""
) => {
  try {
    // Delete old images if provided
    if (oldPublicIds.length > 0) {
      await deleteMultipleImages(oldPublicIds);
    }

    // Upload new images
    const newImages = await uploadMultipleImages(files, folder);
    return newImages;
  } catch (error) {
    console.error("Error updating multiple images:", error);
    throw new Error("Multiple images update failed");
  }
};


// Usage : 

// // Single image upload
// const singleImageResult = await uploadImage(fileObject, 'products');

// // Multiple images upload
// const multipleImageResults = await uploadMultipleImages([file1, file2, file3], 'products');

// // Single image delete
// await deleteImage('public_id_1');

// // Multiple images delete
// await deleteMultipleImages(['public_id_1', 'public_id_2']);

// // Single image update
// const updatedImage = await updateImage(newFile, oldPublicId, 'products');

// // Multiple images update
// const updatedImages = await updateMultipleImages(
//   [newFile1, newFile2], 
//   ['old_public_id_1', 'old_public_id_2'], 
//   'products'
// );
