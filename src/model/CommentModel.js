import mongoose, { Schema } from "mongoose";

const comment = mongoose.model(
  "comment",
  new Schema(
    {
      CreateAt: { type: Object, required: true },
      comment: { type: String, required: true },
      ListAnswerComment: { type: Array, required: true },
      blogID: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);
export default comment;
