"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Check,
  AlertTriangle,
  FileText,
  Folder,
  MoreHorizontal,
} from "lucide-react";

type DuplicateStatus = "pending" | "ignored" | "merged";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<HTMLDivElement>(null);
  const [duplicateStatus, setDuplicateStatus] =
    useState<DuplicateStatus>("pending");

  // Auto-reset duplicate status after showing success
  useEffect(() => {
    if (duplicateStatus !== "pending") {
      const timer = setTimeout(() => setDuplicateStatus("pending"), 2000);
      return () => clearTimeout(timer);
    }
  }, [duplicateStatus]);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!shardsRef.current || !containerRef.current) return;

      // Cancel any pending animation frame to avoid stacking
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
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
      });
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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
            <div className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden select-none">
              {/* Mock Window Header */}
              <div className="h-10 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center px-4 justify-between">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  MiniDrive Safe
                </div>
                <div className="w-5"></div>
              </div>

              {/* Mock Window Body */}
              <div className="p-6 bg-white dark:bg-zinc-950 relative">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    All Files
                  </span>
                </div>

                <div className="space-y-1 animate-content-fade">
                  {[
                    {
                      name: "Project_Alpha_Specs.pdf",
                      size: "2.4 MB",
                      type: "pdf",
                    },
                    {
                      name: "Financials_Q3.xlsx",
                      size: "1.1 MB",
                      type: "sheet",
                    },
                    {
                      name: "Design_System_v2.fig",
                      size: "14.2 MB",
                      type: "fig",
                    },
                    {
                      name: "Architecture_Review.docx",
                      size: "890 KB",
                      type: "doc",
                    },
                  ].map((file, i) => (
                    <div
                      key={file.name}
                      className="group flex items-center justify-between py-3 px-2 border-b border-dashed border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-default"
                      style={{ animationDelay: `${400 + i * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        {file.type === "pdf" ? (
                          <FileText className="w-4 h-4 text-zinc-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-zinc-500" />
                        )}
                        <span className="text-sm text-zinc-900 dark:text-zinc-100">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-8">
                        <span className="text-xs text-zinc-500 font-tabular-nums">
                          {file.size}
                        </span>
                        <MoreHorizontal className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                      </div>
                    </div>
                  ))}

                  {/* Animated Upload Row */}
                  <motion.div
                    className="flex items-center justify-between py-3 px-2 bg-zinc-50/50 dark:bg-zinc-900/50"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-4 h-4 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span className="text-sm text-zinc-500 italic">
                        Uploading Files
                        <span className="inline-flex w-4">
                          {[0, 1, 2].map(i => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 1, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                times: [0, 0.1, 0.7, 1],
                              }}
                            >
                              .
                            </motion.span>
                          ))}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Uploading Box */}
          <div className="shard absolute -left-4 top-8 hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 will-change-transform lg:block">
            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 bg-emerald-500 rounded-full"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-xs text-zinc-500">
                Uploading
                <span className="inline-flex w-4">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        times: [0, 0.1, 0.7, 1],
                      }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
              </span>
            </div>
            <div className="mt-2 h-1 w-32 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full bg-zinc-900 dark:bg-zinc-100"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          {/* Encryption Box */}
          <div className="shard absolute -right-4 top-24 hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 will-change-transform lg:block">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              >
                <Lock className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </motion.div>
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                AES-256
              </span>
            </div>
            <span className="mt-1 block text-xs text-zinc-400">Encrypted</span>
          </div>

          {/* Duplicate Detected Box */}
          <div className="shard absolute bottom-20 left-12 hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 will-change-transform lg:block">
            <AnimatePresence mode="wait">
              {duplicateStatus === "pending" ? (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    </motion.div>
                    <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                      Duplicate Detected
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <motion.button
                      className="border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs text-zinc-500"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(0,0,0,0.02)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDuplicateStatus("ignored")}
                    >
                      Ignore
                    </motion.button>
                    <motion.button
                      className="bg-zinc-900 dark:bg-zinc-100 px-2 py-1 text-xs text-white dark:text-zinc-900"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDuplicateStatus("merged")}
                    >
                      Merge
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {duplicateStatus === "ignored"
                      ? "Ignored Successfully"
                      : "Merged Successfully"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
