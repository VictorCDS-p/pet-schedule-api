import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.routes.js";
import petRoutes from "./routes/pets.routes.js";
import appointmentRoutes from "./routes/appointments.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/pets", petRoutes);
app.use("/appointments", appointmentRoutes);

export default app;
