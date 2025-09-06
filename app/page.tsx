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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 bg-primary-foreground rounded-md"></div>
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                SimpleDrive
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetStarted}
              className="border-border/50 hover:bg-muted/50"
            >
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                  5GB free cloud storage
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
                  Your files,
                  <br />
                  <span className="text-primary">anywhere</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Secure cloud storage with Google authentication. Access your
                  files from any device, anywhere in the world.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Get started free
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="px-8 py-4 text-lg font-medium hover:bg-muted/80"
                >
                  Watch demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">🔒</span>
                  </div>
                  <span>Google secure</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Element */}
            <div className="relative">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Background elements */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-3xl rotate-12"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/20 rounded-2xl -rotate-6"></div>

                {/* Main visual */}
                <div className="relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-border/50">
                  <div className="space-y-6">
                    {/* App mockup */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-border/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                          </div>
                          <span className="font-semibold text-card-foreground">
                            SimpleDrive
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
    </div>
  );
}
