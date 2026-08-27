import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogCard, {
  type BlogCardData,
} from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "บทความ",
  description: "รวมบทความและข่าวสารล่าสุด",
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  await connectDB();

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .lean();

  const serializedBlogs: BlogCardData[] = blogs.map((blog) => ({
    _id: blog._id.toString(),
    title: String(blog.title ?? ""),
    slug: String(blog.slug ?? ""),
    content: String(blog.content ?? ""),
    createdAt: blog.createdAt
      ? new Date(blog.createdAt).toISOString()
      : "",
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        บทความทั้งหมด
      </h1>

      {serializedBlogs.length === 0 ? (
        <p className="text-gray-500">
          ยังไม่มีบทความ
        </p>
      ) : (
        <section
          aria-label="รายการบทความ"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {serializedBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
            />
          ))}
        </section>
      )}
    </main>
  );
}