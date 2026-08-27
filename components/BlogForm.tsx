"use client";

import { FormEvent, useState } from "react";

export default function BlogForm() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function createSlug(value: string) {
        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9ก-๙-]/g, "");
    }

    function handleTitleChange(value: string) {
        setTitle(value);
        setSlug(createSlug(value));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSubmitting(true);
            setMessage("");

            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    slug,
                    content,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message ?? "เพิ่มข้อมูลไม่สำเร็จ");
            }

            setMessage("เพิ่มข้อมูลสำเร็จ");
            setTitle("");
            setSlug("");
            setContent("");
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
                <h1> เพิ่มบทความ </h1>
                {message && (
                    <p>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label>หัวข้อเรื่อง</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            handleTitleChange(event.target.value)
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

                    <label> เนื้อหา </label>
                    <textarea
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="กรอกเนื้อหา"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "กำลังบันทึก..." : "เพิ่มข้อมูล"}
                    </button>
                </form>
            </div>
        </div>
    );
}
