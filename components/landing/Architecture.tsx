"use client";

import { Key, Shield, Zap } from "lucide-react";

export function Architecture() {
  return (
    <section
      id="security"
      className="relative py-24 lg:py-32 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden"
    >
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: "radial-gradient(#a1a1aa 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Copy */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">
              Security
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">
              Built on a fortress<span className="font-bold">.</span>
            </h2>
            <p className="text-lg text-zinc-500 mb-10 max-w-lg">
              Minidrive isn&apos;t just storage; it&apos;s a vault. End-to-end
              encryption ensures that even we can&apos;t see your data.
            </p>

            {/* Feature List */}
            <div className="space-y-0 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-4 py-4 border-b border-zinc-200 dark:border-zinc-700">
                <Key size={16} className="text-zinc-900 dark:text-zinc-100" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  AES-256 Encryption
                </span>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-zinc-200 dark:border-zinc-700">
                <Shield
                  size={16}
                  className="text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-zinc-900 dark:text-zinc-100">
                  2-Factor Authentication
                </span>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-zinc-200 dark:border-zinc-700">
                <Zap size={16} className="text-zinc-900 dark:text-zinc-100" />
                <span className="text-zinc-900 dark:text-zinc-100">
                  &lt; 50ms Latency
                </span>
              </div>
            </div>
          </div>

          {/* Right - Wireframe Lock Visualization */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* Wireframe Lock SVG */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              >
                {/* Lock Body - Outer */}
                <rect
                  x="40"
                  y="80"
                  width="120"
                  height="100"
                  className="text-zinc-900 dark:text-zinc-100"
                  strokeDasharray="4 2"
                />

                {/* Lock Body - Inner Grid */}
                <line
                  x1="40"
                  y1="110"
                  x2="160"
                  y2="110"
                  className="text-zinc-300 dark:text-zinc-600"
                />
                <line
                  x1="40"
                  y1="140"
                  x2="160"
                  y2="140"
                  className="text-zinc-300 dark:text-zinc-600"
                />
                <line
                  x1="80"
                  y1="80"
                  x2="80"
                  y2="180"
                  className="text-zinc-300 dark:text-zinc-600"
                />
                <line
                  x1="120"
                  y1="80"
                  x2="120"
                  y2="180"
                  className="text-zinc-300 dark:text-zinc-600"
                />

                {/* Lock Shackle */}
                <path
                  d="M 60 80 L 60 50 Q 60 20 100 20 Q 140 20 140 50 L 140 80"
                  className="text-zinc-900 dark:text-zinc-100"
                  strokeWidth="1"
                />

                {/* Keyhole */}
                <circle
                  cx="100"
                  cy="130"
                  r="12"
                  className="text-zinc-900 dark:text-zinc-100"
                />
                <rect
                  x="96"
                  y="130"
                  width="8"
                  height="20"
                  className="text-zinc-900 dark:text-zinc-100"
                />

                {/* Corner Details */}
                <rect
                  x="40"
                  y="80"
                  width="10"
                  height="10"
                  className="text-zinc-400 dark:text-zinc-500"
                  fill="none"
                />
                <rect
                  x="150"
                  y="80"
                  width="10"
                  height="10"
                  className="text-zinc-400 dark:text-zinc-500"
                  fill="none"
                />
                <rect
                  x="40"
                  y="170"
                  width="10"
                  height="10"
                  className="text-zinc-400 dark:text-zinc-500"
                  fill="none"
                />
                <rect
                  x="150"
                  y="170"
                  width="10"
                  height="10"
                  className="text-zinc-400 dark:text-zinc-500"
                  fill="none"
                />

                {/* Decorative Lines */}
                <line
                  x1="20"
                  y1="100"
                  x2="35"
                  y2="100"
                  className="text-zinc-300 dark:text-zinc-600"
                  strokeDasharray="2 2"
                />
                <line
                  x1="165"
                  y1="100"
                  x2="180"
                  y2="100"
                  className="text-zinc-300 dark:text-zinc-600"
                  strokeDasharray="2 2"
                />
                <line
                  x1="20"
                  y1="160"
                  x2="35"
                  y2="160"
                  className="text-zinc-300 dark:text-zinc-600"
                  strokeDasharray="2 2"
                />
                <line
                  x1="165"
                  y1="160"
                  x2="180"
                  y2="160"
                  className="text-zinc-300 dark:text-zinc-600"
                  strokeDasharray="2 2"
                />
              </svg>

              {/* Floating Labels */}
              <div className="absolute -top-4 -left-4 text-[10px] text-zinc-400 font-mono">
                256-bit
              </div>
              <div className="absolute -bottom-4 -right-4 text-[10px] text-zinc-400 font-mono">
                encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
