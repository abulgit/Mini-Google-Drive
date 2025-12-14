"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Copy,
  Eye,
  File,
  FileEdit,
  MousePointer2,
  RotateCcw,
  Search,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";

type ActivityType = "viewed" | "renamed" | "uploaded" | "deleted" | "shared";

interface ActivityItem {
  type: ActivityType;
  fileName: string;
  renamedTo?: string;
  time: string;
}

const activityData: ActivityItem[] = [
  { type: "shared", fileName: "project_roadmap.docx", time: "5 hours ago" },
  {
    type: "uploaded",
    fileName: "presentation_final.pptx",
    time: "3 hours ago",
  },
  {
    type: "renamed",
    fileName: "IMG_20241201.png",
    renamedTo: "team_photo.png",
    time: "1 hour ago",
  },
  { type: "deleted", fileName: "old_backup_2023.zip", time: "15 min ago" },
  { type: "viewed", fileName: "Q4_Financial_Report.pdf", time: "2 min ago" },
];

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "viewed":
      return Eye;
    case "renamed":
      return FileEdit;
    case "uploaded":
      return Upload;
    case "deleted":
      return Trash2;
    case "shared":
      return Share2;
    default:
      return Eye;
  }
};

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

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = getActivityIcon(item.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      layout
      className="flex items-center gap-3 px-4 h-[52px] border-b border-zinc-200 dark:border-zinc-800 last:border-0"
    >
      <div className="flex-shrink-0">
        <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-sm truncate leading-tight whitespace-nowrap"
        >
          {item.type === "renamed" ? (
            <>
              <span className="text-zinc-900 dark:text-zinc-100">Renamed</span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.fileName}
              </span>{" "}
              <span className="text-zinc-900 dark:text-zinc-100">to</span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.renamedTo}
              </span>
            </>
          ) : (
            <>
              <span className="text-zinc-900 dark:text-zinc-100 capitalize">
                {item.type}
              </span>{" "}
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.fileName}
              </span>
            </>
          )}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-[11px] text-zinc-400 dark:text-zinc-600"
        >
          {item.time}
        </motion.p>
      </div>
    </motion.div>
  );
}

interface VisibleItem extends ActivityItem {
  id: number;
}

function ActivityCard() {
  const [isActive, setIsActive] = useState(false);
  const [visibleItems, setVisibleItems] = useState<VisibleItem[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const ROW_HEIGHT = 52;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isActive) {
          setIsActive(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const addNextItem = () => {
      if (currentIndex < activityData.length) {
        const baseItem = activityData[currentIndex];
        const newItem: VisibleItem = {
          ...baseItem,
          id: idCounterRef.current++,
        };
        setVisibleItems(prev =>
          [newItem, ...prev].slice(0, activityData.length)
        );
        currentIndex++;
        timeoutId = setTimeout(addNextItem, 900);
      } else {
        // All items shown, wait then reset and start again
        timeoutId = setTimeout(() => {
          setVisibleItems([]);
          currentIndex = 0;
          timeoutId = setTimeout(addNextItem, 400);
        }, 2000);
      }
    };

    timeoutId = setTimeout(addNextItem, 400);

    return () => clearTimeout(timeoutId);
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
        Track everything.
      </h3>
      <p className="mt-2 text-zinc-500">
        See every file action — views, uploads, renames, and deletions — all in
        one timeline.
      </p>

      <div
        className="mt-8 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
        style={{ height: ROW_HEIGHT * activityData.length }}
      >
        {visibleItems.map(item => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function DuplicateCard() {
  const [merged, setMerged] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const clearAllTimers = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };

    const animate = () => {
      const t1 = setTimeout(() => setMerged(true), 500);
      const t2 = setTimeout(() => setMerged(false), 3000);
      timeoutRefs.current.push(t1, t2);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearAllTimers();
          animate();
          intervalRef.current = setInterval(animate, 4000);
        } else {
          clearAllTimers();
          setMerged(false);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      observer.disconnect();
      clearAllTimers();
    };
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
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const clearAllTimers = () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };

    const animate = () => {
      let i = 0;
      const text = "inv...";
      setSearchText("");
      setShowDropdown(false);

      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      typingIntervalRef.current = setInterval(() => {
        if (i <= text.length) {
          setSearchText(text.slice(0, i));
          i++;
        } else {
          if (typingIntervalRef.current)
            clearInterval(typingIntervalRef.current);
          setShowDropdown(true);
          dropdownTimeoutRef.current = setTimeout(() => {
            setShowDropdown(false);
            setSearchText("");
          }, 2000);
        }
      }, 100);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearAllTimers();
          animate();
          loopIntervalRef.current = setInterval(animate, 4000);
        } else {
          clearAllTimers();
          setSearchText("");
          setShowDropdown(false);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      observer.disconnect();
      clearAllTimers();
    };
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
            <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 truncate">
              Invoice_2024.pdf
            </span>
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
            className="mt-6 sm:mt-8 w-full p-2 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-zinc-900 opacity-50 grayscale blur-[1px]"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
            <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 truncate">
              Invoice_2024.pdf
            </span>
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

        {/* Animated Mouse Pointer */}
        <motion.div
          initial={{ left: "18%", top: "45%" }}
          animate={{
            left: [
              "18%", // 0: start at file
              "18%", // 0.15: still at file (waiting)
              "18%", // 0.2: grab file
              "65%", // 0.4: drag to trash
              "65%", // 0.5: release, toast appears
              "55%", // 0.6: move to undo button
              "55%", // 0.7: at undo button
              "55%", // 0.8: click undo
              "18%", // 1: return to start
            ],
            top: [
              "45%", // 0: start at file
              "45%", // 0.15: still at file
              "45%", // 0.2: grab file
              "45%", // 0.4: drag to trash (same height)
              "45%", // 0.5: release
              "75%", // 0.6: move down to undo
              "75%", // 0.7: at undo button
              "75%", // 0.8: click undo
              "45%", // 1: return to start
            ],
            scale: [
              1, // 0: normal
              1, // 0.15: normal
              0.8, // 0.2: grab (press down)
              0.8, // 0.4: dragging
              1, // 0.5: release
              1, // 0.6: moving
              1, // 0.7: at button
              0.8, // 0.8: click
              1, // 1: normal
            ],
          }}
          transition={{
            duration: 4,
            times: [0, 0.15, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
          className="absolute z-20 pointer-events-none"
        >
          <MousePointer2 className="w-5 h-5 text-zinc-800 dark:text-zinc-200 fill-white dark:fill-zinc-900 drop-shadow-md" />
        </motion.div>
      </div>
    </div>
  );
}
