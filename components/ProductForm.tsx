"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface UploadResult {
  imageUrl: string;
  imagePublicId: string;
}

const initialForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
  imagePublicId: "",
  published: true,
};

export default function ProductForm() {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCategories(data.categories);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "โหลดหมวดหมู่ไม่สำเร็จ"
      );
    }
  }

  function createSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9ก-๙-]/g, "");
  }

  function handleNameChange(value: string) {
    setForm((previous) => ({
      ...previous,
      name: value,
      slug: createSlug(value),
    }));
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResult & { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "อัปโหลดรูปไม่สำเร็จ");
      }

      setForm((previous) => ({
        ...previous,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
      }));

      setMessage("อัปโหลดรูปสำเร็จ");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "อัปโหลดรูปไม่สำเร็จ"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.imageUrl || !form.imagePublicId) {
      setMessage("กรุณาอัปโหลดรูปสินค้าก่อน");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "เพิ่มสินค้าไม่สำเร็จ");
      }

      setMessage("เพิ่มสินค้าสำเร็จ");
      setForm(initialForm);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาด"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-4 rounded-xl border p-6"
    >
      <h1 className="text-2xl font-bold">เพิ่มสินค้า</h1>

      <div>
        <label className="mb-1 block font-medium">
          ชื่อสินค้า
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(event) =>
            handleNameChange(event.target.value)
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Slug</label>

        <input
          type="text"
          value={form.slug}
          onChange={(event) =>
            setForm({
              ...form,
              slug: event.target.value,
            })
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          รายละเอียดสินค้า
        </label>

        <textarea
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
          className="min-h-32 w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-medium">
            ราคา
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              setForm({
                ...form,
                price: event.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            จำนวนสินค้า
          </label>

          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) =>
              setForm({
                ...form,
                stock: event.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          หมวดหมู่
        </label>

        <select
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value,
            })
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        >
          <option value="">เลือกหมวดหมู่</option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          รูปสินค้า
        </label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full rounded-lg border px-3 py-2"
        />

        {uploading && (
          <p className="mt-2 text-sm">
            กำลังอัปโหลดรูป...
          </p>
        )}
      </div>

      {form.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border">
          <Image
            src={form.imageUrl}
            alt={form.name || "ตัวอย่างรูปสินค้า"}
            fill
            className="object-contain"
          />
        </div>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) =>
            setForm({
              ...form,
              published: event.target.checked,
            })
          }
        />

        แสดงสินค้า
      </label>

      {message && (
        <p className="rounded-lg bg-gray-100 p-3">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "กำลังบันทึก..." : "เพิ่มสินค้า"}
      </button>
    </form>
  );
}
