import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICard extends Document {
  name: string;
  idNo: string;
  address: string;
  phone?: string;
  photo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    idNo: {
      type: String,
      required: [true, "ID Number is required"],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Reuse existing model if compiled, or compile new one
const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;
