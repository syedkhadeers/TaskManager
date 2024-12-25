import asyncHandler from "express-async-handler";
import RoomTypeModel from "../../models/rooms/RoomTypeModel.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  updateMultipleImages,
} from "../../helpers/imageUpload.js";

// Create room type with enhanced validation
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

  // Enhanced validation
  const validationErrors = [];
  if (!name?.trim()) validationErrors.push("Room type name is required");
  if (!description?.trim()) validationErrors.push("Description is required");
  if (!basePrice || basePrice <= 0)
    validationErrors.push("Valid base price is required");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check for existing room type with same name
  const existingRoomType = await RoomTypeModel.findOne({ name: name.trim() });
  if (existingRoomType) {
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

  // Parse arrays if they're strings
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

// Update room type with enhanced validation and image handling
export const updateRoomType = asyncHandler(async (req, res) => {
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
    removeImages,
  } = req.body;

  // Check name uniqueness if being updated
  if (name && name !== roomType.name) {
    const existingRoomType = await RoomTypeModel.findOne({
      name: name.trim(),
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

  // Remove specified images if any
  if (removeImages) {
    const imagesToRemove =
      typeof removeImages === "string"
        ? JSON.parse(removeImages)
        : removeImages;

    const publicIdsToRemove = imagesToRemove.map((img) => img.publicId);
    await deleteMultipleImages(publicIdsToRemove);
    updatedImages = updatedImages.filter(
      (img) => !publicIdsToRemove.includes(img.publicId)
    );
  }

  // Add new images if any
  if (req.files?.length > 0) {
    const newImages = await uploadMultipleImages(req.files, "room_type_photos");
    const formattedNewImages = newImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      order: updatedImages.length + index,
    }));
    updatedImages = [...updatedImages, ...formattedNewImages];
  }

  // Parse arrays if they're strings
  const parsedTimeSlotPricing =
    typeof timeSlotPricing === "string"
      ? JSON.parse(timeSlotPricing)
      : timeSlotPricing;

  const parsedExtraServices =
    typeof extraServices === "string"
      ? JSON.parse(extraServices)
      : extraServices;

  const updates = {
    ...(name && { name: name.trim() }),
    ...(description && { description: description.trim() }),
    ...(basePrice && { basePrice }),
    ...(specialPrice && { specialPrice }),
    ...(offerPrice && { offerPrice }),
    ...(maxOccupancy && { maxOccupancy }),
    ...(parsedTimeSlotPricing && { timeSlotPricing: parsedTimeSlotPricing }),
    ...(parsedExtraServices && { extraServices: parsedExtraServices }),
    ...(typeof isActive !== "undefined" && { isActive }),
    images: updatedImages,
  };

  const updatedRoomType = await RoomTypeModel.findByIdAndUpdate(
    id,
    { $set: updates },
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


// Get all room types with filtering and pagination
export const getRoomTypes = asyncHandler(async (req, res) => {
  const { 
    isActive, 
    priceMin, 
    priceMax, 
    search,
    page = 1, 
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};
  
  if (typeof isActive !== 'undefined') {
    query.isActive = isActive === 'true';
  }
  
  if (priceMin || priceMax) {
    query.basePrice = {};
    if (priceMin) query.basePrice.$gte = Number(priceMin);
    if (priceMax) query.basePrice.$lte = Number(priceMax);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
    populate: [
      { path: 'timeSlotPricing.timeSlot' },
      { path: 'extraServices.extraServices' }
    ]
  };

  const roomTypes = await RoomTypeModel.find(query)
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit)
    .populate(options.populate);

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

// Get single room type
export const getRoomType = asyncHandler(async (req, res) => {
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

  res.status(200).json({
    success: true,
    message: "Room type fetched successfully",
    data: roomType,
  });
});

// Delete room type
export const deleteRoomType = asyncHandler(async (req, res) => {
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

  // Delete associated images from cloud storage
  if (roomType.images.length > 0) {
    const publicIds = roomType.images.map(image => image.publicId);
    await deleteMultipleImages(publicIds);
  }

  await RoomTypeModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Room type deleted successfully",
    data: { id },
  });
});

// Add Extra Service to Room Type
export const addExtraService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { extraServiceId, price } = req.body;

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  // Check if extra service already exists
  const existingService = roomType.extraServices.find(
    service => service.extraService.toString() === extraServiceId
  );

  if (existingService) {
    return res.status(400).json({
      success: false,
      message: "Extra service already added to this room type",
    });
  }

  roomType.extraServices.push({
    extraService: extraServiceId,
    price: price || 0
  });

  await roomType.save();

  const updatedRoomType = await RoomTypeModel.findById(id)
    .populate("extraServices.extraService");

  res.status(200).json({
    success: true,
    message: "Extra service added successfully",
    data: updatedRoomType,
  });
});

// Remove Extra Service from Room Type
export const removeExtraService = asyncHandler(async (req, res) => {
  const { id, extraServiceId } = req.params;

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  roomType.extraServices = roomType.extraServices.filter(
    service => service.extraService.toString() !== extraServiceId
  );

  await roomType.save();

  const updatedRoomType = await RoomTypeModel.findById(id)
    .populate("extraServices.extraService");

  res.status(200).json({
    success: true,
    message: "Extra service removed successfully",
    data: updatedRoomType,
  });
});

// Add Time Slot to Room Type
export const addTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { timeSlotId, price } = req.body;

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  // Check if time slot already exists
  const existingTimeSlot = roomType.timeSlotPricing.find(
    slot => slot.timeSlot.toString() === timeSlotId
  );

  if (existingTimeSlot) {
    return res.status(400).json({
      success: false,
      message: "Time slot already added to this room type",
    });
  }

  roomType.timeSlotPricing.push({
    timeSlot: timeSlotId,
    price: price || roomType.basePrice
  });

  await roomType.save();

  const updatedRoomType = await RoomTypeModel.findById(id)
    .populate("timeSlotPricing.timeSlot");

  res.status(200).json({
    success: true,
    message: "Time slot added successfully",
    data: updatedRoomType,
  });
});

// Remove Time Slot from Room Type
export const removeTimeSlot = asyncHandler(async (req, res) => {
  const { id, timeSlotId } = req.params;

  const roomType = await RoomTypeModel.findById(id);
  if (!roomType) {
    return res.status(404).json({
      success: false,
      message: "Room type not found",
    });
  }

  roomType.timeSlotPricing = roomType.timeSlotPricing.filter(
    slot => slot.timeSlot.toString() !== timeSlotId
  );

  await roomType.save();

  const updatedRoomType = await RoomTypeModel.findById(id)
    .populate("timeSlotPricing.timeSlot");

  res.status(200).json({
    success: true,
    message: "Time slot removed successfully",
    data: updatedRoomType,
  });
});
