import mongoose, { Schema } from "mongoose";

const topic = mongoose.model(
  "Topic",
  new Schema({
    id: { type: ObjectID },
    TopicName: {
      type: String,
      required: true,
      validate: {
        validator: (value) => value.length > 10,
        message: "Topic name must greater than 10 characters",
      },
    },
  })
);

export default topic;