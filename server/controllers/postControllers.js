const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");

//Register Post
const setPost = async (req, res) => {
  try {
    // Validate request body
    const { userId, description, image } = req.body;

    if (!userId || !description) {
      return res
        .status(400)
        .json({ errors: ["Campos obrigatórios não foram preenchidos!"] });
    }

    // Create new post
    const newPost = new Post({
      userId,
      description,
      image: image || null, // Optional field
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Erro ao registar Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao registar Post!"], details: error.message });
  }
};

//Update Post
const updatePost = async (req, res) => {
  try {
    // Validate request body
    const { userId, description, image } = req.body;
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    // Check if user is authorized to update the post
    if (postExists.userId !== userId) {
      return res
        .status(403)
        .json({ errors: ["Você não tem permissão para atualizar este Post!"] });
    }

    // Ensure there is something to update
    if (!description && !image) {
      return res
        .status(400)
        .json({ errors: ["Nenhuma informação foi enviada para atualizar!"] });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: { description, image } },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Erro ao atualizar Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao atualizar Post!"], details: error.message });
  }
};

//Delete Post
const deletePost = async (req, res) => {
  try {
    // Validate request body
    const { userId } = req.body;
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    // Check if user is authorized to delete the post
    if (postExists.userId !== userId) {
      return res
        .status(403)
        .json({ errors: ["Você não tem permissão para remover este Post!"] });
    }

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(500).json({ errors: ["Erro ao remover o Post!"] });
    }

    res
      .status(200)
      .json({ message: "Post removido com sucesso!", deletedPost });
  } catch (error) {
    console.error("Erro ao remover Post:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao remover Post!"], details: error.message });
  }
};

//Like Post
const likePost = async (req, res) => {
  try {
    // Validate request body
    const { userId } = req.body;
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    // Toggle like/unlike
    const updateOperation = postExists.likes.includes(userId)
      ? { $pull: { likes: userId } } // Unlike
      : { $push: { likes: userId } }; // Like

    const updatedPost = await Post.findByIdAndUpdate(id, updateOperation, {
      new: true, // Return the updated document
    });

    const message = postExists.likes.includes(userId)
      ? "Post descurtido com sucesso!"
      : "Post curtido com sucesso!";

    res.status(200).json({ message, updatedPost });
  } catch (error) {
    console.error("Erro ao curtir/descurtir Post:", error);
    return res.status(500).json({
      errors: ["Erro ao curtir/descurtir Post!"],
      details: error.message,
    });
  }
};

//Get Post
const getPosts = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["ID do Post inválido!"] });
    }

    // Check if post exists
    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({ errors: ["Post não encontrado!"] });
    }

    return res.status(200).json(postExists);
  } catch (error) {
    console.error("Erro ao buscar Posts:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar Posts!"],
      details: error.message,
    });
  }
};

//Get Timeline Posts
const getAlltPosts = async (req, res) => {
  try {
    const currentUserId = await User.findById(req.params.userId);

    if (!currentUserId) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const userPosts = await Post.find({ userId: currentUserId._id });

    const friendPosts = await Promise.all(
      currentUserId.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    console.error("Erro ao buscar timeline Posts:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar timeline Posts!"],
      details: error.message,
    });
  }
};

module.exports = {
  setPost,
  updatePost,
  deletePost,
  likePost,
  getPosts,
  getAlltPosts,
};
