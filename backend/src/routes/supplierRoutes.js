import express from "express";

import { adminsOnly, loggedInUsersOnly, managersOnly, protect } from "../middleware/authMiddleware.js";

import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from "../controllers/supplier/SupplierController.js";
import { createSupplierContact, deleteSupplierContact, getSupplierContact, getSupplierContacts, updateSupplierContact } from "../controllers/supplier/supplierContactController.js";
import { uploadSupplierContactPhoto, uploadSupplierLogo } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post( "/supplier/create", adminsOnly, uploadSupplierLogo.single("logo"), createSupplier );
router.get("/suppliers", loggedInUsersOnly, getSuppliers);
router.get("/supplier/:id", loggedInUsersOnly, getSupplier);
router.patch( "/supplier/:id", managersOnly, uploadSupplierLogo.single("logo"), updateSupplier );
router.delete("/supplier/:id", adminsOnly, deleteSupplier);


router.post("/Supplier-Contact/create", adminsOnly, uploadSupplierContactPhoto.single("contactPhoto"), createSupplierContact);
router.get("/Supplier-Contacts", loggedInUsersOnly, getSupplierContacts);
router.get("/Supplier-Contact/:id", loggedInUsersOnly, getSupplierContact);
router.patch("/Supplier-Contact/:id", managersOnly, uploadSupplierContactPhoto.single("contactPhoto"), updateSupplierContact);
router.delete("/Supplier-Contact/:id", adminsOnly, deleteSupplierContact);

export default router;

