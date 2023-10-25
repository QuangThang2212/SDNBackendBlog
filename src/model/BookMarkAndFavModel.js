import mongoose, { Schema } from "mongoose";

const bookmarkAndFav = mongoose.model(
  "BookmarkAndFav",
  new Schema(
    {
      userID: { type: String, required: true },
      blogID: { type: String, required: true },
      type: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default bookmarkAndFav;
