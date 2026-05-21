const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      max: 500,
      required: true,
      trim: true,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300,
        },

        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "posts",
  },
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
