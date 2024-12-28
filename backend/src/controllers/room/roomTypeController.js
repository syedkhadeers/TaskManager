import asyncHandler from "express-async-handler";
import RoomTypeModel from "../../models/rooms/RoomTypeModel.js";
import { uploadImage, deleteImage } from "../../helpers/imageUpload.js";

export const createRoomType = asyncHandler(async (req, res) => {
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

  if (!name || !description || !basePrice) {
    return res.status(400).json({
      message: "Name, description, and base price are required",
    });
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadImage(file, "room_type_photos")
    );
    const uploadResults = await Promise.all(uploadPromises);
    images = uploadResults.map((result) => result.url);
  }

  // Parse timeSlotPricing if it's a string
  const parsedTimeSlotPricing =
    typeof timeSlotPricing === "string"
      ? JSON.parse(timeSlotPricing)
      : timeSlotPricing || [];

  // Parse extraServices if it's a string
  const parsedExtraServices =
    typeof extraServices === "string"
      ? JSON.parse(extraServices)
      : extraServices || [];

  const roomType = await RoomTypeModel.create({
    name,
    description,
    basePrice,
    specialPrice: specialPrice || basePrice,
    offerPrice: offerPrice || basePrice,
    maxOccupancy,
    timeSlotPricing: parsedTimeSlotPricing,
    extraServices: parsedExtraServices,
    images,
    isActive: isActive !== undefined ? isActive : true,
  });

  if (roomType) {
    res.status(201).json({
      message: "Room type created successfully",
      roomType,
    });
  } else {
    res.status(400).json({ message: "Invalid room type data" });
  }
});

export const updateRoomType = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id);

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

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

  // Parse JSON strings
  const parsedTimeSlotPricing =
    typeof timeSlotPricing === "string"
      ? JSON.parse(timeSlotPricing)
      : timeSlotPricing;

  const parsedExtraServices =
    typeof extraServices === "string"
      ? JSON.parse(extraServices)
      : extraServices;

  // Update fields using nullish coalescing
  roomType.name = name ?? roomType.name;
  roomType.description = description ?? roomType.description;
  roomType.basePrice = basePrice ?? roomType.basePrice;
  roomType.specialPrice = specialPrice ?? roomType.specialPrice;
  roomType.offerPrice = offerPrice ?? roomType.offerPrice;
  roomType.maxOccupancy = maxOccupancy ?? roomType.maxOccupancy;
  roomType.timeSlotPricing = parsedTimeSlotPricing ?? roomType.timeSlotPricing;
  roomType.extraServices = parsedExtraServices ?? roomType.extraServices;
  roomType.isActive = isActive ?? roomType.isActive;

  // Handle image updates
  if (req.files && req.files.length > 0) {
    // Delete existing images
    if (roomType.images.length > 0) {
      const deletePromises = roomType.images.map(async (imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      });
      await Promise.all(deletePromises);
    }

    // Upload new images
    const uploadPromises = req.files.map((file) =>
      uploadImage(file, "room_type_photos")
    );
    const uploadResults = await Promise.all(uploadPromises);
    roomType.images = uploadResults.map((result) => result.url);
  }

  // Save and populate the response
  const updated = await roomType.save();
  const populatedRoomType = await RoomTypeModel.findById(updated._id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices");

  res.status(200).json({
    message: "Room type updated successfully",
    roomType: populatedRoomType,
  });
});


export const getRoomTypes = asyncHandler(async (req, res) => {
  const roomTypes = await RoomTypeModel.find()
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices");

  res.status(200).json({
    message: "Room types fetched successfully",
    roomTypes,
    count: roomTypes.length,
  });
});

export const getRoomType = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices");

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  res.status(200).json({
    message: "Room type fetched successfully",
    roomType,
  });
});

export const deleteRoomType = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id);

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  // Delete associated images
  if (roomType.images.length > 0) {
    const deletePromises = roomType.images.map(async (imageUrl) => {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await deleteImage(publicId);
    });
    await Promise.all(deletePromises);
  }

  await RoomTypeModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Room type deleted successfully" });
});

export const addExtraService = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id);
  const { extraServiceId } = req.body;

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  if (!roomType.extraServices.includes(extraServiceId)) {
    roomType.extraServices.push(extraServiceId);
    await roomType.save();
  }

  res.status(200).json({
    message: "Extra service added successfully",
    roomType,
  });
});

export const removeExtraService = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id);
  const { extraServiceId } = req.params;

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  roomType.extraServices = roomType.extraServices.filter(
    (service) => service.toString() !== extraServiceId
  );
  await roomType.save();

  res.status(200).json({
    message: "Extra service removed successfully",
    roomType,
  });
});

export const addTimeSlot = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id);
  const { timeSlotId, price } = req.body;

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  const timeSlotExists = roomType.timeSlotPricing.find(
    slot => slot.timeSlot.toString() === timeSlotId
  );

  if (!timeSlotExists) {
    roomType.timeSlotPricing.push({
      timeSlot: timeSlotId,
      price: price || roomType.basePrice
    });
    await roomType.save();
  }

  const updatedRoomType = await RoomTypeModel.findById(req.params.id)
    .populate("timeSlotPricing.timeSlot");

  res.status(200).json({
    message: "Time slot added successfully",
    roomType: updatedRoomType
  });
});

export const removeTimeSlot = asyncHandler(async (req, res) => {
  const roomType = await RoomTypeModel.findById(req.params.id);
  const { timeSlotId } = req.params;

  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  roomType.timeSlotPricing = roomType.timeSlotPricing.filter(
    slot => slot.timeSlot.toString() !== timeSlotId
  );
  
  await roomType.save();

  const updatedRoomType = await RoomTypeModel.findById(req.params.id)
    .populate("timeSlotPricing.timeSlot");

  res.status(200).json({
    message: "Time slot removed successfully",
    roomType: updatedRoomType
  });
});
