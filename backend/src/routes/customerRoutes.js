import express from "express";



import { protect } from "../middleware/authMiddleware.js";
import { uploadCustomerLogo, uploadCustomerContactPhoto } from "../middleware/uploadMiddleware.js";
import { createCustomerContact, deleteCustomerContact, getCustomerContact, getCustomerContacts, updateCustomerContact } from "../controllers/customer/CustomerContactController.js";
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "../controllers/customer/CustomerController.js";

const router = express.Router();


router.post("/customer-contact/create", protect, uploadCustomerContactPhoto.single("contactPhoto"), createCustomerContact);
router.get("/customer-contacts", protect, getCustomerContacts);
router.get("/customer-contact/:id", protect, getCustomerContact);
router.patch("/customer-contact/:id", protect, uploadCustomerContactPhoto.single("contactPhoto"), updateCustomerContact);
router.delete("/customer-contact/:id", protect, deleteCustomerContact);

router.post("/customer/create", protect, uploadCustomerLogo.single("logo"), createCustomer);
router.get("/customers", protect, getCustomers);
router.get("/customer/:id", protect, getCustomer);
router.patch("/customer/:id", protect, uploadCustomerLogo.single("logo"), updateCustomer);
router.delete("/customer/:id", protect, deleteCustomer);





export default router;

