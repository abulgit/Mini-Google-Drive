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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900">
                <span className="text-blue-600">Simple</span>Drive
              </h1>
              <p className="text-xl text-gray-600">
                Your personal cloud storage solution
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">☁️</div>
                  <h3 className="font-semibold mb-2">5GB Free Storage</h3>
                  <p className="text-sm text-gray-600">
                    Upload and store your files securely in the cloud
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-semibold mb-2">Secure & Private</h3>
                  <p className="text-sm text-gray-600">
                    Google authentication ensures your files stay private
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-semibold mb-2">Easy Access</h3>
                  <p className="text-sm text-gray-600">
                    Upload, download, and manage files from anywhere
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3"
                  onClick={handleGetStarted}
                >
                  Get Started for Free
                </Button>

                <p className="text-sm text-gray-500">
                  Sign in with Google • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
