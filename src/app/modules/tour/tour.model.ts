import { Schema, model } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const TourTypeSchema = new Schema<ITourType>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export const TourType = model<ITourType>("TourType", TourTypeSchema);

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
  },
  { timestamps: true }
);

const Tour = model<ITour>("Tour", TourSchema);

export default Tour;
