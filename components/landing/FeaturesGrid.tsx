"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Copy, File, RotateCcw, Search, Trash2 } from "lucide-react";

export function FeaturesGrid() {
  return (
    <section
      id="features"
      className="border-b border-zinc-200 dark:border-zinc-800 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Core Features
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-5xl">
            Intelligent by design<span className="font-bold">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 md:grid-cols-2 lg:grid-cols-3">
          <ActivityCard />
          <DuplicateCard />
          <SearchCard />
          <TrashCard />
        </div>
      </div>
    </section>
  );
}

function ActivityCard() {
  const [isActive, setIsActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const showTimer = setTimeout(() => setShowTooltip(true), 800);
    const hideTimer = setTimeout(() => setShowTooltip(false), 3000);
    const loopTimer = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2200);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(loopTimer);
    };
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className="relative bg-white dark:bg-zinc-950 p-8 lg:col-span-2 lg:p-10"
    >
      <div className="flex items-start gap-3">
        <Activity className="h-5 w-5 text-zinc-400" />
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Activity
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        Total visibility.
      </h3>
      <p className="mt-2 text-zinc-500">
        Track every movement. See who viewed, downloaded, or modified a file in
        real-time.
      </p>

      <div className="mt-8 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4">
        <div className="space-y-0">
          {[
            {
              name: "Madison Scott",
              action: "Downloaded 'Q3-Report.pdf'",
              time: "20m ago",
              highlight: true,
            },
            {
              name: "Alex Chen",
              action: "Viewed 'Design-System.fig'",
              time: "1h ago",
              highlight: false,
            },
            {
              name: "Jordan Lee",
              action: "Modified 'Brand-Guidelines'",
              time: "3h ago",
              highlight: false,
            },
            {
              name: "Sam Parker",
              action: "Uploaded 'Invoice_2024.pdf'",
              time: "5h ago",
              highlight: false,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`relative flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 py-3 last:border-0 transition-colors duration-300 ${
                item.highlight && isActive ? "bg-zinc-100 dark:bg-zinc-800" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center text-xs font-medium text-zinc-500">
                  {item.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </span>
              </div>
              <span className="text-xs text-zinc-400">{item.time}</span>
              {item.highlight && showTooltip && (
                <div className="absolute left-0 top-full z-10 mt-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 shadow-none animate-fade-in">
                  <span className="text-xs text-zinc-500">{item.action}</span>
                  <span className="ml-2 text-xs text-zinc-400">
                    — {item.time}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DuplicateCard() {
  const [merged, setMerged] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const animate = () => {
            setTimeout(() => setMerged(true), 500);
            setTimeout(() => setMerged(false), 3000);
          };
          animate();
          const interval = setInterval(animate, 4000);
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white dark:bg-zinc-950 p-8 lg:p-10"
    >
      <div className="flex items-start gap-3">
        <Copy className="h-5 w-5 text-zinc-400" />
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Deduplication
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        Zero redundancy.
      </h3>
      <p className="mt-2 text-zinc-500">
        Automatic hash-matching identifies and merges duplicate files.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4 h-24">
        <div
          className={`relative h-16 w-14 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 transition-all duration-500 ${
            merged ? "translate-x-6 opacity-0" : ""
          }`}
        >
          <div className="absolute -right-1 -top-1 h-3 w-3 border-l border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950" />
        </div>
        <div className="relative h-16 w-14 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
          <div className="absolute -right-1 -top-1 h-3 w-3 border-l border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950" />
          {merged && (
            <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-xs text-white dark:text-zinc-900 animate-fade-in">
              1
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchCard() {
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const animate = () => {
            let i = 0;
            const text = "inv...";
            setSearchText("");
            setShowDropdown(false);

            intervalRef.current = setInterval(() => {
              if (i <= text.length) {
                setSearchText(text.slice(0, i));
                i++;
              } else {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setShowDropdown(true);
                setTimeout(() => {
                  setShowDropdown(false);
                  setSearchText("");
                }, 2000);
              }
            }, 100);
          };

          animate();
          const loopInterval = setInterval(animate, 4000);
          return () => {
            clearInterval(loopInterval);
            if (intervalRef.current) clearInterval(intervalRef.current);
          };
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white dark:bg-zinc-950 p-8 pb-28 lg:p-10 lg:pb-32"
    >
      <div className="flex items-start gap-3">
        <Search className="h-5 w-5 text-zinc-400" />
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Search
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        Deep Query.
      </h3>
      <p className="mt-2 text-zinc-500">
        Search inside PDFs, Docs, and code snippets.
      </p>

      <div className="mt-8 relative">
        <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
          <span className="text-sm text-zinc-900 dark:text-zinc-100">
            {searchText}
          </span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="inline-block text-zinc-400"
          >
            |
          </motion.span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={showDropdown ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full border border-t-0 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
            <span className="text-sm">
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                Inv
              </strong>
              <span className="text-zinc-500">oice_2024.pdf</span>
            </span>
          </div>
          <div className="px-4 py-3">
            <span className="text-sm">
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                Inv
              </strong>
              <span className="text-zinc-500">estment_Plan.docx</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TrashCard() {
  return (
    <div className="relative bg-white dark:bg-zinc-950 p-8 lg:col-span-2 lg:p-10">
      <div className="flex items-start gap-3">
        <Trash2 className="h-5 w-5 text-zinc-400" />
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Recovery
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        Forgiving, yet secure.
      </h3>
      <p className="mt-2 text-zinc-500">
        30-day retention for deleted items. One-click restoration.
      </p>

      <div className="mt-8 relative w-full h-40 sm:h-48 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex overflow-hidden">
        {/* Active Panel */}
        <div className="w-1/2 h-full border-r border-zinc-100 dark:border-zinc-800 p-3 sm:p-4 relative">
          <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
            Active
          </span>
          <motion.div
            animate={{
              x: [0, 100, 100, 0],
              opacity: [1, 0, 0, 1],
            }}
            transition={{
              duration: 4,
              times: [0.2, 0.4, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="mt-6 sm:mt-8 w-full p-2 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-zinc-900 z-10 relative"
          >
            <File className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
            <div className="w-12 sm:w-20 h-2 bg-zinc-100 dark:bg-zinc-800" />
          </motion.div>
        </div>

        {/* Trash Panel */}
        <div className="w-1/2 h-full p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-900/50 relative">
          <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
            Trash
          </span>
          <motion.div
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 4,
              times: [0.3, 0.4, 0.7, 0.8],
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="mt-6 sm:mt-8 w-full p-2 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-zinc-900 opacity-50 grayscale"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
            <div className="w-12 sm:w-20 h-2 bg-zinc-100 dark:bg-zinc-800" />
          </motion.div>
        </div>

        {/* Undo Toast */}
        <motion.div
          animate={{ y: [50, -10, -10, 50] }}
          transition={{
            duration: 4,
            times: [0.4, 0.5, 0.8, 0.9],
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 sm:px-4 py-2 text-[10px] sm:text-xs flex items-center space-x-2 sm:space-x-3 whitespace-nowrap"
        >
          <span>Item deleted.</span>
          <button className="flex items-center font-bold hover:text-zinc-300 dark:hover:text-zinc-600">
            <RotateCcw className="w-3 h-3 mr-1" /> Undo
          </button>
        </motion.div>
      </div>
    </div>
  );
}
