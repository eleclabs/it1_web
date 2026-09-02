import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category?: {
      _id: string;
      name: string;
    };
  };
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
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

      <div className="space-y-2 p-4">
        {product.category && (
          <p className="text-sm text-gray-500">
            {product.category.name}
          </p>
        )}

        <h2 className="text-lg font-semibold">
          {product.name}
        </h2>

        <p className="line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">
            ฿
            {product.price.toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}
          </p>

          <p className="text-sm text-gray-500">
            คงเหลือ {product.stock}
          </p>
        </div>
      </div>
    </article>
  );
}