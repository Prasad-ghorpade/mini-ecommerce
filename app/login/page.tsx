"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const activeEmail = session?.user?.email || user?.email || null;

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (activeEmail) {
      router.replace("/");
    }
  }, [activeEmail, status, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isLoggedIn = login(email, password);

    if (isLoggedIn) {
      router.push("/");
      return;
    }

    alert("Invalid credentials");
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  if (status === "loading" || activeEmail) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-5 text-center text-2xl font-bold text-zinc-900">
          Login
        </h1>

        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          placeholder="Enter your email"
          required
        />

        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          placeholder="Enter your password"
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 font-medium text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.99]"
        >
          Login
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs font-medium tracking-wide text-zinc-500">
            OR
          </span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 active:scale-[0.99]"
        >
          <span className="font-semibold text-red-500">G</span>
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Use admin@gmail.com / 123456 to login
        </p>
      </form>
    </main>
  );
}
