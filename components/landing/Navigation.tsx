"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface NavigationProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function Navigation({ onSignIn, onGetStarted }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 h-[60px] border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-200 ${
        scrolled ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm" : ""
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Minidrive
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-500"
          >
            Features
          </Link>
          <Link
            href="#security"
            className="text-sm text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-500"
          >
            Security
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-500"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onSignIn}
            className="hidden text-sm text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-500 sm:block"
          >
            Sign in
          </button>
          <button
            onClick={onGetStarted}
            className="bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
