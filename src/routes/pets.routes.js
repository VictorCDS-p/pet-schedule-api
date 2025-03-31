import express from "express";
import { createPet, getPetsByUser, deletePet, getAllPets } from "../controllers/pets.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPet);
router.get("/", authMiddleware, getPetsByUser);
router.get("/all", authMiddleware, getAllPets); 
router.delete("/:id", authMiddleware, deletePet);

export default router;
