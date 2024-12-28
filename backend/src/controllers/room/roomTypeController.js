import asyncHandler from "express-async-handler";
import RoomTypeModel from "../../models/rooms/RoomTypeModel.js";
import {
  uploadMultipleImages,
  deleteMultipleImages
} from "../../helpers/imageUpload.js";

// Create new room type with enhanced validation
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
  } = req.body;

  // Enhanced validation
  const validationErrors = [];
  if (!name?.trim()) validationErrors.push("Room type name is required");
  if (!description?.trim()) validationErrors.push("Description is required");
  if (!basePrice || basePrice <= 0)
    validationErrors.push("Valid base price is required");
  if (maxOccupancy && maxOccupancy < 1)
    validationErrors.push("Maximum occupancy must be at least 1");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check for existing room type
  const roomTypeExists = await RoomTypeModel.findOne({ name: name.trim() });
  if (roomTypeExists) {
    return res.status(409).json({
      success: false,
      message: "Room type with this name already exists",
    });
  }

  // Handle image uploads
  let images = [];
  if (req.files?.length > 0) {
    const uploadedImages = await uploadMultipleImages(
      req.files,
      "room_type_photos"
    );
    images = uploadedImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      order: index,
    }));
  }

  // Parse and validate arrays
  const parsedTimeSlotPricing =
    typeof timeSlotPricing === "string"
      ? JSON.parse(timeSlotPricing)
      : timeSlotPricing || [];

  const parsedExtraServices =
    typeof extraServices === "string"
      ? JSON.parse(extraServices)
      : extraServices || [];

  const roomType = await RoomTypeModel.create({
    name: name.trim(),
    description: description.trim(),
    basePrice,
    specialPrice: specialPrice || basePrice,
    offerPrice: offerPrice || basePrice,
    maxOccupancy: maxOccupancy || 1,
    timeSlotPricing: parsedTimeSlotPricing,
    extraServices: parsedExtraServices,
    images,
    isActive: isActive ?? true,
  });

  const populatedRoomType = await RoomTypeModel.findById(roomType._id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(201).json({
    success: true,
    message: "Room type created successfully",
    data: populatedRoomType,
  });
});

// Get all room types with advanced filtering and pagination
export const getRoomTypes = asyncHandler(async (req, res) => {
  const {
    isActive,
    priceMin,
    priceMax,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  // Advanced filtering
  if (typeof isActive !== "undefined") {
    query.isActive = isActive === "true";
  }

  if (priceMin || priceMax) {
    query.basePrice = {};
    if (priceMin) query.basePrice.$gte = Number(priceMin);
    if (priceMax) query.basePrice.$lte = Number(priceMax);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
  };

  const roomTypes = await RoomTypeModel.find(query)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices")
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  const total = await RoomTypeModel.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Room types fetched successfully",
    data: {
      roomTypes,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
      },
    },
  });
});

// Get room type by ID with full population
export const getRoomTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid room type ID format",
    });
  }

  const roomType = await RoomTypeModel.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  res.status(200).json(roomType);
});

export const getAllRoomTypes = asyncHandler(async (req, res) => {
  const roomTypes = await RoomType.find()
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    success: true,
    message: "Room type fetched successfully",
    data: roomType,
  });
});

