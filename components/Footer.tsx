import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-zinc-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold">Mini eCommerce</h2>
            <p className="mt-3 text-sm text-zinc-300">
              Simple eCommerce app built with Next.js
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              <p>Kolhapur, Maharashtra, India</p>
              <p>support@example.com</p>
              <p>+91 90000 00000</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-700 pt-5 text-center text-sm text-zinc-400">
          © 2026 Mini eCommerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
