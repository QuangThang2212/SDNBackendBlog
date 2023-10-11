import mongoose from "mongoose";

const comment = mongoose.model(
  "comment",
  new Schema(
    {
      id: { type: ObjectID },
      CreateAt: { type: Object, required: true },
      comment: { type: String, required: true },
      ListAnswerComment: { type: Array, required: true },
    },
    {
      timestamps: true,
    }
  )
);
export default comment;
