// src/models/Dueno.model.ts
import { Schema, model } from "mongoose";

const DuenoSchema = new Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true }
});

export default model("Dueno", DuenoSchema);
