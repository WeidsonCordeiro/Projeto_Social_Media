const mongoose = require("mongoose");
const { Schema } = mongoose;

const PhotoSchema = new Schema(
  {
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: mongoose.Types.ObjectId,
    userName: String,
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", PhotoSchema);
