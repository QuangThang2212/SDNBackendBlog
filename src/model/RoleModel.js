import mongoose, { Schema } from "mongoose";

const role = mongoose.model(
  "Role",
  new Schema({
    id: { type: ObjectID },
    role: {
      type: String,
      required: true,
    },
  })
);

export default role;
