import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import AdminBlogList from "@/components/AdminBlogList";
import BlogForm from "@/components/BlogForm";
import type { BlogCardData } from "@/components/BlogCard";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
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
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">จัดการบทความ</h1>
        <p className="mt-2 text-gray-600">
          เพิ่ม แก้ไข และลบบทความ
        </p>
      </div>

      <BlogForm />

      <AdminBlogList initialBlogs={serializedBlogs} />
    </main>
  );
}