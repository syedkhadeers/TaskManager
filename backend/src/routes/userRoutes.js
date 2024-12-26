import express from "express";
import { 
  loggedInUsersOnly, 
  managersOnly, 
  adminsOnly 
} from "../middleware/authMiddleware.js";
import { uploadUserPhoto } from "../middleware/uploadMiddleware.js";
import { 
  addUser, 
  getUser, 
  getUserById, 
  getUsers, 
  updateUser, 
  updateUserById, 
  deleteUserById,
  changeMePassword,
  changeUserPassword 
} from "../controllers/user/userController.js";

const router = express.Router();

// User management routes
router.post("/add-user", managersOnly, uploadUserPhoto.single("photo"), addUser);
router.get("/users", managersOnly, getUsers);

// Individual user routes
router.get("/user", loggedInUsersOnly, getUser);
router.get("/user/:id", managersOnly, getUserById);
router.patch("/user", loggedInUsersOnly, uploadUserPhoto.single("photo"), updateUser);
router.patch("/update-user/:id", managersOnly, uploadUserPhoto.single("photo"), updateUserById);
router.delete("/admin/users/:id", adminsOnly, deleteUserById);

// Password management routes
router.patch("/change-me-password", loggedInUsersOnly, changeMePassword);
router.patch("/change-user-password/:id", managersOnly, changeUserPassword);

export default router;

