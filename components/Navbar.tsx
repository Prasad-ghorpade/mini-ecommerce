"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ProfileModal } from "@/components/ProfileModal";

export function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const sessionEmail = session?.user?.email ?? null;
  const activeEmail = sessionEmail || user?.email || null;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-xl font-bold text-zinc-900 transition-all duration-200 hover:text-orange-500"
        >
          Mini eCommerce
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-4 hidden max-w-xl flex-1 items-center sm:flex"
        >
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-l-md border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="rounded-r-md bg-orange-500 px-4 py-2 text-white transition-all duration-200 hover:bg-orange-600"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden rounded-md border border-orange-500 px-4 py-2 text-orange-500 transition-all duration-200 hover:bg-orange-500 hover:text-white md:block"
          >
            Track Order
          </button>

          <Link
            href="/cart"
            className="relative inline-flex items-center text-2xl transition-all duration-200 hover:opacity-80"
            aria-label="Cart"
          >
            <span role="img" aria-hidden="true">
              {"\u{1F6D2}"}
            </span>
            <span className="absolute top-0 right-0 rounded-full bg-orange-500 px-1 text-xs text-white">
              {cart.length}
            </span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!activeEmail) {
                  setIsAuthModalOpen(true);
                  return;
                }

                setIsUserPanelOpen((prev) => !prev);
              }}
              className="rounded-full bg-zinc-100 p-2 transition-all duration-200 hover:bg-zinc-200"
              aria-label="Open profile"
            >
              <span className="text-sm" role="img" aria-hidden="true">
                {"\u{1F464}"}
              </span>
            </button>

            {activeEmail && isUserPanelOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Logged in as
                </p>
                <p className="mt-1 truncate text-sm font-medium text-zinc-900">
                  {activeEmail}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (sessionEmail) {
                      await signOut({ redirect: false });
                    }
                    logout();
                    setIsUserPanelOpen(false);
                  }}
                  className="mt-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 active:scale-[0.99]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isAuthModalOpen && (
        <ProfileModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </header>
  );
}
