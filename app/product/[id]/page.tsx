"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import { convertToINR } from "@/utils/currency";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const { cart, addToCart, removeFromCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const productId = Number(params.id);

    if (!productId || Number.isNaN(productId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);

        if (isActive && data) {
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        if (isActive) {
          setNotFound(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isActive = false;
    };
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart({ ...product, quantity: qty });
  };

  const handleRemoveFromCart = () => {
    if (!product) {
      return;
    }

    removeFromCart(product.id);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <p className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
          Loading product...
        </p>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <p className="rounded-xl border border-zinc-200 bg-white px-6 py-5 text-zinc-700 shadow-sm">
          Product not found.
        </p>
      </main>
    );
  }

  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100/70 px-4 py-10 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8 lg:grid-cols-2 lg:gap-10">
        <section className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="overflow-hidden rounded-xl bg-white p-4">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={800}
              height={700}
              className="h-80 w-full object-contain transition-all duration-300 group-hover:scale-105 sm:h-[26rem]"
            />
          </div>
        </section>

        <section className="flex flex-col">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-5 text-3xl font-extrabold text-zinc-950">
            {convertToINR(product.price)}
          </p>

          <div className="my-6 h-px w-full bg-zinc-200" />

          <p className="max-w-prose text-zinc-600 leading-7">
            {product.description}
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-md border border-zinc-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((prevQty) => Math.max(1, prevQty - 1))}
                  className="px-2 py-1 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95"
                >
                  -
                </button>
                <span className="px-3 text-center text-sm text-zinc-800">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((prevQty) => prevQty + 1)}
                  className="px-2 py-1 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95"
                >
                  +
                </button>
              </div>

              {!isInCart ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 active:scale-95"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveFromCart}
                  className="flex-1 rounded-md border border-red-500 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-95"
                >
                  Remove from Cart
                </button>
              )}
            </div>

            {isInCart && (
              <p className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                Added to Cart
              </p>
            )}

            <div className="mt-4 h-px w-full bg-zinc-200" />

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-zinc-600 sm:grid-cols-3">
              <p>Free delivery</p>
              <p>Secure checkout</p>
              <p>Easy returns</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
