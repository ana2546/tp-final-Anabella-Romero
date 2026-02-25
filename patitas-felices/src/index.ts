import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import mascotasRoutes from "./routes/mascotas.routes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/mascotas", mascotasRoutes);

app.listen(process.env.PORT, () =>
  console.log("Servidor corriendo")
);
