import mongoose, { Schema } from "mongoose";

const blog = mongoose.model(
  "Blog",
  new Schema(
    {
      id: { type: OBjectID },
      Title: {
        type: String,
        required: true,
        validate: {
          validator: (value) => value.length > 10,
          message: "Title must greater than 10 characters",
        },
      },
      Content: {
        type: String,
        required: true,
        validate: {
          validator: (value) => value.length > 10,
          message: "Content must greater than 10 characters",
        },
      },
      PublicStatus: { type: Boolean, required: true },
      NumberOfFav: { type: Number, required: true },
      CreateAt: { type: Date, required: true },
      TopicID: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default blog;
