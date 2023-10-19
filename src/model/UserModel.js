import mongoose, { Schema } from "mongoose";
import isEmail from "validator/lib/isEmail.js";


const user = mongoose.model(
  "user",
  new Schema(
    {
      usename: {
        type: String,
        required: true,
        validate: {
          validator: (value) => value.length > 1 && value.length < 20,
          message: "Use-name must greater than 1 characters and less than 20 characters",
        },
      },
      email: {
        type: String,
        required: true,
        validate: {
          validator: (value) => isEmail(value),
        },
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      ListOwnBlog: {
        type: Array,
      },
      Role: {
        type: String,
        required: true,
      },
      Status: {
        type: Boolean,
        required: true,
      },
      TopicManageAssign: {
        type: Array,
      },
    },
    {
      timestamps: true,
    }
  )
);

export default user;
