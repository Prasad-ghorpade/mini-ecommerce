"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { convertToINR } from "@/utils/currency";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: qty });
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(0,0,0,0.12)]">
      <div className="overflow-hidden rounded-xl bg-zinc-100/80 p-3">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={400}
          className="h-48 w-full object-contain transition-all duration-300 group-hover:scale-105"
        />
      </div>

      <h2 className="mt-4 line-clamp-2 text-base font-semibold text-zinc-800">
        {product.title}
      </h2>

      <p className="mt-2 text-xl font-bold text-zinc-950">
        {convertToINR(product.price)}
      </p>

      <Link
        href={`/product/${product.id}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-[0.99]"
      >
        View Details
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 rounded-md bg-black py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 active:scale-95"
        >
          Add to Cart
        </button>

        <div className="flex items-center overflow-hidden rounded-md border border-zinc-300 bg-white">
          <button
            type="button"
            onClick={() => setQty((prevQty) => Math.max(1, prevQty - 1))}
            className="px-2 py-1 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95"
          >
            -
          </button>
          <span className="px-3 text-center text-sm text-zinc-800">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((prevQty) => prevQty + 1)}
            className="px-2 py-1 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-95"
          >
            +
          </button>
        </div>
      </div>

      {added && (
        <p className="mt-2 inline-flex w-fit rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
          {"Added to cart \u2705"}
        </p>
      )}
    </div>
  );
}
