import express from "express";
import { createAppointment, getAppointments, deleteAppointment } from "../controllers/appointments.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, getAppointments);
router.delete("/:id", authMiddleware, deleteAppointment);

export default router;  
