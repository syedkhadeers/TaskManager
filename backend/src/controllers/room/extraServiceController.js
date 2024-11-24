import asyncHandler from "express-async-handler";
import ExtraServiceModel from "../../models/rooms/ExtraServiceModel.js";

export const createExtraService = asyncHandler(async (req, res) => {
  try {
    const { serviceName, description, price } = req.body;

    if (!serviceName || !description || !price) {
      return res
        .status(400)
        .json({ message: "serviceName, description, and price are required" });
    }

    const extraService = new ExtraServiceModel({
      serviceName,
      description,
      price,
    });

    await extraService.save();

    res
      .status(201)
      .json({ message: "Extra service created successfully", extraService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating extra service" });
  }
});

export const getExtraServices = asyncHandler(async (req, res) => {
  try {
    const extraServices = await ExtraServiceModel.find();
    res
      .status(200)
      .json({
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

export const updateExtraService = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description, price, isActive } = req.body;

    const extraService = await ExtraServiceModel.findById(id);

    if (!extraService) {
      return res.status(404).json({ message: "Extra service not found" });
    }

    extraService.serviceName = serviceName || extraService.serviceName;
    extraService.description = description || extraService.description;
    extraService.price = price || extraService.price;
    extraService.isActive =
      isActive !== undefined ? isActive : extraService.isActive;

    await extraService.save();

    res
      .status(200)
      .json({ message: "Extra service updated successfully", extraService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating extra service" });
  }
});

export const deleteExtraService = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const extraService = await ExtraServiceModel.findById(id);

    if (!extraService) {
      return res.status(404).json({ message: "Extra service not found" });
    }

    await ExtraServiceModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Extra service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting extra service" });
  }
});
