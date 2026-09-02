import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find({
    published: true,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  const serializedProducts = products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    category:
      product.category &&
      typeof product.category === "object" &&
      "name" in product.category
        ? {
            _id:
              "_id" in product.category && product.category._id
                ? product.category._id.toString()
                : "",
            name: String(product.category.name),
          }
        : undefined,
  }));

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          สินค้าทั้งหมด
        </h1>

        <p className="mt-2 text-gray-600">
          เลือกสินค้าที่คุณสนใจ
        </p>
      </div>

      {serializedProducts.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          ยังไม่มีสินค้า
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serializedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}
