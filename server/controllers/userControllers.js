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
    const { email, password } = req.body;

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
      token: generateToken(user._id),
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
    console.error("Erro ao buscar usuário:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao buscar usuário!"], errors: error.message });
  }
};

module.exports = {
  setUser,
  getCurrentUser,
  updateUser,
  login,
  getUserById,
};
