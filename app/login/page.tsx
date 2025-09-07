"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    getSession().then(session => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>

        {/* Logo */}
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-12">
            <Image
              src="/logo.png"
              alt="Mini Drive Logo"
              width={48}
              height={48}
              className="rounded-2xl shadow-xl"
            />
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Mini Drive
            </h1>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-8 shadow-2xl relative z-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-card-foreground">
                Welcome back
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Sign in with Google to access your secure cloud storage
              </p>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              size="lg"
              className="w-full h-14 text-base font-semibold border-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] dark:border-border dark:bg-card dark:text-card-foreground dark:hover:bg-muted"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-medium">
                    Free Storage
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-2xl mr-2">🎉</span>
                  <span className="text-primary font-medium">
                    5GB free storage
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No credit card required • Secure with Google • Access anywhere
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center relative z-10">
          <p className="text-sm text-muted-foreground/70">
            By signing in, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}
