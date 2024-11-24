import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from "../controllers/supplier/SupplierController.js";
import { createSupplierContact, deleteSupplierContact, getSupplierContact, getSupplierContacts, updateSupplierContact } from "../controllers/supplier/supplierContactController.js";
import { uploadSupplierContactPhoto, uploadSupplierLogo } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post( "/supplier/create", protect, uploadSupplierLogo.single("logo"), createSupplier );
router.get("/suppliers", protect, getSuppliers);
router.get("/supplier/:id", protect, getSupplier);
router.patch( "/supplier/:id", protect, uploadSupplierLogo.single("logo"), updateSupplier );
router.delete("/supplier/:id", protect, deleteSupplier);


router.post("/Supplier-Contact/create", protect, uploadSupplierContactPhoto.single("contactPhoto"), createSupplierContact);
router.get("/Supplier-Contacts", protect, getSupplierContacts);
router.get("/Supplier-Contact/:id", protect, getSupplierContact);
router.patch("/Supplier-Contact/:id", protect, uploadSupplierContactPhoto.single("contactPhoto"), updateSupplierContact);
router.delete("/Supplier-Contact/:id", protect, deleteSupplierContact);

export default router;

