import asyncHandler from "express-async-handler";
import RoomModel from "../../models/rooms/RoomModel.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
} from "../../helpers/imageUpload.js";

// Create room with enhanced validation
export const createRoom = asyncHandler(async (req, res) => {
  const {
    roomNumber,
    roomType,
    floor,
    description,
    amenities,
    smokingAllowed,
    petsAllowed,
    status,
    isActive,
  } = req.body;

  // Enhanced validation
  const validationErrors = [];
  if (!roomNumber?.trim()) validationErrors.push("Room number is required");
  if (!roomType) validationErrors.push("Room type is required");
  if (!floor?.trim()) validationErrors.push("Floor is required");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check for existing room with same number
  const roomExists = await RoomModel.findOne({ roomNumber: roomNumber.trim() });
  if (roomExists) {
    return res.status(409).json({
      success: false,
      message: "Room with this number already exists",
    });
  }

  // Handle image uploads
  let images = [];
  if (req.files?.length > 0) {
    const uploadedImages = await uploadMultipleImages(req.files, "room_photos");
    images = uploadedImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      order: index,
    }));
  }

  // Parse arrays if they're strings
  const parsedAmenities =
    typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];

  const room = await RoomModel.create({
    roomNumber: roomNumber.trim(),
    roomType,
    floor: floor.trim(),
    description: description?.trim() || "",
    amenities: parsedAmenities,
    smokingAllowed: smokingAllowed ?? false,
    petsAllowed: petsAllowed ?? false,
    status: status || "available",
    isActive: isActive ?? true,
    images,
  });

  const populatedRoom = await RoomModel.findById(room._id).populate({
    path: "roomType",
    populate: ["timeSlotPricing.timeSlot", "extraServices.extraServices"],
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: populatedRoom,
  });
});

// Get all rooms with advanced filtering and pagination
export const getRooms = asyncHandler(async (req, res) => {
  const {
    status,
    floor,
    roomType,
    isActive,
    smokingAllowed,
    petsAllowed,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    priceMin,
    priceMax,
  } = req.query;

  const query = {};

  // Advanced filtering
  if (status) query.status = status;
  if (floor) query.floor = floor;
  if (roomType) query.roomType = roomType;
  if (typeof isActive !== "undefined") query.isActive = isActive === "true";
  if (typeof smokingAllowed !== "undefined")
    query.smokingAllowed = smokingAllowed === "true";
  if (typeof petsAllowed !== "undefined")
    query.petsAllowed = petsAllowed === "true";

  if (search) {
    query.$or = [
      { roomNumber: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { floor: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
  };

  const rooms = await RoomModel.find(query)
    .populate({
      path: "roomType",
      populate: ["timeSlotPricing.timeSlot", "extraServices.extraServices"],
    })
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  const total = await RoomModel.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Rooms fetched successfully",
    data: {
      rooms,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
      },
    },
  });
});

// Get room by ID with full population
export const getRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid room ID format",
    });
  }

  const room = await RoomModel.findById(id).populate({
    path: "roomType",
    populate: ["timeSlotPricing.timeSlot", "extraServices.extraServices"],
  });

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Room fetched successfully",
    data: room,
  });
});

// Update room with enhanced validation and image handling
export const updateRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid room ID format",
    });
  }

  const room = await RoomModel.findById(id);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  // Handle room number uniqueness
  if (updates.roomNumber && updates.roomNumber !== room.roomNumber) {
    const existingRoom = await RoomModel.findOne({
      roomNumber: updates.roomNumber.trim(),
      _id: { $ne: id },
    });
    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "Room number already in use",
      });
    }
  }

  // Handle image updates
  let updatedImages = [...room.images];
  if (updates.removeImages) {
    const imagesToRemove =
      typeof updates.removeImages === "string"
        ? JSON.parse(updates.removeImages)
        : updates.removeImages;

    const publicIdsToRemove = imagesToRemove.map((img) => img.publicId);
    await deleteMultipleImages(publicIdsToRemove);
    updatedImages = updatedImages.filter(
      (img) => !publicIdsToRemove.includes(img.publicId)
    );
  }

  if (req.files?.length > 0) {
    const newImages = await uploadMultipleImages(req.files, "room_photos");
    updatedImages = [
      ...updatedImages,
      ...newImages.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        order: updatedImages.length + index,
      })),
    ];
  }

  // Parse arrays if needed
  const parsedAmenities =
    updates.amenities &&
    (typeof updates.amenities === "string"
      ? JSON.parse(updates.amenities)
      : updates.amenities);

  const finalUpdates = {
    ...(updates.roomNumber && { roomNumber: updates.roomNumber.trim() }),
    ...(updates.roomType && { roomType: updates.roomType }),
    ...(updates.floor && { floor: updates.floor.trim() }),
    ...(updates.description && { description: updates.description.trim() }),
    ...(parsedAmenities && { amenities: parsedAmenities }),
    ...(typeof updates.smokingAllowed !== "undefined" && {
      smokingAllowed: updates.smokingAllowed,
    }),
    ...(typeof updates.petsAllowed !== "undefined" && {
      petsAllowed: updates.petsAllowed,
    }),
    ...(updates.status && { status: updates.status }),
    ...(typeof updates.isActive !== "undefined" && {
      isActive: updates.isActive,
    }),
    images: updatedImages,
  };

  const updatedRoom = await RoomModel.findByIdAndUpdate(
    id,
    { $set: finalUpdates },
    { new: true, runValidators: true }
  ).populate({
    path: "roomType",
    populate: ["timeSlotPricing.timeSlot", "extraServices.extraServices"],
  });

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: updatedRoom,
  });
});

// Delete room with cleanup
export const deleteRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid room ID format",
    });
  }

  const room = await RoomModel.findById(id);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  // Cleanup associated images
  if (room.images.length > 0) {
    await deleteMultipleImages(room.images.map((img) => img.publicId));
  }

  await RoomModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
    data: { id },
  });
});
