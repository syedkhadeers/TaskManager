import asyncHandler from "express-async-handler";
import ExtraServiceModel from "../../models/rooms/ExtraServiceModel.js";

// Create extra service with enhanced validation
export const createExtraService = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    basePrice,
    icon,
    serviceType,
    additionalInfo,
    availability,
  } = req.body;

  // Enhanced validation
  const validationErrors = [];
  if (!name?.trim()) validationErrors.push("Service name is required");
  if (!basePrice || basePrice <= 0)
    validationErrors.push("Valid base price is required");

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  // Check for existing service with same name
  const existingService = await ExtraServiceModel.findOne({
    name: name.trim(),
  });
  if (existingService) {
    return res.status(409).json({
      success: false,
      message: "Service with this name already exists",
    });
  }

  const extraService = await ExtraServiceModel.create({
    name: name.trim(),
    description: description?.trim() || "",
    basePrice,
    icon: icon?.trim() || "",
    serviceType: serviceType?.trim() || "",
    additionalInfo: additionalInfo?.trim() || "",
    availability: availability ?? true,
  });

  res.status(201).json({
    success: true,
    message: "Extra service created successfully",
    data: extraService,
  });
});

// Get all extra services with filtering and pagination
export const getExtraServices = asyncHandler(async (req, res) => {
  const {
    availability,
    serviceType,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  if (typeof availability !== "undefined") {
    query.availability = availability === "true";
  }
  if (serviceType) query.serviceType = serviceType;

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

  const extraServices = await ExtraServiceModel.find(query)
    .sort(options.sort)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit);

  const total = await ExtraServiceModel.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Extra services fetched successfully",
    data: {
      extraServices,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit,
      },
    },
  });
});

// Get single extra service by ID
export const getExtraServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid service ID format",
    });
  }

  const extraService = await ExtraServiceModel.findById(id);

  if (!extraService) {
    return res.status(404).json({
      success: false,
      message: "Extra service not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Extra service fetched successfully",
    data: extraService,
  });
});

// Update extra service by ID
export const updateExtraServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    basePrice,
    icon,
    serviceType,
    additionalInfo,
    availability,
  } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid service ID format",
    });
  }

  const extraService = await ExtraServiceModel.findById(id);

  if (!extraService) {
    return res.status(404).json({
      success: false,
      message: "Extra service not found",
    });
  }

  // Check name uniqueness if being updated
  if (name && name !== extraService.name) {
    const existingService = await ExtraServiceModel.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service with this name already exists",
      });
    }
  }

  const updates = {
    ...(name && { name: name.trim() }),
    ...(description && { description: description.trim() }),
    ...(basePrice && { basePrice }),
    ...(icon && { icon: icon.trim() }),
    ...(serviceType && { serviceType: serviceType.trim() }),
    ...(additionalInfo && { additionalInfo: additionalInfo.trim() }),
    ...(typeof availability !== "undefined" && { availability }),
  };

  const updatedService = await ExtraServiceModel.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Extra service updated successfully",
    data: updatedService,
  });
});

// Delete extra service by ID
export const deleteExtraServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid service ID format",
    });
  }

  const extraService = await ExtraServiceModel.findById(id);

  if (!extraService) {
    return res.status(404).json({
      success: false,
      message: "Extra service not found",
    });
  }

  await ExtraServiceModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Extra service deleted successfully",
    data: { id },
  });
});

// Bulk update extra services
export const bulkUpdateExtraServices = asyncHandler(async (req, res) => {
  const { services } = req.body;

  if (!Array.isArray(services) || services.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of services to update",
    });
  }

  const updates = await Promise.all(
    services.map(async (service) => {
      if (!service._id) return null;
      return ExtraServiceModel.findByIdAndUpdate(
        service._id,
        { $set: service },
        { new: true, runValidators: true }
      );
    })
  );

  res.status(200).json({
    success: true,
    message: "Extra services updated successfully",
    data: updates.filter(Boolean),
  });
});
