// src/models/Mascota.model.ts
import { Schema, model } from "mongoose";

const MascotaSchema = new Schema({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  edad: { type: Number, required: true },
  dueno: { type: Schema.Types.ObjectId, ref: "Dueno" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }
});

export default model("Mascota", MascotaSchema);
