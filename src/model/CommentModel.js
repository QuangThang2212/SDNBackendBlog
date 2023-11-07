import mongoose, { Schema } from "mongoose";

const comment = mongoose.model(
  "comment",
  new Schema(
    {
      comment: { type: String, required: true },
      fatherComment: { type: String },
      blogID: { type: String, required: true },
      userID: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);
export default comment;
