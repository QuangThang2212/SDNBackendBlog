import mongoose, { Schema } from "mongoose";

const blog = mongoose.model(
  "Blog",
  new Schema({
    id: { type: OBjectID },
    title: {
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
        validator: (value) => value.length > 10 && value.length <= 3000,
        message: "Content must greater than 10 characters and less than 3000 characters",
      },
    },
    PublicStatus: { type: Boolean, required: true },
    NumberOfFav: { type: Array, required: true },
    CreateAt: { type: Date, required: true },
    TopicID: { type: String, required: true },
  })
);

export default blog;
