import asyncHandler from "express-async-handler";
import SupplierContactModel from "../../models/suppliers/SupplierContactModel.js";
import {
  uploadImage,
  deleteImage,
  updateImage,
} from "../../helpers/imageUpload.js";

export const createSupplierContact = asyncHandler(async (req, res) => {
  try {
    const { contactName, contactEmail, contactPhone, ContactPosition } =
      req.body;

    if (!contactName || !contactEmail || !contactPhone) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone are required" });
    }

    let contactPhoto = "https://i.pravatar.cc/300";

    if (req.file) {
      const result = await uploadImage(req.file, "supplier_contact_photos");
      contactPhoto = result.url;
    }

    const supplierContact = new SupplierContactModel({
      contactName,
      contactEmail,
      contactPhone,
      ContactPosition,
      contactPhoto,
    });

    await supplierContact.save();

    res
      .status(201)
      .json({
        message: "Supplier contact created successfully",
        supplierContact,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating supplier contact" });
  }
});

export const getSupplierContacts = asyncHandler(async (req, res) => {
  try {
    const supplierContacts = await SupplierContactModel.find();
    res
      .status(200)
      .json({
        message: "Supplier contacts fetched successfully",
        supplierContacts,
        count: supplierContacts.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting supplier contacts" });
  }
});

export const getSupplierContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const supplierContact = await SupplierContactModel.findById(id);

    if (!supplierContact) {
      return res.status(404).json({ message: "Supplier contact not found" });
    }

    res
      .status(200)
      .json({
        message: "Supplier contact fetched successfully",
        supplierContact,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting supplier contact" });
  }
});

export const updateSupplierContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      contactName,
      contactEmail,
      contactPhone,
      ContactPosition,
      ContactStatus,
    } = req.body;

    const supplierContact = await SupplierContactModel.findById(id);

    if (!supplierContact) {
      return res.status(404).json({ message: "Supplier contact not found" });
    }

    supplierContact.contactName = contactName || supplierContact.contactName;
    supplierContact.contactEmail = contactEmail || supplierContact.contactEmail;
    supplierContact.contactPhone = contactPhone || supplierContact.contactPhone;
    supplierContact.ContactPosition = ContactPosition || supplierContact.ContactPosition;
    supplierContact.ContactStatus = ContactStatus || supplierContact.ContactStatus;



    if (req.file) {
      const result = await updateImage(
        req.file,
        supplierContact.contactPhoto,
        "supplier_contact_photos"
      );
      supplierContact.contactPhoto = result.url;
    }

    await supplierContact.save();

    res
      .status(200)
      .json({
        message: "Supplier contact updated successfully",
        supplierContact,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating supplier contact" });
  }
});

export const deleteSupplierContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const supplierContact = await SupplierContactModel.findById(id);

    if (!supplierContact) {
      return res.status(404).json({ message: "Supplier contact not found" });
    }

    if (supplierContact.contactPhoto !== "https://i.pravatar.cc/300") {
      await deleteImage(supplierContact.contactPhoto);
    }

    await SupplierContactModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Supplier contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting supplier contact" });
  }
});
