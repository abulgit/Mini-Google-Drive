"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleGetStarted = () => {
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mr-2"></span>
                Simple cloud storage
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
                Simple
                <span className="text-muted-foreground">Drive</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Store, access, and share your files securely from anywhere. 5GB
                free to get started.
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="text-base px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors duration-200"
                onClick={handleGetStarted}
              >
                Get Started Free
              </Button>
              <p className="text-sm text-muted-foreground">
                No credit card required
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 pt-16">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-xl">☁️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    5GB Free Storage
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start storing your files securely in the cloud without any
                    cost
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-xl">🔒</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    Secure & Private
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your files are protected with Google authentication and
                    encryption
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-xl">📱</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    Access Anywhere
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload, download, and manage files from any device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
