import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.send("API funcionando");
});

app.listen(process.env.PORT, () =>
  console.log("Servidor corriendo")
);
