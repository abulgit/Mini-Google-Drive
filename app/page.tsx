"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SigninModal } from "@/components/modals/SigninModal";
import {
  Navigation,
  Hero,
  TrustGrid,
  FeaturesGrid,
  Architecture,
  Pricing,
  Footer,
} from "@/components/landing";
import { useScrollRestore } from "@/hooks/useScrollRestore";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);

  // Restore scroll position on page refresh (only after loading completes)
  useScrollRestore(status !== "loading" && !session);

  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push("/dashboard");
  }, [session, status, router]);

  const handleGetStarted = () => setIsSigninModalOpen(true);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100 mx-auto" />
          <p className="mt-4 text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) return null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <Navigation onSignIn={handleGetStarted} onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} />
      <TrustGrid />
      <FeaturesGrid />
      <Architecture />
      <Pricing onGetStarted={handleGetStarted} />
      <Footer />
      <SigninModal
        isOpen={isSigninModalOpen}
        onClose={() => setIsSigninModalOpen(false)}
      />
    </main>
  );
}
