import asyncHandler from "express-async-handler";
import CustomerModel from "../../models/customers/CustomerModel.js";
import {
  uploadImage,
  deleteImage,
  updateImage,
} from "../../helpers/imageUpload.js";

export const createCustomer = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, address, customerType, additionalInfo } =
      req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone are required" });
    }

    let logo = "https://placehold.co/180x50";

    if (req.file) {
      const result = await uploadImage(req.file, "customer_logos");
      logo = result.url;
    }

    const customer = new CustomerModel({
      name,
      email,
      phone,
      address,
      customerType,
      additionalInfo,
      logo,
    });

    await customer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating customer" });
  }
});

export const getCustomers = asyncHandler(async (req, res) => {
  try {
    const customers = await CustomerModel.find();
    res
      .status(200)
      .json({
        message: "Customers fetched successfully",
        customers,
        count: customers.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting customers" });
  }
});

export const getCustomer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer fetched successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting customer" });
  }
});

export const updateCustomer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      customerType,
      additionalInfo,
      customerContacts, // This should be an array of contact IDs
    } = req.body;

    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update fields if provided
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.customerType = customerType || customer.customerType;
    customer.additionalInfo = additionalInfo || customer.additionalInfo;

    // Update customerContacts with the new array of IDs
    if (Array.isArray(customerContacts)) {
      customer.customerContacts = customerContacts;
    }

    // Handle logo upload if a file is provided
    if (req.file) {
      const result = await updateImage(
        req.file,
        customer.logo,
        "customer_logos"
      );
      customer.logo = result.url;
    }

    await customer.save();

    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating customer" });
  }
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.logo !== "https://placehold.co/180x50") {
      await deleteImage(customer.logo);
    }

    await CustomerModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting customer" });
  }
});
