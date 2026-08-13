import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDP extends Document {
    name: string;
    frameType: "circle" | "square" | "poster";
    originalPhoto: string | null;
    processedPhoto: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const DPSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            default: "Anonymous",
        },
        frameType: {
            type: String,
            enum: ["circle", "square", "poster"],
            required: true,
            default: "circle",
        },
        originalPhoto: {
            type: String,
            default: null,
        },
        processedPhoto: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "tiranga_dps",
    }
);

const DP: Model<IDP> =
    mongoose.models.DP || mongoose.model<IDP>("DP", DPSchema);

export default DP;
