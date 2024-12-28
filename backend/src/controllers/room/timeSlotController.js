import asyncHandler from "express-async-handler";
import TimeSlot from "../../models/rooms/TimeSlotModel.js";

export const addTimeSlot = asyncHandler(async (req, res) => {
  const { name, checkInTime, checkOutTime, sameDay, priceMultiplier } =
    req.body;

  if (!name || !checkInTime || !checkOutTime) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const timeSlotExists = await TimeSlot.findOne({ name });
  if (timeSlotExists) {
    return res.status(400).json({ message: "Time slot name already exists" });
  }

  const timeSlot = await TimeSlot.create({
    name,
    checkInTime,
    checkOutTime,
    sameDay: sameDay || "SameDay",
    priceMultiplier: priceMultiplier || 1,
  });

  res.status(201).json({
    message: "Time slot created successfully",
    timeSlot,
  });
});

export const getTimeSlotById = asyncHandler(async (req, res) => {
  const timeSlot = await TimeSlot.findById(req.params.id);

  if (!timeSlot) {
    return res.status(404).json({ message: "Time slot not found" });
  }

  res.status(200).json(timeSlot);
});

export const updateTimeSlotById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const timeSlot = await TimeSlot.findById(id);
  if (!timeSlot) {
    return res.status(404).json({ message: "Time slot not found" });
  }

  const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );

  res.status(200).json({
    message: "Time slot updated successfully",
    timeSlot: updatedTimeSlot,
  });
});

export const deleteTimeSlotById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const timeSlot = await TimeSlot.findById(id);

  if (!timeSlot) {
    return res.status(404).json({ message: "Time slot not found" });
  }

  await TimeSlot.findByIdAndDelete(id);
  res.status(200).json({ message: "Time slot deleted successfully" });
});

export const getAllTimeSlots = asyncHandler(async (req, res) => {
  const timeSlots = await TimeSlot.find();
  res.status(200).json({
    count: timeSlots.length,
    timeSlots,
  });
});

export const toggleTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const timeSlot = await TimeSlot.findById(id);

  if (!timeSlot) {
    return res.status(404).json({ message: "Time slot not found" });
  }

  timeSlot.isActive = !timeSlot.isActive;
  await timeSlot.save();

  res.status(200).json({
    message: `Time slot ${
      timeSlot.isActive ? "activated" : "deactivated"
    } successfully`,
    timeSlot,
  });
});

export default {
  addTimeSlot,
  getTimeSlotById,
  updateTimeSlotById,
  deleteTimeSlotById,
  getAllTimeSlots,
  toggleTimeSlot,
};
