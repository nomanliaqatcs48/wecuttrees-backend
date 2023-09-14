import express from "express";
import {
  adminLogin,
  adminSignUp,
  adminUpdateProfile,
  getAdmins,
} from "../controller/adminController";
import { verifyJwt } from "../middlewears/verifyJwt";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/signup", adminSignUp);
adminRouter.get("/admins-list", verifyJwt, getAdmins);
adminRouter.post("/update-profile", verifyJwt, adminUpdateProfile);

export default adminRouter;
