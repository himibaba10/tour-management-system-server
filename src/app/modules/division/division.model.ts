import { Schema, model, Document } from "mongoose";

export interface IDivision extends Document {
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
}

const DivisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Division = model<IDivision>("Division", DivisionSchema);
