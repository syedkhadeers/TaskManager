import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
      formData
    );
    return response.data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary", error);
    throw error;
  }
};
