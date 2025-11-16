"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SigninModal } from "@/components/SigninModal";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleGetStarted = () => {
    setIsSigninModalOpen(true);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.png"
                alt="Mini Drive Logo"
                width={32}
                height={32}
                className="rounded-xl shadow-lg sm:w-10 sm:h-10"
              />
              <h1 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">
                Mini Drive
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggleButton variant="circle" start="center" />
              <Button
                size="sm"
                onClick={handleGetStarted}
                className="border border-border/50 text-foreground hover:bg-muted/50 text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                  5GB free cloud storage
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight">
                  Your files,
                  <br />
                  <span className="text-primary">anywhere</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Secure cloud storage with Google authentication. Access your
                  files from any device, anywhere in the world.
                </p>
              </div>

              <div className="flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Get started free
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 pt-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">🔒</span>
                  </div>
                  <span>Google secure</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Element */}
            <div className="relative hidden lg:block">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Background elements */}
                <div className="absolute -top-8 -right-8 w-24 sm:w-32 h-24 sm:h-32 bg-primary/20 rounded-3xl rotate-12"></div>
                <div className="absolute -bottom-6 -left-6 w-20 sm:w-24 h-20 sm:h-24 bg-accent/20 rounded-2xl -rotate-6"></div>

                {/* Main visual */}
                <div className="relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/50">
                  <div className="space-y-6">
                    {/* App mockup */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-border/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Image
                            src="/logo.png"
                            alt="Mini Drive Logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                          <span className="font-semibold text-card-foreground">
                            Mini Drive
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>

                      {/* File list mockup */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📄</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-card-foreground">
                              Project Notes.pdf
                            </div>
                            <div className="text-xs text-muted-foreground">
                              2.4 MB • Modified today
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📷</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-card-foreground">
                              Vacation Photos
                            </div>
                            <div className="text-xs text-muted-foreground">
                              15 files • 245 MB
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed border-border/50">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                              +
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Drop files here
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">
                          5GB
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Free storage
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">∞</div>
                        <div className="text-xs text-muted-foreground">
                          Devices
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">
                          🔒
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Secure
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sign in Modal */}
      <SigninModal
        isOpen={isSigninModalOpen}
        onClose={() => setIsSigninModalOpen(false)}
      />
    </div>
  );
}
