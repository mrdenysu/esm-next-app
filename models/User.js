import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const User = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
  nik: { type: String },
  phone: { type: String, unique: true },
  sex: { type: Number, default: 0, max: 2, min: 0 }, // 0 - не выбранно, 1 - ж, 2 - м

  roles: [{ type: Types.ObjectId, ref: "Role" }],
});

export default model("User", User);
