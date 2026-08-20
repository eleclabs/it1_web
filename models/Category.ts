import mongoose, { Model, Schema } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "กรุณากรอกชื่อหมวดหมู่"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: [true, "กรุณากรอก slug"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;