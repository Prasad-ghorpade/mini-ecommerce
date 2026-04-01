"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";

type ProfileModalProps = {
  onClose: () => void;
};

type AuthView = "signin" | "signup";

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { login, signup } = useAuth();
  const { status } = useSession();
  const [view, setView] = useState<AuthView>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      onClose();
    }
  }, [status, onClose]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const switchView = (nextView: AuthView) => {
    setView(nextView);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (view === "signin") {
      const isLoggedIn = login(email, password);

      if (!isLoggedIn) {
        setError("Invalid credentials");
        return;
      }

      setSuccess("Login successful");
      setTimeout(() => {
        handleClose();
      }, 500);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const isSignedUp = signup(email, password);

    if (!isSignedUp) {
      setError("Account already exists or input is invalid.");
      return;
    }

    setSuccess("Account created successfully");
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleGoogleSignIn = () => {
    setError("");
    setSuccess("Redirecting to Google...");
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-200 ${
        animateIn ? "bg-black/45 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 sm:p-7 ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">
            {view === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-lg bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => switchView("signin")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              view === "signin"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchView("signup")}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              view === "signup"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) {
                setError("");
              }
              if (success) {
                setSuccess("");
              }
            }}
            placeholder="Email"
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) {
                setError("");
              }
              if (success) {
                setSuccess("");
              }
            }}
            placeholder="Password"
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />

          {view === "signup" && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (error) {
                  setError("");
                }
                if (success) {
                  setSuccess("");
                }
              }}
              placeholder="Confirm password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-700 active:scale-[0.99]"
          >
            {view === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

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
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-all duration-200 hover:bg-zinc-50 active:scale-[0.99]"
        >
          <span className="text-base font-semibold text-red-500">G</span>
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-zinc-500">
          {view === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchView(view === "signin" ? "signup" : "signin")}
            className="font-semibold text-zinc-800 transition-all duration-200 hover:text-orange-500"
          >
            {view === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
