import asyncHandler from "express-async-handler";
import ExtraServiceModel from "../../models/rooms/ExtraServiceModel.js";
import {
  uploadImage,
  updateImage,
  deleteImage,
} from "../../helpers/imageUpload.js";

export const createExtraService = asyncHandler(async (req, res) => {
  const {
    serviceName,
    description,
    price,
    serviceType,
    additionalInfo,
    availability,
  } = req.body;

  if (!serviceName || !description || !price) {
    return res
      .status(400)
      .json({ message: "serviceName, description, and price are required" });
  }

  let image = {
    url: "",
    publicId: "",
  };

  if (req.file) {
    const uploadResult = await uploadImage(req.file, "extra_service_photos");
    image = uploadResult.url;
  }

  const extraService = await ExtraServiceModel.create({
    serviceName,
    description,
    price,
    image,
    serviceType: serviceType || "",
    additionalInfo: additionalInfo || "",
    availability: availability || true,
  });

  if (extraService) {
    res
      .status(201)
      .json({ message: "Extra service created successfully", extraService });
  } else {
    res.status(400).json({ message: "Invalid extra service data" });
  }
});

export const updateExtraService = asyncHandler(async (req, res) => {
  const extraService = await ExtraServiceModel.findById(req.params.id);

  if (!extraService) {
    return res.status(404).json({ message: "Extra service not found" });
  }

  const {
    serviceName,
    description,
    price,
    serviceType,
    additionalInfo,
    availability,
  } = req.body;

  extraService.serviceName = serviceName || extraService.serviceName;
  extraService.description = description || extraService.description;
  extraService.price = price || extraService.price;
  extraService.serviceType = serviceType || extraService.serviceType;
  extraService.additionalInfo = additionalInfo || extraService.additionalInfo;
  extraService.availability =
    availability !== undefined ? availability : extraService.availability;

  if (req.file) {
    const uploadResult = await uploadImage(req.file, "extra_service_photos");
    extraService.image = uploadResult.url;
  }

  const updated = await extraService.save();
  res
    .status(200)
    .json({
      message: "Extra service updated successfully",
      extraService: updated,
    });
});

export const deleteExtraService = asyncHandler(async (req, res) => {
  const extraService = await ExtraServiceModel.findById(req.params.id);

  if (!extraService) {
    return res.status(404).json({ message: "Extra service not found" });
  }

  if (extraService.image) {
    // Extract public ID from the image URL if needed
    const publicId = extraService.image.split("/").pop().split(".")[0];
    await deleteImage(publicId);
  }

  await ExtraServiceModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Extra service deleted successfully" });
});

export const getExtraServices = asyncHandler(async (req, res) => {
  try {
    const extraServices = await ExtraServiceModel.find();
    res.status(200).json({
      message: "Extra services fetched successfully",
      extraServices,
      count: extraServices.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting extra services" });
  }
});

export const getExtraService = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const extraService = await ExtraServiceModel.findById(id);

    if (!extraService) {
      return res.status(404).json({ message: "Extra service not found" });
    }

    res
      .status(200)
      .json({ message: "Extra service fetched successfully", extraService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting extra service" });
  }
});
