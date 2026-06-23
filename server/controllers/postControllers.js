const cloudinary = require("../utils/cloudinary");
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");

const populateUser = (query) => {
  return query
    .populate("userId", "username profilePicture")
    .populate("comments.userId", "username profilePicture")
    .sort({
      createdAt: -1,
    });
};

// Register Post
const setPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    let imageUrl = null;
    let publicId = null;

    if (!userId || !description) {
      return res
        .status(400)
        .json({ error: ["Required fields were not filled!"] });
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "social_media/posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    // Create new post
    const newPost = new Post({
      userId,
      description,
      img: imageUrl,
    });

    // If Photo is created successfully
    if (!newPost) {
      return res.status(422).json({ error: ["Error creating the Post!"] });
    }

    const savedPost = await newPost.save();

    //Broadcast event for add post in real time.
    req.io.emit("postAdded", {
      post: savedPost,
    });

    res.status(201).json({
      message: "Post successfully registered",
      post: savedPost,
    });
  } catch (error) {
    console.error("Error registering Post:", error);
    return res
      .status(500)
      .json({ error: ["Error registering Post!"], details: error.message });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({
        error: ["Invalid Post ID!"],
      });
    }

    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({
        error: ["Post not found!"],
      });
    }

    if (!postExists.userId.equals(userId)) {
      return res.status(403).json({
        error: ["You do not have permission to update this Post!"],
      });
    }

    const updates = {};

    if (description !== undefined) {
      updates.description = description;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: ["No information was sent to update!"],
      });
    }

    const updatedPost = await populateUser(
      Post.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      )
    );

    //Broadcast event for update post in real time.
    req.io.emit("postUpdated", {
      postId: id,
      updatedPost,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating Post:", error);

    return res.status(500).json({
      error: ["Error updating Post!"],
      details: error.message,
    });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid Post ID!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ error: ["Post not found!"] });
    }

    // Check if user is authorized to delete the post
    if (!postExists.userId.equals(userId)) {
      return res.status(403).json({
        error: ["You do not have permission to remove this Post!"],
      });
    }

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(500).json({ error: ["Error removing the Post!"] });
    }

    //Broadcast event for delete post in real time.
    req.io.emit("postDeleted", {
      postId: id,
    });

    res
      .status(200)
      .json({ message: "Post successfully removed!", deletedPost });
  } catch (error) {
    console.error("Error removing Post:", error);
    return res
      .status(500)
      .json({ error: ["Error removing Post!"], details: error.message });
  }
};

// Like Post
const likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid Post ID!"] });
    }

    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ error: ["Post not found!"] });
    }

    const updateOperation = postExists.likes.includes(userId)
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    const updatedPost = await populateUser(
      Post.findByIdAndUpdate(id, updateOperation, {
        new: true,
      })
    );

    //Broadcast event for likes in real time.
    req.io.emit("postLiked", { postId: id, updatedPost });

    const message = postExists.likes.includes(userId)
      ? "Post successfully unliked!"
      : "Post successfully liked!";

    res.status(200).json({ message, updatedPost });
  } catch (error) {
    console.error("Error liking/unliking Post:", error);
    return res.status(500).json({
      error: ["Error liking/unliking Post!"],
      details: error.message,
    });
  }
};

// Comment Post
const commentPost = async (req, res) => {
  try {
    const { userId, comments } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid Post ID!"] });
    }

    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ error: ["Post not found!"] });
    }

    const updatedPost = await populateUser(
      Post.findByIdAndUpdate(
        id,
        {
          $push: {
            comments: {
              userId,
              text: comments,
            },
          },
        },
        { new: true }
      )
    );

    // Launch an event to update comments in real time.
    req.io.emit("commentAdded", { postId: id, updatedPost });

    res
      .status(200)
      .json({ message: "Comment successfully added!", updatedPost });
  } catch (error) {
    console.error("Error commenting on Post:", error);
    return res.status(500).json({
      error: ["Error commenting on Post!"],
      details: error.message,
    });
  }
};

const deleteCommentPost = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid Post ID!"] });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({ error: ["Invalid Comment ID!"] });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        error: ["Post not found!"],
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        error: ["Comment not found!"],
      });
    }

    const isCommentOwner =
      comment.userId.toString() === req.user._id.toString();

    const isPostOwner = post.userId.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        error: ["You do not have permission to remove this comment!"],
      });
    }

    const updatedPost = await populateUser(
      Post.findByIdAndUpdate(
        id,
        {
          $pull: {
            comments: {
              _id: commentId,
            },
          },
        },
        { new: true }
      )
    );

    if (!updatedPost) {
      return res.status(404).json({ error: ["Post not found!"] });
    }

    //Broadcast event for delete in real time.
    req.io.emit("commentDeleted", {
      postId: id,
      updatedPost,
    });

    res.status(200).json({
      message: "Comment successfully removed!",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: ["Error removing comment!"],
      details: error.message,
    });
  }
};

const updateCommentPost = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid Post ID!"] });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(422).json({ error: ["Invalid Comment ID!"] });
    }

    if (!text || text.trim() === "") {
      return res.status(422).json({ error: ["Comment text is required!"] });
    }

    const updatedPost = await populateUser(
      Post.findOneAndUpdate(
        {
          _id: id,
          comments: {
            $elemMatch: {
              _id: commentId,
              userId: req.user._id,
            },
          },
        },
        {
          $set: {
            "comments.$.text": text,
          },
        },
        { new: true }
      )
    );

    if (!updatedPost) {
      return res.status(404).json({ error: ["Post or comment not found!"] });
    }

    //Broadcast event for update in real time.
    req.io.emit("commentUpdated", {
      postId: id,
      updatedPost,
    });

    res.status(200).json({
      message: "Comment successfully updated!",
      updatedPost,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      error: ["Error updating comment!"],
      details: error.message,
    });
  }
};

// Get Post
const getPosts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid Post ID!"] });
    }

    const postExists = await populateUser(Post.findById(id));

    if (!postExists) {
      return res.status(404).json({ error: ["Post not found!"] });
    }

    return res.status(200).json(postExists);
  } catch (error) {
    console.error("Error fetching Posts:", error);
    return res.status(500).json({
      error: ["Error fetching Posts!"],
      details: error.message,
    });
  }
};

// Get Timeline Posts by UserId
const getAllPostsByUserId = async (req, res) => {
  try {
    const currentUserId = await User.findById(req.params.userId);

    if (!currentUserId) {
      return res.status(404).json({ error: ["User not found!"] });
    }

    const timelinePosts = await populateUser(
      Post.find({
        userId: {
          $in: [currentUserId._id, ...currentUserId.followings],
        },
      })
    );

    return res.status(200).json(timelinePosts);
  } catch (error) {
    console.error("Error fetching timeline Posts by UserId:", error);
    return res.status(500).json({
      error: ["Error fetching timeline Posts by UserId!"],
      details: error.message,
    });
  }
};

// Get Timeline Posts by UserName
const getAllPostsByUserName = async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.params.userName });

    if (!currentUser) {
      return res.status(404).json({ error: ["User not found!"] });
    }

    const userPosts = await populateUser(
      Post.find({
        userId: {
          $in: [new mongoose.Types.ObjectId(currentUser._id)],
        },
      })
    );

    return res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error fetching timeline Posts by UserName:", error);
    return res.status(500).json({
      error: ["Error fetching timeline Posts by UserName!"],
      details: error.message,
    });
  }
};

module.exports = {
  setPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  deleteCommentPost,
  updateCommentPost,
  getPosts,
  getAllPostsByUserId,
  getAllPostsByUserName,
};
