import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;
    let count = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});

const Division = model<IDivision>("Division", divisionSchema);

export default Division;
