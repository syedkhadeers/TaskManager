import asyncHandler from "express-async-handler";
import RoomType from "../../models/rooms/RoomTypeModel.js";
import {
  uploadMultipleImages,
  updateMultipleImages,
  deleteMultipleImages,
} from "../../services/imageUpload.js";

export const addRoomType = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    basePrice,
    specialPrice,
    offerPrice,
    maxOccupancy,
    timeSlotPricing,
    extraServices,
  } = req.body;

  if (!name || !basePrice) {
    return res.status(400).json({ message: "Required fields missing" });
  }

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
    basePrice,
    specialPrice: specialPrice || basePrice,
    offerPrice: offerPrice || basePrice,
    maxOccupancy: maxOccupancy || 1,
    timeSlotPricing: timeSlotPricing || [],
    extraServices: extraServices || [],
    images: imagesData,
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
  const updateData = { ...req.body };

  const roomType = await RoomType.findById(id);
  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  if (req.files?.length > 0) {
    const existingPublicIds = roomType.images
      .map((img) => img.publicId)
      .filter((id) => id);
    if (existingPublicIds.length > 0) {
      await deleteMultipleImages(existingPublicIds);
    }

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
    { new: true }
  )
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

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

  const publicIds = roomType.images
    .map((img) => img.publicId)
    .filter((id) => id);

  if (publicIds.length > 0) {
    await deleteMultipleImages(publicIds);
  }

  await RoomType.findByIdAndDelete(id);
  res.status(200).json({ message: "Room type deleted successfully" });
});

export const addTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { timeSlotId, price, order } = req.body;

  const roomType = await RoomType.findById(id);
  if (!roomType) {
    return res.status(404).json({ message: "Room type not found" });
  }

  const timeSlotExists = roomType.timeSlotPricing.find(
    (slot) => slot.timeSlot.toString() === timeSlotId
  );

  if (timeSlotExists) {
    return res.status(400).json({ message: "Time slot already exists" });
  }

  roomType.timeSlotPricing.push({
    timeSlot: timeSlotId,
    price: price || roomType.basePrice,
    order: order || roomType.timeSlotPricing.length,
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
  const { serviceId, price, order } = req.body;

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
    price: price || roomType.basePrice,
    order: order || roomType.extraServices.length,
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
