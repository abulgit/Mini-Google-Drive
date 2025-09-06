"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Simple<span className="text-muted-foreground">Drive</span>
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-card-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your cloud storage
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center py-3 px-4 bg-card hover:bg-muted border border-border text-card-foreground rounded-lg font-medium transition-colors duration-200"
              size="lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Get 5GB of free cloud storage
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground/60">
            Secure • Private • Easy to use
          </p>
        </div>
      </div>
    </div>
  );
}
