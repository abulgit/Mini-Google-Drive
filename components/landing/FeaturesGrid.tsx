"use client";

import { useRef, useState } from "react";
import { Activity, Copy, Search, Trash2 } from "lucide-react";

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

        <div className="grid gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 md:grid-cols-2 lg:grid-cols-3">
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
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`relative bg-white dark:bg-zinc-950 p-8 lg:col-span-2 lg:p-10 transition-colors duration-0 ${
        hovered ? "border-zinc-400" : ""
      }`}
      onMouseEnter={() => {
        setHovered(true);
        setTimeout(() => setShowTooltip(true), 300);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setShowTooltip(false);
      }}
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
              className={`relative flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 py-3 last:border-0 ${
                item.highlight && hovered ? "bg-zinc-100 dark:bg-zinc-800" : ""
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
  const [hovered, setHovered] = useState(false);
  const [merged, setMerged] = useState(false);

  return (
    <div
      className={`relative bg-white dark:bg-zinc-950 p-8 lg:p-10 transition-colors duration-0 ${hovered ? "border-zinc-400" : ""}`}
      onMouseEnter={() => {
        setHovered(true);
        setTimeout(() => setMerged(true), 500);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setMerged(false);
      }}
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
  const [hovered, setHovered] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<NodeJS.Timeout>(null);

  const handleHover = () => {
    setHovered(true);
    let i = 0;
    const text = "inv...";
    searchRef.current = setInterval(() => {
      if (i <= text.length) {
        setSearchText(text.slice(0, i));
        i++;
      } else {
        if (searchRef.current) clearInterval(searchRef.current);
        setShowDropdown(true);
      }
    }, 100);
  };

  const handleLeave = () => {
    setHovered(false);
    if (searchRef.current) clearInterval(searchRef.current);
    setSearchText("");
    setShowDropdown(false);
  };

  return (
    <div
      className={`relative bg-white dark:bg-zinc-950 p-8 lg:p-10 transition-colors duration-0 ${hovered ? "border-zinc-400" : ""}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
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
          <span className="animate-pulse text-zinc-400">|</span>
        </div>
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full border border-t-0 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 animate-fade-in">
            <div className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <span className="text-sm">
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Inv
                </strong>
                <span className="text-zinc-500">oice_2024.pdf</span>
              </span>
            </div>
            <div className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <span className="text-sm">
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Inv
                </strong>
                <span className="text-zinc-500">estment_Plan.docx</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrashCard() {
  const [hovered, setHovered] = useState(false);
  const [filePosition, setFilePosition] = useState<
    "active" | "trash" | "restoring"
  >("active");
  const [showUndo, setShowUndo] = useState(false);

  const animateTrash = () => {
    setHovered(true);
    setTimeout(() => setFilePosition("trash"), 300);
    setTimeout(() => setShowUndo(true), 600);
    setTimeout(() => {
      setFilePosition("restoring");
      setShowUndo(false);
    }, 1500);
    setTimeout(() => setFilePosition("active"), 2000);
  };

  return (
    <div
      className={`relative bg-white dark:bg-zinc-950 p-8 lg:col-span-2 lg:p-10 transition-colors duration-0 ${
        hovered ? "border-zinc-400" : ""
      }`}
      onMouseEnter={animateTrash}
      onMouseLeave={() => {
        setHovered(false);
        setFilePosition("active");
        setShowUndo(false);
      }}
    >
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

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Active
          </span>
          <div className="mt-4 min-h-[60px]">
            {(filePosition === "active" || filePosition === "restoring") && (
              <div
                className={`h-12 w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center px-3 gap-2 transition-all duration-500 ${
                  filePosition === "restoring" ? "animate-slide-in-left" : ""
                }`}
              >
                <div className="h-6 w-6 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900" />
                <span className="text-xs text-zinc-500">Report.pdf</span>
              </div>
            )}
          </div>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Trash
          </span>
          <div className="mt-4 min-h-[60px]">
            {filePosition === "trash" && (
              <div className="h-12 w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center px-3 gap-2 animate-slide-in-right opacity-50">
                <div className="h-6 w-6 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900" />
                <span className="text-xs text-zinc-500">Report.pdf</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUndo && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 animate-fade-in">
          <span className="text-xs text-zinc-500">File deleted.</span>
          <button className="ml-3 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
