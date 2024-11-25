import asyncHandler from "express-async-handler";
import RoomModel from "../../models/rooms/RoomModel.js";
import { uploadImage, deleteImage, } from "../../helpers/imageUpload.js";

export const createRoom = asyncHandler(async (req, res) => {
  try {
    const {
      roomNumber,
      roomType,
      floor,
      description,
      allowedPeople,
      amenities,
      smokingAllowed,
      petsAllowed,
    } = req.body;

    if (!roomNumber || !roomType || !floor ) {
      return res.status(400).json({
        message:
          "Room number, room type,and floor are required",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadImage(file, "room_images");
        images.push(result.url);
      }
    }

    const room = new RoomModel({
      roomNumber,
      roomType,
      floor,
      description,
      allowedPeople,
      amenities,
      smokingAllowed,
      petsAllowed,
      images,
    });

    await room.save();

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating room" });
  }
});

export const getRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await RoomModel.find().populate("roomType");
    res
      .status(200)
      .json({
        message: "Rooms fetched successfully",
        rooms,
        count: rooms.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting rooms" });
  }
});

export const getRoom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id).populate("roomType");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room fetched successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting room" });
  }
});

export const updateRoom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      roomNumber,
      roomType,
      floor,
      description,
      allowedPeople,
      amenities,
      smokingAllowed,
      petsAllowed,
      status,
    } = req.body;

    const room = await RoomModel.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.roomNumber = roomNumber || room.roomNumber;
    room.roomType = roomType || room.roomType;
    room.floor = floor || room.floor;
    room.description = description || room.description;
    room.allowedPeople = allowedPeople || room.allowedPeople;
    room.amenities = amenities || room.amenities;
    room.smokingAllowed =
      smokingAllowed !== undefined ? smokingAllowed : room.smokingAllowed;
    room.petsAllowed =
      petsAllowed !== undefined ? petsAllowed : room.petsAllowed;
    room.status = status || room.status;

    if (req.files && req.files.length > 0) {
      // Delete existing images
      for (const imageUrl of room.images) {
        await deleteImage(imageUrl);
      }

      // Upload new images
      const newImages = [];
      for (const file of req.files) {
        const result = await uploadImage(file, "room_images");
        newImages.push(result.url);
      }
      room.images = newImages;
    }

    await room.save();

    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating room" });
  }
});

export const deleteRoom = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Delete room images
    for (const imageUrl of room.images) {
      await deleteImage(imageUrl);
    }

    await RoomModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room" });
  }
});
