import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 32,
    trim: true,
  },
});

export default mongoose.model("Category", categorySchema);
