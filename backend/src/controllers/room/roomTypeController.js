import asyncHandler from "express-async-handler";
import RoomType from "../../models/rooms/RoomTypeModel.js";
import {
  uploadMultipleImages,
  updateMultipleImages,
  deleteMultipleImages,
} from "../../services/imageUpload.js";

export const addRoomType = asyncHandler(async (req, res) => {
  console.log("Received request body in controller:", req.body);
  console.log("Base price value:", req.body.basePrice);
  console.log("Base price type:", typeof req.body.basePrice);
  console.log("Max occupancy value:", req.body.maxOccupancy);
  console.log("Max occupancy type:", typeof req.body.maxOccupancy);
  const {
    name,
    description,
    basePrice,
    specialPrice,
    offerPrice,
    maxOccupancy,
    timeSlotPricing,
    extraServices,
    isActive,
  } = req.body;
  console.log("Received Request Body:", req.body);
  // Parse JSON strings if needed
  const parsedTimeSlots =
    typeof timeSlotPricing === "string"
      ? JSON.parse(timeSlotPricing)
      : timeSlotPricing;
  const parsedExtraServices =
    typeof extraServices === "string"
      ? JSON.parse(extraServices)
      : extraServices;
  const parsedBasePrice = parseFloat(basePrice);

  console.log("Parsed Base Price:", parsedBasePrice);

  const roomTypeExists = await RoomType.findOne({ name });
  if (roomTypeExists) {
    return res.status(400).json({ message: "Room type name already exists" });
  }

  let imagesData = [];
  if (req.files?.length > 0) {
    const uploadResults = await uploadMultipleImages(
      req.files,
      "room_type_photos"
    );
    imagesData = uploadResults.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      order: index,
    }));
  }

  const roomType = await RoomType.create({
    name,
    description,
    basePrice: parsedBasePrice,
    specialPrice: specialPrice ? parseFloat(specialPrice) : undefined,
    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
    maxOccupancy: parseInt(maxOccupancy),
    timeSlotPricing: parsedTimeSlots || [],
    extraServices: parsedExtraServices || [],
    images: imagesData,
    isActive: isActive ?? true,
  });

  const populatedRoomType = await RoomType.findById(roomType._id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(201).json({
    message: "Room type created successfully",
    roomType: populatedRoomType,
  });
});

export const updateRoomType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  // Parse JSON strings if they're strings
  if (typeof updateData.extraServices === "string") {
    updateData.extraServices = JSON.parse(updateData.extraServices);
  }
  if (typeof updateData.timeSlotPricing === "string") {
    updateData.timeSlotPricing = JSON.parse(updateData.timeSlotPricing);
  }

  // Handle image uploads if present
  if (req.files?.length > 0) {
    const uploadResults = await uploadMultipleImages(
      req.files,
      "room_type_photos"
    );
    updateData.images = uploadResults.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      order: index,
    }));
  }

  const updatedRoomType = await RoomType.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  if (!updatedRoomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  res.status(200).json({
    message: "Room type updated successfully",
    roomType: updatedRoomType,
  });
});


export const getRoomType = asyncHandler(async (req, res) => {
  const roomType = await RoomType.findById(req.params.id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  res.status(200).json(roomType);
});

export const getAllRoomTypes = asyncHandler(async (req, res) => {
  const roomTypes = await RoomType.find()
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    count: roomTypes.length,
    roomTypes,
  });
});

export const deleteRoomType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const roomType = await RoomType.findById(id);

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  const publicIds = roomType.images.map((img) => img.publicId).filter(Boolean);

  if (publicIds.length > 0) {
    await deleteMultipleImages(publicIds);
  }

  await RoomType.findByIdAndDelete(id);
  res.status(200).json({ message: "Room type deleted successfully" });
});

export const addTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { timeSlot, price, order } = req.body;

  const roomType = await RoomType.findById(id);
  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  const timeSlotExists = roomType.timeSlotPricing.find(
    (slot) => slot.timeSlot.toString() === timeSlot
  );

  if (timeSlotExists) {
    return res.status(400).json({ message: "Time slot already exists" });
  }

  roomType.timeSlotPricing.push({
    timeSlot,
    price: parseFloat(price) || roomType.basePrice,
    order: parseInt(order) || roomType.timeSlotPricing.length,
  });

  await roomType.save();

  const updatedRoomType = await RoomType.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    message: "Time slot added successfully",
    roomType: updatedRoomType,
  });
});

export const removeTimeSlot = asyncHandler(async (req, res) => {
  const { id, timeSlotId } = req.params;

  const roomType = await RoomType.findById(id);
  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  roomType.timeSlotPricing = roomType.timeSlotPricing.filter(
    (slot) => slot.timeSlot.toString() !== timeSlotId
  );

  await roomType.save();

  const updatedRoomType = await RoomType.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    message: "Time slot removed successfully",
    roomType: updatedRoomType,
  });
});

export const addExtraService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { extraServices: serviceId, price, order } = req.body;

  const roomType = await RoomType.findById(id);
  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  const serviceExists = roomType.extraServices.find(
    (service) => service.extraServices.toString() === serviceId
  );

  if (serviceExists) {
    return res.status(400).json({ message: "Service already exists" });
  }

  roomType.extraServices.push({
    extraServices: serviceId,
    price: parseFloat(price) || roomType.basePrice,
    order: parseInt(order) || roomType.extraServices.length,
  });

  await roomType.save();

  const updatedRoomType = await RoomType.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    message: "Extra service added successfully",
    roomType: updatedRoomType,
  });
});

export const removeExtraService = asyncHandler(async (req, res) => {
  const { id, serviceId } = req.params;

  const roomType = await RoomType.findById(id);
  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  roomType.extraServices = roomType.extraServices.filter(
    (service) => service.extraServices.toString() !== serviceId
  );

  await roomType.save();

  const updatedRoomType = await RoomType.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    message: "Extra service removed successfully",
    roomType: updatedRoomType,
  });
});

export const toggleRoomType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const roomType = await RoomType.findById(id);

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  roomType.isActive = !roomType.isActive;
  await roomType.save();

  res.status(200).json({
    message: `Room type ${
      roomType.isActive ? "activated" : "deactivated"
    } successfully`,
    roomType,
  });
});

export default {
  addRoomType,
  updateRoomType,
  getRoomType,
  getAllRoomTypes,
  deleteRoomType,
  addTimeSlot,
  removeTimeSlot,
  addExtraService,
  removeExtraService,
  toggleRoomType,
};
