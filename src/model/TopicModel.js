import mongoose, { Schema } from "mongoose";

const topic = mongoose.model(
  "Topic",
  new Schema(
    {
      TopicName: {
        type: String,
        required: true,
        validate: {
          validator: (value) => value.length > 2,
          message: "Topic name must greater than 2 characters",
        },
      },
    },
    {
      timestamps: true,
    }
  )
);

export default topic;
