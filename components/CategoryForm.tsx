"use client";

import { FormEvent, useState } from "react";

export default function CategoryForm() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function createSlug(value: string) {
        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9ก-๙-]/g, "");
    }

    function handleNameChange(value: string) {
        setName(value);
        setSlug(createSlug(value));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSubmitting(true);
            setMessage("");

            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    slug,
                    description,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message ?? "เพิ่มหมวดหมู่ไม่สำเร็จ");
            }

            setMessage("เพิ่มหมวดหมู่สำเร็จ");
            setName("");
            setSlug("");
            setDescription("");
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
        <div className="page">
            <div className="card">
                <h1> เพิ่มหมวดหมู่</h1>
                {message && (
                    <p>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label>ชื่อหมวดหมู่</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            handleNameChange(event.target.value)
                        }
                        required
                    />

                    <label>Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(event) =>
                            setSlug(event.target.value)
                        }
                        required
                    />

                    <label> รายละเอียด </label>
                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="กรอกรายละเอียด"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "กำลังบันทึก..." : "เพิ่มหมวดหมู่"}
                    </button>
                </form>
            </div>
        </div>
    );
}