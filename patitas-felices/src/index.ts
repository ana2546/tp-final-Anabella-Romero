import express, { Request, Response } from "express";
import path from "path";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import mascRoutes from "./routes/masc.routes";
import duenoRoutes from "./routes/dueno.routes";
import vetRoutes from "./routes/vet.routes";
import historialRoutes from "./routes/historial.routes";
import usuariosRoutes from "./routes/usuarios.routes";

import { authenticate, authorize } from "./middlewares/auth.middleware";

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, "public")));

// PÁGINAS
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

app.get("/register", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "register.html"));
});

app.get("/dashboard", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "dashboard.html"));
});

app.get("/cargar-cliente", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "cargar-cliente.html"));
});

app.get("/animal", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "animal-detail.html"));
});

app.get("/edit-history", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "edit-history.html"));
});

app.get("/usuarios", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "usuarios.html"));
});

// API
app.use("/auth", authRoutes);
app.use("/animals", mascRoutes);
app.use("/duenos", duenoRoutes);
app.use("/veterinarios", vetRoutes);
app.use("/historiales", historialRoutes);
app.use("/usuarios-api", usuariosRoutes);

app.get("/protected", authenticate, (_req, res) => {
  res.json({
    message: "Acceso permitido"
  });
});

app.get("/admin", authenticate, authorize(["admin"]), (_req, res) => {
  res.json({
    message: "Acceso de administrador permitido"
  });
});

// SERVER
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});