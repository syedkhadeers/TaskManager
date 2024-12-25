import asyncHandler from "express-async-handler";
import TimeSlotModel from "../../models/rooms/TimeSlotModel.js";

// Create time slot with enhanced validation
export const createTimeSlot = asyncHandler(async (req, res) => {
  const {
    name,
    checkInTime,
    checkOutTime,
    priceMultiplier,
    sameDay,
    isActive,
  } = req.body;

  // Enhanced validation
  const validationErrors = [];
  if (!name?.trim()) validationErrors.push("Name is required");
  if (!checkInTime?.trim()) validationErrors.push("Check-in time is required");
  if (!checkOutTime?.trim())
    validationErrors.push("Check-out time is required");
  if (!priceMultiplier || priceMultiplier <= 0)
    validationErrors.push("Valid price multiplier is required");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check for existing time slot with same name
  const existingTimeSlot = await TimeSlotModel.findOne({ name });
  if (existingTimeSlot) {
    return res.status(409).json({
      success: false,
      message: "Time slot with this name already exists",
    });
  }

  const timeSlot = await TimeSlotModel.create({
    name: name.trim(),
    checkInTime: checkInTime.trim(),
    checkOutTime: checkOutTime.trim(),
    priceMultiplier,
    sameDay,
    isActive,
  });

  res.status(201).json({
    success: true,
    message: "Time slot created successfully",
    data: timeSlot,
  });
});

// Get all time slots with filtering and pagination
export const getTimeSlots = asyncHandler(async (req, res) => {
  const { isActive, sameDay, page = 1, limit = 10 } = req.query;

  const query = {};
  if (typeof isActive !== "undefined") query.isActive = isActive === "true";
  if (sameDay) query.sameDay = sameDay;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const timeSlots = await TimeSlotModel.find(query)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit)
    .sort(options.sort);

  const total = await TimeSlotModel.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Time slots fetched successfully",
    data: {
      timeSlots,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
      },
    },
  });
});

// Get single time slot with enhanced error handling
export const getTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time slot ID format",
    });
  }

  const timeSlot = await TimeSlotModel.findById(id);

  if (!timeSlot) {
    return res.status(404).json({
      success: false,
      message: "Time slot not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Time slot fetched successfully",
    data: timeSlot,
  });
});

// Update time slot with enhanced validation
export const updateTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time slot ID format",
    });
  }

  // Check if name is being updated and is unique
  if (updates.name) {
    const existingTimeSlot = await TimeSlotModel.findOne({
      name: updates.name,
      _id: { $ne: id },
    });
    if (existingTimeSlot) {
      return res.status(409).json({
        success: false,
        message: "Time slot with this name already exists",
      });
    }
  }

  const timeSlot = await TimeSlotModel.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!timeSlot) {
    return res.status(404).json({
      success: false,
      message: "Time slot not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Time slot updated successfully",
    data: timeSlot,
  });
});

// Delete time slot with enhanced safety checks
export const deleteTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time slot ID format",
    });
  }

  const timeSlot = await TimeSlotModel.findById(id);

  if (!timeSlot) {
    return res.status(404).json({
      success: false,
      message: "Time slot not found",
    });
  }

  // hard delete option
  await TimeSlotModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Time slot deactivated successfully",
  });
});

// New endpoint to bulk update time slots
export const bulkUpdateTimeSlots = asyncHandler(async (req, res) => {
  const { timeSlots } = req.body;

  if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of time slots to update",
    });
  }

  const updates = await Promise.all(
    timeSlots.map(async (slot) => {
      if (!slot._id) return null;
      return TimeSlotModel.findByIdAndUpdate(
        slot._id,
        { $set: slot },
        { new: true, runValidators: true }
      );
    })
  );

  res.status(200).json({
    success: true,
    message: "Time slots updated successfully",
    data: updates.filter(Boolean),
  });
});


