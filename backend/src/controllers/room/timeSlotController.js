import asyncHandler from "express-async-handler";
import TimeSlotModel from "../../models/rooms/TimeSlotModel.js";

export const createTimeSlot = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      checkInTime,
      checkOutTime,
      priceMultiplier,
      sameDay,
      isActive,
    } = req.body;

    if (!name || !checkInTime || !checkOutTime || !priceMultiplier) {
      return res
        .status(400)
        .json({
          message:
            "Name, check-in time, check-out time, and price multiplier are required",
        });
    }

    const timeSlot = new TimeSlotModel({
      name,
      checkInTime,
      checkOutTime,
      priceMultiplier,
      sameDay,
      isActive,
    });

    await timeSlot.save();

    res
      .status(201)
      .json({ message: "Time slot created successfully", timeSlot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating time slot" });
  }
});

export const getTimeSlots = asyncHandler(async (req, res) => {
  try {
    const timeSlots = await TimeSlotModel.find();
    res
      .status(200)
      .json({
        message: "Time slots fetched successfully",
        timeSlots,
        count: timeSlots.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting time slots" });
  }
});

export const getTimeSlot = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const timeSlot = await TimeSlotModel.findById(id);

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    res
      .status(200)
      .json({ message: "Time slot fetched successfully", timeSlot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting time slot" });
  }
});

export const updateTimeSlot = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      checkInTime,
      checkOutTime,
      priceMultiplier,
      sameDay,
      isActive,
    } = req.body;

    const timeSlot = await TimeSlotModel.findById(id);

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    timeSlot.name = name || timeSlot.name;
    timeSlot.checkInTime = checkInTime || timeSlot.checkInTime;
    timeSlot.checkOutTime = checkOutTime || timeSlot.checkOutTime;
    timeSlot.priceMultiplier = priceMultiplier || timeSlot.priceMultiplier;
    timeSlot.sameDay = sameDay || timeSlot.sameDay;
    timeSlot.isActive = isActive !== undefined ? isActive : timeSlot.isActive;

    await timeSlot.save();

    res
      .status(200)
      .json({ message: "Time slot updated successfully", timeSlot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating time slot" });
  }
});

export const deleteTimeSlot = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const timeSlot = await TimeSlotModel.findById(id);

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    await TimeSlotModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Time slot deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting time slot" });
  }
});
