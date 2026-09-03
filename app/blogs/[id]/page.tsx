import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

type BlogDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getBlog(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectDB();

  return Blog.findById(id).lean();
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "ไม่พบบทความ",
    };
  }

  return {
    title: String(blog.title ?? "บทความ"),
    description: String(blog.content ?? "").replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  const title = String(blog.title ?? "ไม่มีชื่อบทความ");
  const slug = String(blog.slug ?? "");
  const content = String(blog.content ?? "");

  const createdAt = blog.createdAt
    ? new Date(blog.createdAt).toISOString()
    : "";

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link
        href="/blogs"
        className="mb-8 inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900"
      >
        ← กลับไปหน้าบทความ
      </Link>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        {formattedDate && (
          <time
            dateTime={createdAt}
            className="text-sm text-gray-500"
          >
            {formattedDate}
          </time>
        )}

        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>

        {slug && (
          <p className="mt-3 text-sm text-green-700">
            #{slug}
          </p>
        )}

        {content ? (
          <div
            className="prose prose-sm mt-8 max-w-none leading-8 text-gray-700
              prose-headings:text-gray-900
              prose-a:text-green-700
              prose-strong:text-gray-900
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        ) : (
          <p className="mt-8 text-gray-500">
            บทความนี้ยังไม่มีรายละเอียด
          </p>
        )}
      </article>
    </main>
  );
}
