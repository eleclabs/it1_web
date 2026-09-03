import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

type ProductDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

type CategoryData = {
    _id: mongoose.Types.ObjectId;
    title?: string;
};

async function getProduct(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    await connectDB();

    const product = await Product.findById(id)
        .populate("category")
        .lean();

    if (!product) {
        return null;
    }

    return product as typeof product & {
        category?: CategoryData | null;
    };
}

function stripHtml(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export async function generateMetadata({
    params,
}: ProductDetailPageProps): Promise<Metadata> {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) {
        return {
            title: "ไม่พบสินค้า",
            description: "ไม่พบสินค้าที่คุณกำลังค้นหา",
        };
    }

    const name = String(product.name ?? "สินค้า");

    const description = stripHtml(
        String(product.description ?? "")
    );

    return {
        title: name,
        description: description.slice(0, 300),
    };
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { id } = await params;

    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const name = String(
        product.name ?? "ไม่มีชื่อสินค้า"
    );

    const category = String(
        product.category?.title ?? ""
    );

    const description = String(
        product.description ?? ""
    );

    const createdAt = product.createdAt
        ? new Date(product.createdAt).toISOString()
        : "";

    const formattedDate = product.createdAt
        ? new Date(product.createdAt).toLocaleDateString(
            "th-TH",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        )
        : "";

    return (
        <main className="mx-auto w-full max-w-4xl px-6 py-10">

            <Link
                href="/products"
                className="mb-8 inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900"
            >
                ← กลับไปหน้าสินค้า
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

                <div className="relative aspect-square w-full bg-gray-100">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        25vw
                        "
                        className="object-cover"
                    />
                </div>

                <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                    {name}
                </h1>
                {product.stock && (
                    <p className="mt-4 text-sm text-gray-500">
                        คงเหลือ: {product.stock}
                    </p>
                )}

                {category && (
                    <p className="mt-3 text-sm text-green-700">
                        #{category}
                    </p>
                )}

                {description ? (
                    <div
                        className="
                            prose prose-sm mt-8 max-w-none
                            leading-8 text-gray-700
                            prose-headings:text-gray-900
                            prose-a:text-green-700
                            prose-strong:text-gray-900
                            prose-img:rounded-xl
                            "
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                    />
                    
                ) : (
                    <p className="mt-8 text-gray-500">
                        สินค้าชิ้นนี้ยังไม่มีรายละเอียด
                    </p>
                )}

            </article>

        </main>
    );
}