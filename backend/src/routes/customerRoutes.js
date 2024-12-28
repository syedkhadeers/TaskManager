import express from "express";



import { loggedInUsersOnly, managersOnly } from "../middleware/authMiddleware.js";
import { uploadCustomerLogo, uploadCustomerContactPhoto } from "../middleware/uploadMiddleware.js";
import { createCustomerContact, deleteCustomerContact, getCustomerContact, getCustomerContacts, updateCustomerContact } from "../controllers/customer/CustomerContactController.js";
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "../controllers/customer/CustomerController.js";

const router = express.Router();


router.post("/customer-contact/create", loggedInUsersOnly, uploadCustomerContactPhoto.single("contactPhoto"), createCustomerContact);
router.get("/customer-contacts", loggedInUsersOnly, getCustomerContacts);
router.get("/customer-contact/:id", loggedInUsersOnly, getCustomerContact);
router.patch("/customer-contact/:id", loggedInUsersOnly, uploadCustomerContactPhoto.single("contactPhoto"), updateCustomerContact);
router.delete("/customer-contact/:id", managersOnly, deleteCustomerContact);

router.post("/customer/create", loggedInUsersOnly, uploadCustomerLogo.single("logo"), createCustomer);
router.get("/customers", loggedInUsersOnly, getCustomers);
router.get("/customer/:id", loggedInUsersOnly, getCustomer);
router.patch("/customer/:id", loggedInUsersOnly, uploadCustomerLogo.single("logo"), updateCustomer);
router.delete("/customer/:id", managersOnly, deleteCustomer);





export default router;

