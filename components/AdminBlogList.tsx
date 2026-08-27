"use client";

import { useState } from "react";
import BlogCard, {
  type BlogCardData,
} from "@/components/BlogCard";

type AdminBlogListProps = {
  initialBlogs: BlogCardData[];
};

type BlogFormData = {
  title: string;
  slug: string;
  content: string;
};

export default function AdminBlogList({
  initialBlogs,
}: AdminBlogListProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    content: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  function startEditing(blog: BlogCardData) {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
    });
  }

  async function handleUpdate(id: string) {
    if (!formData.title.trim()) {
      alert("กรุณาระบุชื่อบทความ");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "แก้ไขบทความไม่สำเร็จ");
      }

      setBlogs((currentBlogs) =>
        currentBlogs.map((blog) =>
          blog._id === id ? result.blog : blog,
        ),
      );

      cancelEditing();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "แก้ไขบทความไม่สำเร็จ",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "คุณต้องการลบบทความนี้ใช่หรือไม่?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ลบบทความไม่สำเร็จ");
      }

      setBlogs((currentBlogs) =>
        currentBlogs.filter((blog) => blog._id !== id),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "ลบบทความไม่สำเร็จ",
      );
    }
  }

  if (blogs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
        ยังไม่มีบทความ
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {blogs.map((blog) => {
        const isEditing = editingId === blog._id;

        return (
          <div
            key={blog._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {isEditing ? (
              <div className="space-y-4">
                <input
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      title: event.target.value,
                    })
                  }
                  placeholder="ชื่อบทความ"
                  className="w-full rounded-lg border px-4 py-2"
                />

                <input
                  value={formData.slug}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      slug: event.target.value,
                    })
                  }
                  placeholder="Slug"
                  className="w-full rounded-lg border px-4 py-2"
                />

                <textarea
                  value={formData.content}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      content: event.target.value,
                    })
                  }
                  placeholder="เนื้อหา HTML"
                  rows={10}
                  className="w-full rounded-lg border px-4 py-2"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdate(blog._id)}
                    disabled={isSaving}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-lg border px-4 py-2"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <>
                <BlogCard blog={blog} />

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEditing(blog)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    แก้ไข
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(blog._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    ลบ
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
