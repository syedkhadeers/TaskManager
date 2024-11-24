import asyncHandler from "express-async-handler";
import RoomTypeModel from "../../models/rooms/RoomTypeModel.js";

export const createRoomType = asyncHandler(async (req, res) => {
  try {
    const { name, description, basePrice, maxOccupancy, timeSlotPricing } =
      req.body;

    if (!name || !description || !basePrice || !maxOccupancy) {
      return res
        .status(400)
        .json({
          message:
            "Name, description, base price, and max occupancy are required",
        });
    }

    const roomType = new RoomTypeModel({
      name,
      description,
      basePrice,
      maxOccupancy,
      timeSlotPricing,
    });

    await roomType.save();

    res
      .status(201)
      .json({ message: "Room type created successfully", roomType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating room type" });
  }
});

export const getRoomTypes = asyncHandler(async (req, res) => {
  try {
    const roomTypes = await RoomTypeModel.find().populate(
      "timeSlotPricing.timeSlot"
    );
    res
      .status(200)
      .json({
        message: "Room types fetched successfully",
        roomTypes,
        count: roomTypes.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting room types" });
  }
});

export const getRoomType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const roomType = await RoomTypeModel.findById(id).populate(
      "timeSlotPricing.timeSlot"
    );

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    res
      .status(200)
      .json({ message: "Room type fetched successfully", roomType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting room type" });
  }
});

export const updateRoomType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      basePrice,
      maxOccupancy,
      timeSlotPricing,
      isActive,
    } = req.body;

    const roomType = await RoomTypeModel.findById(id);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    roomType.name = name || roomType.name;
    roomType.description = description || roomType.description;
    roomType.basePrice = basePrice || roomType.basePrice;
    roomType.maxOccupancy = maxOccupancy || roomType.maxOccupancy;
    roomType.timeSlotPricing = timeSlotPricing || roomType.timeSlotPricing;
    roomType.isActive = isActive !== undefined ? isActive : roomType.isActive;

    await roomType.save();

    res
      .status(200)
      .json({ message: "Room type updated successfully", roomType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating room type" });
  }
});

export const deleteRoomType = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const roomType = await RoomTypeModel.findById(id);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    await RoomTypeModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Room type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room type" });
  }
});
