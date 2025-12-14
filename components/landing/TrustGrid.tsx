"use client";

import { useState } from "react";

const trustItems = [
  { name: "5 GB", label: "Free Storage" },
  { name: "SAS", label: "Secure URLs" },
  { name: "AZURE", label: "Cloud Storage" },
  { name: "30 Days", label: "Trash Recovery" },
  { name: "99.99%", label: "Uptime" },
  { name: "OAuth", label: "Secure Login" },
];

export function TrustGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        {trustItems.map((item, i) => (
          <div
            key={item.name}
            className={`flex flex-col items-center justify-center border-b border-r border-zinc-200 dark:border-zinc-800 py-6 sm:py-8 transition-all duration-150 
              ${i % 2 === 1 ? "border-r-0 sm:border-r" : ""} 
              ${i % 3 === 2 ? "sm:border-r-0 md:border-r" : ""} 
              last:border-r-0 
              ${i >= 4 ? "border-b-0 sm:border-b md:border-b-0" : ""} 
              ${i >= 3 ? "sm:border-b-0 md:border-b-0" : ""} 
              ${hoveredIndex === i ? "bg-zinc-50 dark:bg-zinc-900" : "bg-white dark:bg-zinc-950"}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className={`text-base sm:text-lg font-semibold tracking-tight transition-opacity duration-150 ${
                hoveredIndex === i
                  ? "text-zinc-900 dark:text-zinc-100 opacity-100"
                  : "text-zinc-400 opacity-40"
              }`}
            >
              {item.name}
            </span>
            <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
