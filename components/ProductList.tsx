import { ProductCard } from "@/components/ProductCard";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-sm text-zinc-600 sm:text-base">
          No products available right now. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
