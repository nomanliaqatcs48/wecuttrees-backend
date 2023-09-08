import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../schema/user";
import { fileSave } from "../util/fileHandling";

///signup
export const signUp = async (req, res, next) => {
  try {
    const userData = req.body;
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(userData);
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Sign up successfully!",
      user: user,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (user) {
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (verifyPassword) {
        const token = jwt.sign({ id: user._id }, "secret", {
          expiresIn: "1d",
        });
        const userObject = user.toObject();
        delete userObject.password;
        res.status(200).json({
          code: 200,
          status: "Success",
          message: "Successfully logedin",
          user: userObject,
          token,
        });
      } else {
        res.status(400).json({
          code: 400,
          status: "Error",
          message: "Invalid email/password",
        });
      }
    } else {
      res.status(400).json({
        code: 400,
        status: "Error",
        message: "Invalid email/password",
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//connnect wallet

export const connectWallet = async (req, res, next) => {
  try {
    const { userId, wallet } = req.body;
    const user = await User.findById({ _id: userId });
    if (user) {
      if (user.wallet !== undefined && user.wallet === wallet.toLowerCase()) {
        const userObject = user.toObject();
        delete userObject.password;
        res.status(200).json({
          code: 200,
          status: "Success",
          message: "Wallet connected!",
          user: userObject,
        });
      } else if (user.wallet === undefined) {
        user.wallet = wallet.toLowerCase();
        await user.save();
        const userObject = user.toObject();
        delete userObject.password;
        res.status(200).json({
          code: 200,
          status: "Success",
          message: "Wallet registered successfully!",
          user: userObject,
        });
      } else {
        res.status(400).json({
          code: 400,
          status: "Error",
          message: "Please connect your registered wallet!",
        });
      }
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//get all users
export const getUsers = (req, res, next) => {
  try {
    res.status(200).json({ message: "get all users" });
  } catch (error) {
    next(error);
  }
};

//update profile

export const updateProfile = async (req, res, next) => {
  try {
    const saveData = req.body;
    let fileName = "";

    const user = await User.findOne({ _id: saveData.id });
    // console.log('user ====>', user)
    // console.log('saveData ====>', saveData)
    if (user) {
      if (req.body.password !== undefined && req.body.password !== "") {
        const salt = await bcrypt.genSalt(10);
        const comparePassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!comparePassword) {
          return res.status(400).json({
            code: 400,
            status: "Error",
            message: "Invalid password",
          });
        } else {
          saveData.password = await bcrypt.hash(req.body.updatedPassword, salt);
          user.password = saveData.password || user.password;
        }
      }
      if (saveData.profilePicture && saveData.profilePicture !== "") {
        fileName = fileSave(saveData.profilePicture);
        user.profilePicture = fileName || user.profilePicture;
        if (!fileName) {
          return res.status(400).json({
            code: 400,
            status: "Error",
            message: "Error while uploading file",
          });
        }
      }
      user.displayName = saveData.displayName || user.displayName;
      user.email = saveData.email || user.email;

      await user.save();
      const userObject = user.toObject();
      delete userObject.password;
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Profile updated!",
        user: userObject,
      });
    }
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};
