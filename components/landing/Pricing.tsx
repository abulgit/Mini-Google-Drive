"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$0",
      sub: "Forever.",
      features: ["5 GB Storage", "Basic Search", "Standard Encryption"],
      cta: "Start now",
      highlighted: false,
    },
    {
      name: "Pro",
      price: annual ? "$10" : "$12",
      sub: "per user / month",
      features: [
        "1 TB Storage",
        "Duplicate Detection",
        "Advanced Activity Logs",
        "Priority Support",
      ],
      cta: "Go Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      sub: "Tailored for scale.",
      features: [
        "Unlimited Storage",
        "SSO / SAML",
        "Dedicated Success Manager",
        "Custom Integrations",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="border-b border-zinc-200 dark:border-zinc-800 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Pricing
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-5xl">
            Predictable scaling<span className="font-bold">.</span>
          </h2>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="relative flex border border-zinc-200 dark:border-zinc-700 p-1">
            <button
              className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
                !annual ? "text-white" : "text-zinc-500"
              }`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors ${
                annual ? "text-white" : "text-zinc-500"
              }`}
              onClick={() => setAnnual(true)}
            >
              Yearly (Save 20%)
            </button>
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-900 dark:bg-zinc-100 transition-all duration-200 ${
                annual ? "left-[calc(50%+2px)]" : "left-1"
              }`}
            />
          </div>
        </div>

        <div className="grid gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 md:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-zinc-950 p-8 ${plan.highlighted ? "border-t-4 border-t-zinc-900 dark:border-t-zinc-100" : ""}`}
            >
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {plan.name}
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {plan.price}
                </span>
                <span className="ml-2 text-sm text-zinc-500">{plan.sub}</span>
              </div>

              <div className="mt-8 border-t border-zinc-200 dark:border-zinc-700">
                {plan.features.map(feature => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 py-3"
                  >
                    <Check
                      className="h-4 w-4 text-zinc-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className={`mt-8 w-full py-3 text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
                    : "border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
