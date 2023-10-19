import mongoose, { Schema } from "mongoose";

const blog = mongoose.model(
  "Blog",
  new Schema(
    {
      userID: { type: String, required: true },
      blogID: { type: String, required: true },
      type: { type: String, required: true},
    },
    {
      timestamps: true,
    }
  )
);

export default blog;
