import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  displayName: {
    type: String,
    unique: false,
    default: "Unnamed",
    required: true,
  },
  email: {
    type: String,
    unique: false,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
},
{
    timestamps: true,
}
);

export const Admin = mongoose.model("admin", adminSchema);
