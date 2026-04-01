"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { convertToINR } from "@/utils/currency";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart } = useCart();
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert("Checkout is under development");
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">
          Your Cart
        </h1>
        <p className="mb-8 text-sm text-zinc-500 sm:text-base">
          Review your items before checkout
        </p>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <p className="text-zinc-700">Cart is empty</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-4 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.99]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={128}
                    height={128}
                    className="h-24 w-24 rounded-lg object-cover bg-zinc-100"
                  />

                  <div className="flex-1">
                    <h2 className="line-clamp-2 text-base font-semibold text-zinc-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Unit Price: {convertToINR(item.price)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                      Item Total: {convertToINR(item.price * item.quantity)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-500 active:scale-[0.98]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-zinc-900">
                Billing Summary
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    {convertToINR(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Delivery Charges</span>
                  <span className="font-medium text-green-700">Free</span>
                </div>
              </div>

              <div className="my-4 h-px w-full bg-zinc-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-zinc-900">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-zinc-900">
                  {convertToINR(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-5 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.99]"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
