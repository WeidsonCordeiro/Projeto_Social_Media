const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

//Gerenate User Token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "1h",
  });
};

const populateUser = (query) => {
  return query
    .populate("followings", "username profilePicture")
    .populate("followers", "username profilePicture")
    .select("-password");
};

//Register User
const setUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(422).json({ error: ["Please use another email"] });
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
        .json({ error: ["An error occurred, please try again later."] });
    }

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ error: ["Error registering user!"], details: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const reqUser = req.user;
    const removeCoverPicture = req.body.removeCoverPicture === "true";
    const removeProfilePicture = req.body.removeProfilePicture === "true";

    const user = await populateUser(User.findById(reqUser._id));

    if (!user) {
      return res.status(404).json({ error: ["User not found!"] });
    }

    const { username, description, city, from, relationship } = req.body;

    const updates = {};

    if (username !== undefined) updates.username = username;
    if (description !== undefined) updates.description = description;
    if (city !== undefined) updates.city = city;
    if (from !== undefined) updates.from = from;
    if (relationship !== undefined) updates.relationship = relationship;

    const hasUpdates =
      Object.keys(updates).length > 0 ||
      req.files?.profilePicture ||
      req.files?.coverPicture ||
      removeCoverPicture ||
      removeProfilePicture;

    if (!hasUpdates) {
      return res
        .status(400)
        .json({ error: ["No information was sent to update!"] });
    }

    // =====================
    // PROFILE PICTURE
    // =====================
    if (removeProfilePicture && user.profilePicture) {
      if (user.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
      }
      updates.profilePicture = null;
    } else if (req.files?.profilePicture) {
      if (user.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
      }

      const uploadProfile = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "social_media/users/profile" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.profilePicture[0].buffer);
      });

      updates.profilePicture = {
        url: uploadProfile.secure_url,
        publicId: uploadProfile.public_id,
      };
    }

    // =====================
    // COVER PICTURE
    // =====================
    if (removeCoverPicture && user.coverPicture) {
      if (user.coverPicture?.publicId) {
        await cloudinary.uploader.destroy(user.coverPicture.publicId);
      }
      updates.coverPicture = null;
    } else if (req.files?.coverPicture) {
      if (user.coverPicture?.publicId) {
        await cloudinary.uploader.destroy(user.coverPicture.publicId);
      }

      const uploadCover = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "social_media/users/cover" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.coverPicture[0].buffer);
      });

      updates.coverPicture = {
        url: uploadCover.secure_url,
        publicId: uploadCover.public_id,
      };
    }

    const updatedUser = await populateUser(
      User.findByIdAndUpdate(
        user._id,
        { $set: updates },
        { new: true, runValidators: true }
      )
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: ["Error updating user!"] });
  }
};

//Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists - don't remove password for authentication
    const user = await User.findOne({ email })
      .populate("followings", "username profilePicture")
      .populate("followers", "username profilePicture");

    if (!user) {
      return res.status(404).json({ error: ["Invalid email or password!"] });
    }

    //Check if password is correct
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(404).json({ error: ["Invalid email or password!"] });
    }

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      ...userData,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      error: ["Error logging in!"],
      message: error.message,
    });
  }
};

//Get User by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    //Check if user exists
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ error: ["Invalid user ID!"] });
    }

    const user = await populateUser(User.findById(id));

    if (!user) {
      return res.status(404).json({ error: ["User not found!"] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      error: ["Error fetching user by ID!"],
      message: error.message,
    });
  }
};

//Get User by Name
const getUserByName = async (req, res) => {
  try {
    const { userName } = req.params;

    //Check if user exists
    const user = await User.findOne({
      username: userName.toLowerCase(),
    })
      .populate("followings", "username profilePicture")
      .populate("followers", "username profilePicture")
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: ["User not found!"] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return res.status(500).json({
      error: ["Error fetching user by name!"],
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
      return res.status(400).json({ error: ["You can't follow yourself!"] });
    }
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(reqUser._id);
    if (!userToFollow) {
      return res.status(404).json({ error: ["User not found!"] });
    }
    if (currentUser.followings.includes(userId)) {
      return res
        .status(400)
        .json({ error: ["You are already following this user!"] });
    }
    currentUser.followings.push(userId);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    const updatedUser = await populateUser(User.findById(currentUser._id));

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error following user:", error);
    return res
      .status(500)
      .json({ error: ["Error following user!"], message: error.message });
  }
};

//User unFollows
const userUnFollows = async (req, res) => {
  try {
    const { userId } = req.params;
    const reqUser = req.user;

    if (reqUser._id.toString() === userId) {
      return res
        .status(400)
        .json({ error: ["You can't stop following yourself!"] });
    }
    const userToUnFollow = await User.findById(userId);
    const currentUser = await User.findById(reqUser._id);
    if (!userToUnFollow) {
      return res.status(404).json({ error: ["User not found!"] });
    }
    if (!currentUser.followings.includes(userId)) {
      return res.status(400).json({ error: ["You do not follow this user!"] });
    }
    currentUser.followings = currentUser.followings.filter(
      (id) => id.toString() !== userId
    );

    userToUnFollow.followers = userToUnFollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnFollow.save();

    const updatedUser = await populateUser(User.findById(currentUser._id));

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({
      error: ["Error unfollowing user!"],
      message: error.message,
    });
  }
};

module.exports = {
  setUser,
  updateUser,
  login,
  getUserById,
  getUserByName,
  userFollows,
  userUnFollows,
};
