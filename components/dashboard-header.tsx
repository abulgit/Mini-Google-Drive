"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-blue-600">SimpleDrive</div>
            <div className="text-sm text-muted-foreground">
              Personal Cloud Storage
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="font-medium">{session.user.name}</div>
                  <div className="text-muted-foreground">
                    {session.user.email}
                  </div>
                </div>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            )}

            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
