import mongoose, { Schema } from "mongoose";

const topic = mongoose.model(
  "Topic",
  new Schema(
    {
      TopicName: {
        type: String,
        required: true,
        validate: {
          validator: (value) => value.length > 10,
          message: "Topic name must greater than 10 characters",
        },
      },
    },
    {
      timestamps: true,
    }
  )
);

export default topic;
