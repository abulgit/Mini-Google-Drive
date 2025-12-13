"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!shardsRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 50;
      const y = (e.clientY - rect.top - rect.height / 2) / 50;

      const shards = shardsRef.current.querySelectorAll(".shard");
      shards.forEach((shard, i) => {
        const depth = (i + 1) * 0.5;
        (shard as HTMLElement).style.transform =
          `translate(${x * depth}px, ${y * depth}px)`;
      });
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800 pb-16 pt-20 lg:pb-24 lg:pt-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-6 flex justify-center animate-fade-up">
          <span className="border border-zinc-300 dark:border-zinc-700 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Version 2.0 is live — Intelligent Storage
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-center text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 animate-fade-up animation-delay-100 sm:text-5xl md:text-6xl lg:text-7xl">
          File management, perfected<span className="font-bold">.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-center text-base text-zinc-500 animate-fade-up animation-delay-200 sm:text-lg lg:text-xl">
          Minidrive is the high-performance workspace for your life&apos;s data.
          5GB free. Zero-knowledge encryption. Native speed.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 animate-fade-up animation-delay-300 sm:flex-row sm:gap-6">
          <button
            onClick={onGetStarted}
            className="bg-zinc-900 dark:bg-zinc-100 px-6 py-3 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
          >
            Start for free
          </button>
          <a
            href="#security"
            className="group flex items-center gap-2 border border-zinc-300 dark:border-zinc-600 px-6 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-all hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            View the architecture
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="relative mt-16 lg:mt-24" ref={shardsRef}>
          <div className="relative mx-auto max-w-4xl animate-draw-border">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-none lg:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 border border-zinc-300 dark:border-zinc-700" />
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    All Files
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900" />
                  <div className="h-6 w-6 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900" />
                </div>
              </div>

              <div className="space-y-0 animate-content-fade">
                {[
                  {
                    name: "Q3-Report.pdf",
                    size: "2.4 MB",
                    modified: "2 hours ago",
                  },
                  {
                    name: "Design-System.fig",
                    size: "18.2 MB",
                    modified: "Yesterday",
                  },
                  {
                    name: "Invoice_2024.pdf",
                    size: "340 KB",
                    modified: "3 days ago",
                  },
                  {
                    name: "Brand-Guidelines.pdf",
                    size: "5.1 MB",
                    modified: "Last week",
                  },
                ].map((file, i) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 py-3 last:border-0"
                    style={{ animationDelay: `${400 + i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900" />
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="hidden text-xs text-zinc-400 sm:block">
                        {file.size}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {file.modified}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="shard absolute -left-4 top-8 hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 transition-transform duration-300 lg:block">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500" />
              <span className="text-xs text-zinc-500">Uploading...</span>
            </div>
            <div className="mt-2 h-1 w-32 bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full w-2/3 bg-zinc-900 dark:bg-zinc-100" />
            </div>
          </div>

          <div className="shard absolute -right-4 top-24 hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 transition-transform duration-300 lg:block">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border border-zinc-300 dark:border-zinc-600" />
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                AES-256
              </span>
            </div>
            <span className="mt-1 block text-xs text-zinc-400">Encrypted</span>
          </div>

          <div className="shard absolute bottom-8 left-12 hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 transition-transform duration-300 lg:block">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Duplicate Detected
            </span>
            <div className="mt-2 flex gap-2">
              <button className="border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                Ignore
              </button>
              <button className="bg-zinc-900 dark:bg-zinc-100 px-2 py-1 text-xs text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300">
                Merge
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
