import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  wallet: {
    type: String,
  },
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
  favDeals: {
    type: Array,
    ref: "deal",
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: 'un-verified'
  },
},
{
  timestamps: true,
}
);

export const User = mongoose.model("user", userSchema);
