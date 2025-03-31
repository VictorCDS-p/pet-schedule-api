import express from "express";
import { createUser, loginUser, getProfile} from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);

export default router;
