import mongoose from "mongoose";

const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const participatorsSchema = new Schema(
  {
    userId: {
      type: objectId,
      ref: "user",
      required: true,
    },
    dealId: {
      type: objectId,
      ref: "deal",
      required: true,
    },
    tokens: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Participators = mongoose.model(
  "participators",
  participatorsSchema
);
