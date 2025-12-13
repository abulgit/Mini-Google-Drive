"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "Forever.",
    features: [
      "5 GB Storage",
      "Basic Search",
      "Standard Encryption",
      "Email Support",
    ],
    cta: "Start now",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per user / month",
    features: [
      "1 TB Storage",
      "Duplicate Detection",
      "Advanced Activity Logs",
      "Priority Support",
      "API Access",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Contact us",
    features: [
      "Unlimited Storage",
      "SSO / SAML",
      "Dedicated Success Manager",
      "Custom Integrations",
      "SLA Guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function Pricing({ onGetStarted }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (price: string) => {
    if (isYearly && price !== "Custom" && price !== "$0") {
      return `$${Math.round(parseInt(price.slice(1)) * 0.8)}`;
    }
    return price;
  };

  return (
    <section
      id="pricing"
      className="border-b border-zinc-200 dark:border-zinc-800 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Pricing
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-5xl">
            Predictable scaling<span className="font-bold">.</span>
          </h2>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center border border-zinc-200 dark:border-zinc-700 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 text-sm transition-colors ${
                !isYearly
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 text-sm transition-colors ${
                isYearly
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 border border-zinc-200 dark:border-zinc-700">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`p-8 lg:p-10 flex flex-col bg-white dark:bg-zinc-950 ${
                index !== 0
                  ? "border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-700"
                  : ""
              } ${plan.highlighted ? "border-t-4 border-t-zinc-900 dark:border-t-zinc-100" : ""}`}
            >
              {/* Plan Header */}
              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {getPrice(plan.price)}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mt-1">{plan.period}</p>
              </div>

              {/* Features */}
              <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700">
                {plan.features.map(feature => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 py-4 border-b border-zinc-100 dark:border-zinc-800 text-sm"
                  >
                    <Check
                      size={14}
                      className="text-zinc-900 dark:text-zinc-100 shrink-0"
                    />
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <button
                  onClick={onGetStarted}
                  className={`block w-full text-center py-3 px-6 text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
                      : "border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
