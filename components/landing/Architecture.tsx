"use client";

import { useEffect, useRef, useState } from "react";
import { Key, Shield, Zap } from "lucide-react";

export function Architecture() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 py-20 lg:py-28"
      style={{
        backgroundImage: `radial-gradient(circle, #d4d4d8 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              Security
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-5xl">
              Built on a fortress<span className="font-bold">.</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Minidrive isn&apos;t just storage; it&apos;s a vault. End-to-end
              encryption ensures that even we can&apos;t see your data.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800">
                  <Key
                    className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                    AES-256 Encryption
                  </h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    Military-grade encryption at rest and in transit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800">
                  <Shield
                    className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                    2-Factor Authentication
                  </h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    Secure your account with TOTP or hardware keys.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800">
                  <Zap
                    className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {"< 50ms Latency"}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    Global edge network for instant file access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64 lg:h-80 lg:w-80">
              <svg
                viewBox="0 0 200 200"
                className={`h-full w-full transition-transform duration-1000 ${isVisible ? "rotate-0" : "-rotate-12"}`}
                style={{
                  animation: isVisible
                    ? "slowRotate 20s linear infinite"
                    : "none",
                }}
              >
                <rect
                  x="50"
                  y="90"
                  width="100"
                  height="80"
                  fill="none"
                  stroke="#52525B"
                  strokeWidth="1.5"
                  className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
                />
                <path
                  d="M70 90 L70 60 Q70 40 100 40 Q130 40 130 60 L130 90"
                  fill="none"
                  stroke="#52525B"
                  strokeWidth="1.5"
                  className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
                />
                <circle
                  cx="100"
                  cy="125"
                  r="10"
                  fill="none"
                  stroke="#52525B"
                  strokeWidth="1.5"
                  className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100" : "opacity-0"}`}
                />
                <line
                  x1="100"
                  y1="135"
                  x2="100"
                  y2="150"
                  stroke="#52525B"
                  strokeWidth="1.5"
                  className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100" : "opacity-0"}`}
                />
                <line
                  x1="50"
                  y1="110"
                  x2="150"
                  y2="110"
                  stroke="#A1A1AA"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50"
                  y1="130"
                  x2="150"
                  y2="130"
                  stroke="#A1A1AA"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50"
                  y1="150"
                  x2="150"
                  y2="150"
                  stroke="#A1A1AA"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="75"
                  y1="90"
                  x2="75"
                  y2="170"
                  stroke="#A1A1AA"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="100"
                  y1="90"
                  x2="100"
                  y2="170"
                  stroke="#A1A1AA"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="125"
                  y1="90"
                  x2="125"
                  y2="170"
                  stroke="#A1A1AA"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
