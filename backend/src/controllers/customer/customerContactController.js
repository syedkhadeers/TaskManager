import asyncHandler from "express-async-handler";
import CustomerContactModel from "../../models/customers/CustomerContactModel.js";
import {
  uploadImage,
  deleteImage,
  updateImage,
} from "../../helpers/imageUpload.js";

export const createCustomerContact = asyncHandler(async (req, res) => {
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
      const result = await uploadImage(req.file, "customer_contact_photos");
      contactPhoto = result.url;
    }

    const customerContact = new CustomerContactModel({
      contactName,
      contactEmail,
      contactPhone,
      ContactPosition,
      contactPhoto,
    });

    await customerContact.save();

    res
      .status(201)
      .json({
        message: "Customer contact created successfully",
        customerContact,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating customer contact" });
  }
});

export const getCustomerContacts = asyncHandler(async (req, res) => {
  try {
    const customerContacts = await CustomerContactModel.find();
    res
      .status(200)
      .json({
        message: "Customer contacts fetched successfully",
        customerContacts,
        count: customerContacts.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting customer contacts" });
  }
});

export const getCustomerContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const customerContact = await CustomerContactModel.findById(id);

    if (!customerContact) {
      return res.status(404).json({ message: "Customer contact not found" });
    }

    res
      .status(200)
      .json({
        message: "Customer contact fetched successfully",
        customerContact,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting customer contact" });
  }
});

export const updateCustomerContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      contactName,
      contactEmail,
      contactPhone,
      ContactPosition,
      ContactStatus,
    } = req.body;

    const customerContact = await CustomerContactModel.findById(id);

    if (!customerContact) {
      return res.status(404).json({ message: "Customer contact not found" });
    }

    customerContact.contactName = contactName || customerContact.contactName;
    customerContact.contactEmail = contactEmail || customerContact.contactEmail;
    customerContact.contactPhone = contactPhone || customerContact.contactPhone;
    customerContact.ContactPosition = ContactPosition || customerContact.ContactPosition;
    customerContact.ContactStatus = ContactStatus || customerContact.ContactStatus;

    if (req.file) {
      const result = await updateImage(
        req.file,
        customerContact.contactPhoto,
        "customer_contact_photos"
      );
      customerContact.contactPhoto = result.url;
    }

    await customerContact.save();

    res
      .status(200)
      .json({
        message: "Customer contact updated successfully",
        customerContact,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating customer contact" });
  }
});

export const deleteCustomerContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const customerContact = await CustomerContactModel.findById(id);

    if (!customerContact) {
      return res.status(404).json({ message: "Customer contact not found" });
    }

    if (customerContact.contactPhoto !== "https://i.pravatar.cc/300") {
      await deleteImage(customerContact.contactPhoto);
    }

    await CustomerContactModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting customer contact" });
  }
});
