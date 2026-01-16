const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

//Gerenate User Token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "4h",
  });
};

//Register User
const setUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(422)
        .json({ errors: ["Por favor, utilize outro e-mail"] });
    }

    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
    });

    if (!newUser) {
      return res
        .status(422)
        .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    }

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error("Erro ao registar User:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao registar User!"], details: error.message });
  }
};

//Get current logged in user
const getCurrentUser = async (req, res) => {
  try {
    const { user } = req; //const user = req.user; //Destructuring user from req
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao buscar usuário!"], errors: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const reqUser = req.user;
    const user = await User.findById(reqUser._id).select("-password");

    // Ensure there is something to update
    if (!updates) {
      return res
        .status(400)
        .json({ errors: ["Nenhuma informação foi enviada para atualizar!"] });
    }

    const { password, email, isAdmin, ...allowedUpdates } = updates;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      allowedUpdates.password = await bcrypt.hash(password, salt);
    }
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ errors: ["Erro ao atualizar usuário!"] });
  }
};

//Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ errors: ["E-mail ou senha inválidos!"] });
    }

    //Check if password is correct
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(404).json({ errors: ["E-mail ou senha inválidos!"] });
    }

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
      followers: user.followers,
      followings: user.followings,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao fazer login!"], errors: error.message });
  }
};

//Get User by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if user exists
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ errors: ["Id Usuário inválido!"] });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por Id:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar usuário por Id!"],
      message: error.message,
    });
  }
};

//Get User by Name
const getUserByName = async (req, res) => {
  try {
    const { userName } = req.params;

    //Check if user exists
    const user = await User.findOne({ username: userName }).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por Nome:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar usuário por Nome!"],
      message: error.message,
    });
  }
};

//Get Friends by UserId
const getFriendsById = async (req, res) => {
  try {
    const { userId } = req.params;
    //Check if user exists
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(422).json({ errors: ["Id Usuário inválido!"] });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId).select("_id username profilePicture");
      })
    );
    res.status(200).json(friends);
  } catch (error) {
    console.error("Erro ao buscar amigos por Id:", error);
    return res.status(500).json({
      errors: ["Erro ao buscar amigos por Id!"],
      message: error.message,
    });
  }
};

//User Follows
const userFollows = async (req, res) => {
  try {
    const { userId } = req.params;
    const reqUser = req.user;
    if (reqUser._id.toString() === userId) {
      return res
        .status(400)
        .json({ errors: ["Você não pode seguir você mesmo!"] });
    }
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(reqUser._id);
    if (!userToFollow) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }
    if (currentUser.followings.includes(userId)) {
      return res.status(400).json({ errors: ["Você já segue este usuário!"] });
    }
    currentUser.followings.push(userId);
    await currentUser.save();
    res.status(200).json({ message: "Usuário seguido com sucesso!" });
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao seguir usuário!"], message: error.message });
  }
};

//User unFollows
const userUnFollows = async (req, res) => {
  try {
    const { userId } = req.params;
    const reqUser = req.user;
    console.log("User ID to unfollow:", userId);
    console.log("User ID to unfollow:", reqUser);

    if (reqUser._id.toString() === userId) {
      return res
        .status(400)
        .json({ errors: ["Você não pode deixar de seguir você mesmo!"] });
    }
    const userToUnFollow = await User.findById(userId);
    const currentUser = await User.findById(reqUser._id);
    if (!userToUnFollow) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }
    if (!currentUser.followings.includes(userId)) {
      return res.status(400).json({ errors: ["Você não segue este usuário!"] });
    }
    currentUser.followings = currentUser.followings.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save();
    res.status(200).json({ message: "Usuário deixado de seguir com sucesso!" });
  } catch (error) {
    console.error("Erro ao deixar de seguir usuário:", error);
    return res.status(500).json({
      errors: ["Erro ao deixar de seguir usuário!"],
      message: error.message,
    });
  }
};

module.exports = {
  setUser,
  getCurrentUser,
  updateUser,
  login,
  getUserById,
  getUserByName,
  getFriendsById,
  userFollows,
  userUnFollows,
};
