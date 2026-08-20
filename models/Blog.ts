import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    content: String,
  },
  { timestamps: true }
);

export default mongoose.models.Blog || 
mongoose.model("Blog", BlogSchema);
