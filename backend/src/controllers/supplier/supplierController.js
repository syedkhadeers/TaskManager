import asyncHandler from "express-async-handler";
import SupplierModel from "../../models/suppliers/SupplierModel.js";
import {
  uploadImage,
  deleteImage,
  updateImage,
} from "../../helpers/imageUpload.js";

export const createSupplier = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, address, supplierType, additionalInfo } =
      req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone are required" });
    }

    let logo = "https://placehold.co/180x50";

    if (req.file) {
      const result = await uploadImage(req.file, "supplier_logos");
      logo = result.url;
    }

    const supplier = new SupplierModel({
      name,
      email,
      phone,
      address,
      supplierType,
      additionalInfo,
      logo,
    });

    await supplier.save();

    res
      .status(201)
      .json({ message: "Supplier created successfully", supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating supplier" });
  }
});

export const getSuppliers = asyncHandler(async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    res
      .status(200)
      .json({
        message: "Suppliers fetched successfully",
        suppliers,
        count: suppliers.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting suppliers" });
  }
});

export const getSupplier = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await SupplierModel.findById(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res
      .status(200)
      .json({ message: "Supplier fetched successfully", supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting supplier" });
  }
});

export const updateSupplier = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      supplierType,
      additionalInfo,
      supplierContacts,
    } = req.body;

    const supplier = await SupplierModel.findById(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    supplier.name = name || supplier.name;
    supplier.email = email || supplier.email;
    supplier.phone = phone || supplier.phone;
    supplier.address = address || supplier.address;
    supplier.supplierType = supplierType || supplier.supplierType;
    supplier.additionalInfo = additionalInfo || supplier.additionalInfo;

    if (Array.isArray(supplierContacts)) {
      supplier.supplierContacts = supplierContacts;
    }

    if (req.file) {
      const result = await updateImage(
        req.file,
        supplier.logo,
        "supplier_logos"
      );
      supplier.logo = result.url;
    }

    await supplier.save();

    res
      .status(200)
      .json({ message: "Supplier updated successfully", supplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating supplier" });
  }
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await SupplierModel.findById(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    if (supplier.logo !== "https://placehold.co/180x50") {
      await deleteImage(supplier.logo);
    }

    await SupplierModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting supplier" });
  }
});
