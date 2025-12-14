"use client";

import { Check } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  onGetStarted: () => void;
}

function PricingCard({
  title,
  price,
  features,
  highlighted,
  onGetStarted,
}: PricingCardProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 p-8 flex flex-col h-full bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      <div className="mb-8">
        <span className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">
          {price}
        </span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start text-[15px] text-zinc-600 dark:text-zinc-400"
          >
            <Check className="w-4 h-4 mr-3 mt-1 text-zinc-900 dark:text-zinc-100 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={onGetStarted}
        className={`w-full py-3 px-6 text-sm font-medium transition-colors ${
          highlighted
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
            : "border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        }`}
      >
        {title === "Free" ? "Get Started" : "Subscribe"}
      </button>
    </div>
  );
}

export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section
      id="pricing"
      className="py-24 px-6 bg-zinc-50/30 dark:bg-zinc-900/30"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            Simple pricing
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            No hidden fees. No complicated tiers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <PricingCard
            title="Free"
            price="₹0"
            features={[
              "5 GB secure storage",
              "Basic encryption",
              "Mobile access",
              "7-day history",
            ]}
            onGetStarted={onGetStarted}
          />
          <PricingCard
            title="Pro"
            price="₹199/mo"
            features={[
              "50 GB storage",
              "Zero-knowledge encryption",
              "Priority support",
              "Unlimited history",
              "Advanced search",
            ]}
            highlighted
            onGetStarted={onGetStarted}
          />
        </div>
      </div>
    </section>
  );
}
