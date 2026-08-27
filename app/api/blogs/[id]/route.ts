import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "รหัสบทความไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const slug = String(body.slug ?? "").trim();
    const content = String(body.content ?? "");

    if (!title) {
      return NextResponse.json(
        { message: "กรุณาระบุชื่อบทความ" },
        { status: 400 },
      );
    }

    await connectDB();

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!blog) {
      return NextResponse.json(
        { message: "ไม่พบบทความ" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      blog: {
        _id: blog._id.toString(),
        title: String(blog.title ?? ""),
        slug: String(blog.slug ?? ""),
        content: String(blog.content ?? ""),
        createdAt: blog.createdAt
          ? new Date(blog.createdAt).toISOString()
          : "",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "ไม่สามารถแก้ไขบทความได้" },
      { status: 500 },
    );
  }
}

export async function DELETE( _request: Request, context: RouteContext,) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "รหัสบทความไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    await connectDB();

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { message: "ไม่พบบทความ" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "ลบบทความเรียบร้อยแล้ว",
    });
  } catch {
    return NextResponse.json(
      { message: "ไม่สามารถลบบทความได้" },
      { status: 500 },
    );
  }
}