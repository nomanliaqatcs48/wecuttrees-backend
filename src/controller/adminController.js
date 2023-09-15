import { Admin } from "../schema/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileSave } from "../util/fileHandling";

///signup
export const adminSignUp = async (req, res, next) => {
  try {
    const adminData = req.body;
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(req.body.password, salt);
    const admin = await Admin.create(adminData);
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Register successfully!",
      user: admin,
    });
  } catch (error) {
    next(error);
    res.status(500).json({ code: 500, status: "Error", error });
  }
};

//login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (admin) {
      const verifyPassword = await bcrypt.compare(password, admin.password);
      if (verifyPassword) {
        const token = jwt.sign({ id: admin._id }, "secret", {
          expiresIn: "1d",
        });
        const adminObject = admin.toObject();
        delete adminObject.password;
        res.status(200).json({
          code: 200,
          status: "Success",
          message: "Successfully logedin",
          admin: adminObject,
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

//update profile

export const adminUpdateProfile = async (req, res, next) => {
  try {
    const saveData = req.body;
    let fileName = "";

    const user = await Admin.findOne({ _id: saveData.id });
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

//get all admins
export const getAdmins = async (req, res, next) => {
  try {
    const users = await Admin.find({}).select("-password");
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Admins fetched successfully!",
      users,
    });
  } catch (error) {
    next(error);
  }
};

// delete admin

export const deleteAdmin = async (req, res, next) => {
    try {
        const user = await Admin.findByIdAndDelete({ _id: req.body.userId });
        if(user !== null){
          res.status(200).json({
            code: 200,
            status: "Success",
            message: "Admin deleted successfully!",
            user
          });
        }else{
          res.status(404).json({
            code: 404,
            status: "Error",
            message: "Admin not found!",
            user
          });
        }
    } catch (error) {
      next(error);
      res.status(500).json({ code: 500, status: "Error", error });
    }
  };
