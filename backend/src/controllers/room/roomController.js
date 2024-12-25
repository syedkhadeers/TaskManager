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
  const existingRoom = await RoomModel.findOne({
    roomNumber: roomNumber.trim(),
  });
  if (existingRoom) {
    return res.status(409).json({
      success: false,
      message: "Room with this number already exists",
    });
  }

  // Handle image uploads
  let images = [];
  if (req.files?.length > 0) {
    const uploadedImages = await uploadMultipleImages(req.files, "room_images");
    images = uploadedImages.map((img) => img.url);
  }

  // Parse arrays if they're strings
  const parsedAmenities =
    typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];

  const room = await RoomModel.create({
    roomNumber: roomNumber.trim(),
    roomType,
    floor: floor.trim(),
    description: description?.trim(),
    amenities: parsedAmenities,
    smokingAllowed: smokingAllowed ?? false,
    petsAllowed: petsAllowed ?? false,
    status: status || "available",
    isActive: isActive ?? true,
    images,
  });

  const populatedRoom = await RoomModel.findById(room._id).populate("roomType");

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: populatedRoom,
  });
});

// Update room with enhanced validation and image handling
export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
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
    removeImages,
  } = req.body;

  const room = await RoomModel.findById(id);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  // Check room number uniqueness if being updated
  if (roomNumber && roomNumber !== room.roomNumber) {
    const existingRoom = await RoomModel.findOne({
      roomNumber: roomNumber.trim(),
      _id: { $ne: id },
    });
    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "Room with this number already exists",
      });
    }
  }

  // Handle image updates
  let updatedImages = [...room.images];

  // Remove specified images if any
  if (removeImages) {
    const imagesToRemove =
      typeof removeImages === "string"
        ? JSON.parse(removeImages)
        : removeImages;
    updatedImages = updatedImages.filter(
      (img) => !imagesToRemove.includes(img)
    );
  }

  // Add new images if any
  if (req.files?.length > 0) {
    const newImages = await uploadMultipleImages(req.files, "room_images");
    const newImageUrls = newImages.map((img) => img.url);
    updatedImages = [...updatedImages, ...newImageUrls];
  }

  // Parse arrays if they're strings
  const parsedAmenities =
    typeof amenities === "string" ? JSON.parse(amenities) : amenities;

  const updates = {
    ...(roomNumber && { roomNumber: roomNumber.trim() }),
    ...(roomType && { roomType }),
    ...(floor && { floor: floor.trim() }),
    ...(description && { description: description.trim() }),
    ...(parsedAmenities && { amenities: parsedAmenities }),
    ...(typeof smokingAllowed !== "undefined" && { smokingAllowed }),
    ...(typeof petsAllowed !== "undefined" && { petsAllowed }),
    ...(status && { status }),
    ...(typeof isActive !== "undefined" && { isActive }),
    images: updatedImages,
  };

  const updatedRoom = await RoomModel.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("roomType");

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: updatedRoom,
  });
});

// Get all rooms with filtering and pagination
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
  } = req.query;

  const query = {};

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
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
  };

  const rooms = await RoomModel.find(query)
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit)
    .populate("roomType");

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

// Get single room
export const getRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await RoomModel.findById(id).populate("roomType");

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

// Delete room
export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await RoomModel.findById(id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  await RoomModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
    data: { id },
  });
});