// Update room type with enhanced validation and image handling
export const updateRoomTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid room type ID format",
    });
  }

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  // Handle name uniqueness
  if (updates.name && updates.name !== roomType.name) {
    const existingRoomType = await RoomTypeModel.findOne({
      name: updates.name.trim(),
      _id: { $ne: id },
    });
    if (existingRoomType) {
      return res.status(409).json({
        success: false,
        message: "Room type with this name already exists",
      });
    }
  }

  // Handle image updates
  let updatedImages = [...roomType.images];
  if (updates.removeImages) {
    const imagesToRemove = typeof updates.removeImages === "string"
      ? JSON.parse(updates.removeImages)
      : updates.removeImages;

    const publicIdsToRemove = imagesToRemove.map((img) => img.publicId);
    await deleteMultipleImages(publicIdsToRemove);
    updatedImages = updatedImages.filter(
      (img) => !publicIdsToRemove.includes(img.publicId)
    );
  }

  if (req.files?.length > 0) {
    const newImages = await uploadMultipleImages(req.files, "room_type_photos");
    updatedImages = [
      ...updatedImages,
      ...newImages.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        order: updatedImages.length + index,
      })),
    ];
  }

  // Prepare updates object
  const finalUpdates = {
    ...(updates.name && { name: updates.name.trim() }),
    ...(updates.description && { description: updates.description.trim() }),
    ...(updates.basePrice && { basePrice: updates.basePrice }),
    ...(updates.specialPrice && { specialPrice: updates.specialPrice }),
    ...(updates.offerPrice && { offerPrice: updates.offerPrice }),
    ...(updates.maxOccupancy && { maxOccupancy: updates.maxOccupancy }),
    ...(typeof updates.isActive !== "undefined" && { isActive: updates.isActive }),
    images: updatedImages,
  };

  // Handle arrays
  if (updates.timeSlotPricing) {
    finalUpdates.timeSlotPricing = typeof updates.timeSlotPricing === "string"
      ? JSON.parse(updates.timeSlotPricing)
      : updates.timeSlotPricing;
  }

  if (updates.extraServices) {
    finalUpdates.extraServices = typeof updates.extraServices === "string"
      ? JSON.parse(updates.extraServices)
      : updates.extraServices;
  }

  const updatedRoomType = await RoomTypeModel.findByIdAndUpdate(
    id,
    { $set: finalUpdates },
    { new: true, runValidators: true }
  )
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    success: true,
    message: "Room type updated successfully",
    data: updatedRoomType,
  });
});

// Delete room type with cleanup
export const deleteRoomTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid room type ID format",
    });
  }

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  // Cleanup associated images
  if (roomType.images.length > 0) {
    await deleteMultipleImages(roomType.images.map(img => img.publicId));
  }

  await RoomTypeModel.findByIdAndDelete(id);

  const updatedRoomType = await RoomType.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    success: true,
    message: "Room type deleted successfully",
    data: { id },
  });
});

// Manage time slots and extra services
export const manageTimeSlot = asyncHandler(async (req, res) => {
  const { id, timeSlotId } = req.params;
  const { action, price } = req.body;

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  if (action === "add") {
    if (roomType.timeSlotPricing.some(slot => slot.timeSlot.toString() === timeSlotId)) {
      return res.status(400).json({
        success: false,
        message: "Time slot already exists for this room type",
      });
    }
    roomType.timeSlotPricing.push({
      timeSlot: timeSlotId,
      price: price || roomType.basePrice,
    });
  } else if (action === "remove") {
    roomType.timeSlotPricing = roomType.timeSlotPricing.filter(
      slot => slot.timeSlot.toString() !== timeSlotId
    );
  }

  await roomType.save();
  const updatedRoomType = await RoomTypeModel.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    success: true,
    message: `Time slot ${action}ed successfully`,
    data: updatedRoomType,
  });
});

export const manageExtraService = asyncHandler(async (req, res) => {
  const { id, serviceId } = req.params;
  const { action, price } = req.body;

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  if (action === "add") {
    if (roomType.extraServices.some(service => service.extraServices.toString() === serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Service already exists for this room type",
      });
    }
    roomType.extraServices.push({
      extraServices: serviceId,
      price: price || 0,
    });
  } else if (action === "remove") {
    roomType.extraServices = roomType.extraServices.filter(
      service => service.extraServices.toString() !== serviceId
    );
  }

  await roomType.save();
  const updatedRoomType = await RoomTypeModel.findById(id)
    .populate("timeSlotPricing.timeSlot")
    .populate("extraServices.extraServices");

  res.status(200).json({
    success: true,
    message: `Extra service ${action}ed successfully`,
    data: updatedRoomType,
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
