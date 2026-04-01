"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { convertToINR } from "@/utils/currency";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="rounded-lg border border-zinc-200 bg-white p-4 text-zinc-700 shadow-sm">
            Cart is empty
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="h-20 w-20 rounded-md object-cover bg-zinc-100"
                />

                <div className="flex-1">
                  <h2 className="text-base font-medium text-zinc-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-zinc-700">
                    {convertToINR(item.price)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">Qty: {item.quantity}</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
