import mongoose from "mongoose";

const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const dealSchema = new Schema(
  {
    coinName: {
      type: String,
      required: true,
    },
    coinAddress: {
      type: String,
      required: true,
    },
    targetPrice: {
      type: String,
      required: true,
    },
    stopLossPrice: {
      type: String,
      required: true,
    },
    entryPrice: {
      type: String,
      required: true,
    },
    dealEndTime: {
      type: Date,
      required: true,
    },
    ownerId: {
      type: objectId,
      ref: "user",
      required: true,
    },
    dealId: {
      type: String,
      required: true,
    },
    dealerId: {
      type: String,
      required: true,
    },
    participators: {
      type: Array,
      ref: "participators",
      required: false,
    },
    favoriteBy: {
      type: Array,
      ref: "user",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Deal = mongoose.model("deal", dealSchema);
