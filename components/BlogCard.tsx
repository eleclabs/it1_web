import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "บทความ",
    description: "รวมบทความและข่าวสารล่าสุด",
};

export const dynamic = "force-dynamic";

export type BlogCardData = {
    _id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: string;
};

type BlogCardProps = {
    blog: BlogCardData;
};

function formatDate(date: string) {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function BlogCard({ blog }: BlogCardProps) {
    const formattedDate = formatDate(blog.createdAt);

    return (
        <article className="flex min-h-64 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {formattedDate && (
                <time
                    dateTime={blog.createdAt}
                    className="text-sm text-gray-500"
                >
                    {formattedDate}
                </time>
            )}

            <Link
                href={`/blogs/${blog._id}`}
                className="group"
            >
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    {blog.title || "ไม่มีชื่อบทความ"}
                </h2>
            </Link>
            {blog.slug && (
                <p className="mt-1 text-sm text-green-700">
                    #{blog.slug}
                </p>
            )}

            {blog.content ? (
                <div
                    className="prose prose-sm mt-4 max-w-none leading-7 text-gray-600
            prose-headings:text-gray-900
            prose-a:text-green-700
            prose-strong:text-gray-900
            prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{
                        __html: blog.content,
                    }}
                />
            ) : (
                <p className="mt-4 text-sm leading-7 text-gray-600">
                    บทความนี้ยังไม่มีรายละเอียด
                </p>
            )}
        </article>
    );
}