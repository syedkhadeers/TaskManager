import asyncHandler from "express-async-handler";
import ExtraService from "../../models/rooms/ExtraServiceModel.js";

export const addExtraService = asyncHandler(async (req, res) => {
  const {
    name, // Change this to serviceName if your model uses serviceName
    description,
    basePrice,
    specialPrice,
    offerPrice,
    icon,
    serviceType,
    additionalInfo,
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Service name is required" });
  }

  // Update this check to use the correct field name
  const serviceExists = await ExtraService.findOne({ name: name });
  if (serviceExists) {
    return res.status(400).json({ message: "Service name already exists" });
  }

  const extraService = await ExtraService.create({
    name, // Make sure this matches your model's field name
    description,
    basePrice,
    specialPrice,
    offerPrice,
    icon,
    serviceType,
    additionalInfo,
  });

  res.status(201).json({
    message: "Extra service created successfully",
    extraService,
  });
});

export const getExtraServiceById = asyncHandler(async (req, res) => {
  const extraService = await ExtraService.findById(req.params.id);

  if (!extraService) {
    return res.status(404).json({ message: "Extra service not found" });
  }

  res.status(200).json(extraService);
});

export const updateExtraServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const extraService = await ExtraService.findById(id);
  if (!extraService) {
    return res.status(404).json({ message: "Extra service not found" });
  }

  const updatedExtraService = await ExtraService.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );

  res.status(200).json({
    message: "Extra service updated successfully",
    extraService: updatedExtraService,
  });
});

export const deleteExtraServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const extraService = await ExtraService.findById(id);

  if (!extraService) {
    return res.status(404).json({ message: "Extra service not found" });
  }

  await ExtraService.findByIdAndDelete(id);
  res.status(200).json({ message: "Extra service deleted successfully" });
});

export const getAllExtraServices = asyncHandler(async (req, res) => {
  const extraServices = await ExtraService.find();
  res.status(200).json({
    count: extraServices.length,
    extraServices,
  });
});

export const toggleExtraService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Received request to toggle extra service with ID:", id);
  const extraService = await ExtraService.findById(id);

  if (!extraService) {
    return res.status(404).json({ message: "Extra service not found" });
  }

  extraService.isActive = !extraService.isActive;
  await extraService.save();

  res.status(200).json({
    message: `Extra service ${
      extraService.isActive ? "activated" : "deactivated"
    } successfully`,
    extraService,
  });
});

export default {
  addExtraService,
  getExtraServiceById,
  updateExtraServiceById,
  deleteExtraServiceById,
  getAllExtraServices,
  toggleExtraService,
};
