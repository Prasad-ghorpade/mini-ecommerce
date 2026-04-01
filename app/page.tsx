"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getProducts } from "@/services/api";
import { ProductList } from "@/components/ProductList";
import { convertToINR } from "@/utils/currency";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: session, status } = useSession();
  const { cart, removeFromCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const activeEmail = session?.user?.email || user?.email || null;

  useEffect(() => {
    setMounted(true);

    if (status === "loading") {
      return;
    }

    if (!activeEmail) {
      router.replace("/login");
      return;
    }

    let isActive = true;

    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        if (isActive) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [activeEmail, status, router]);

  if (!mounted) {
    return null;
  }

  if (status === "loading") {
    return null;
  }

  if (!activeEmail) {
    return null;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <p className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
          Loading products...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100/60 px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Browse our latest collection and find what suits you best
          </p>
          <div className="mt-5 h-px w-full bg-zinc-200" />
        </div>

        <ProductList products={products} />

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-zinc-900">Cart Items</h2>

          {cart.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 sm:text-base">
              Your cart is empty.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-all duration-200 hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    <p className="text-sm text-zinc-600">
                      {convertToINR(item.price)}
                    </p>
                    <p className="text-sm text-zinc-600">Qty: {item.quantity}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-500 active:scale-95"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
