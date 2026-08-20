import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error("GET categories error:", error);

    return NextResponse.json(
      { message: "ไม่สามารถโหลดหมวดหมู่ได้" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase();
    const description = String(body.description ?? "").trim();

    if (!name || !slug) {
      return NextResponse.json(
        { message: "กรุณากรอกชื่อและ slug" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "ชื่อหรือ slug นี้มีอยู่แล้ว" },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
    });

    return NextResponse.json(
      {
        message: "เพิ่มหมวดหมู่สำเร็จ",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST category error:", error);

    return NextResponse.json(
      { message: "ไม่สามารถเพิ่มหมวดหมู่ได้" },
      { status: 500 }
    );
  }
}

