"use client";

import { useState } from "react";

const trustItems = [
  { name: "SOC2", label: "Compliant" },
  { name: "AES-256", label: "Encryption" },
  { name: "AWS", label: "Infrastructure" },
  { name: "Stripe", label: "Payments" },
  { name: "99.99%", label: "Uptime" },
  { name: "GDPR", label: "Compliant" },
];

export function TrustGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="grid grid-cols-3 md:grid-cols-6">
        {trustItems.map((item, i) => (
          <div
            key={item.name}
            className={`flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-800 py-8 transition-all duration-150 last:border-r-0 ${
              hoveredIndex === i
                ? "bg-zinc-50 dark:bg-zinc-900"
                : "bg-white dark:bg-zinc-950"
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              className={`text-lg font-semibold tracking-tight transition-opacity duration-150 ${
                hoveredIndex === i
                  ? "text-zinc-900 dark:text-zinc-100 opacity-100"
                  : "text-zinc-400 opacity-40"
              }`}
            >
              {item.name}
            </span>
            <span className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
