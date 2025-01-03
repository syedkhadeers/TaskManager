import asyncHandler from "express-async-handler";
import Room from "../../models/rooms/RoomModel.js";
import RoomType from "../../models/rooms/RoomTypeModel.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
} from "../../services/imageUpload.js";

export const addRoom = asyncHandler(async (req, res) => {
  console.log("Received request body in controller:", req.body);
  const {
    roomNumber,
    roomType,
    status,
    floor,
    description,
    amenities,
    smokingAllowed,
    petsAllowed,
    isActive,
  } = req.body;

  const parsedAmenities =
    typeof amenities === "string" ? JSON.parse(amenities) : amenities || [];

  const roomExists = await Room.findOne({ roomNumber });
  if (roomExists) {
    return res.status(400).json({ message: "Room number already exists" });
  }

  const roomTypeExists = await RoomType.findById(roomType);
  if (!roomTypeExists) {
    return res.status(400).json({ message: "Room type not found" });
  }

  let imagesData = [];
  if (req.files?.length > 0) {
    const uploadResults = await uploadMultipleImages(req.files, "room_photos");
    imagesData = uploadResults.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      order: index,
    }));
  }

  const room = await Room.create({
    roomNumber,
    roomType,
    status: status || "available",
    floor,
    description,
    amenities: parsedAmenities,
    smokingAllowed: Boolean(smokingAllowed),
    petsAllowed: Boolean(petsAllowed),
    images: imagesData,
    isActive: isActive ?? true,
  });

  const populatedRoom = await Room.findById(room._id).populate("roomType");

  res.status(201).json({
    message: "Room created successfully",
    room: populatedRoom,
  });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  if (typeof updateData.amenities === "string") {
    updateData.amenities = JSON.parse(updateData.amenities);
  }

  const room = await Room.findById(id);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  if (updateData.roomType) {
    const roomTypeExists = await RoomType.findById(updateData.roomType);
    if (!roomTypeExists) {
      return res.status(400).json({ message: "Room type not found" });
    }
  }

  if (req.files?.length > 0) {
    const uploadResults = await uploadMultipleImages(req.files, "room_photos");
    updateData.images = uploadResults.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      order: index,
    }));
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  ).populate("roomType");

  res.status(200).json({
    message: "Room updated successfully",
    room: updatedRoom,
  });
});

export const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("roomType");
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  res.status(200).json(room);
});

export const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate("roomType");
  res.status(200).json({
    count: rooms.length,
    rooms,
  });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const publicIds = room.images.map((img) => img.publicId).filter(Boolean);
  if (publicIds.length > 0) {
    await deleteMultipleImages(publicIds);
  }

  await Room.findByIdAndDelete(id);
  res.status(200).json({ message: "Room deleted successfully" });
});

export const toggleRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  room.isActive = !room.isActive;
  await room.save();

  res.status(200).json({
    message: `Room ${room.isActive ? "activated" : "deactivated"} successfully`,
    room,
  });
});

export const updateRoomStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["available", "occupied", "maintenance", "reserved"].includes(status)) {
    return res.status(404).json({ message: "Invalid room status" });
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("roomType");

  if (!updatedRoom) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.status(200).json({
    message: `Room status updated to ${status} successfully`,
    room: updatedRoom,
  });
});

export default {
  addRoom,
  updateRoom,
  getRoom,
  getAllRooms,
  deleteRoom,
  toggleRoom,
  updateRoomStatus,
};
