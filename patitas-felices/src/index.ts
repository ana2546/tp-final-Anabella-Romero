import express, { Request, Response } from "express";
import path from "path";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import mascRoutes from "./routes/masc.routes";
import { authenticate, authorize } from "./middlewares/auth.middleware";

const app = express();
const PORT = process.env.PORT || 5000;


// MIDDLEWARES

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ARCHIVOS ESTÁTICOS

app.use(express.static(path.join(__dirname, "public")));


// PÁGINAS

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

app.get("/register", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "register.html"));
});

app.get("/dashboard", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "pages", "dashboard.html"));
});

app.get("/edit-pet", (req: Request, res: Response) => {

res.sendFile(path.join(__dirname, "public", "pages", "edit-pet.html"));

});

// API

app.use("/auth", authRoutes);
app.use("/animals", mascRoutes);

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Acceso permitido",
  });
});

app.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({
    message: "Acceso de administrador permitido",
  });
});


// SERVER

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});