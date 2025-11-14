"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Search, SlidersHorizontal, Menu } from "lucide-react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import Image from "next/image";

interface DashboardHeaderProps {
  onUploadClick?: () => void;
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getInitials = (name?: string | null) => {
    if (!name) {
      return "U";
    }
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <TooltipProvider>
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 md:py-3">
          {/* Left Section - Menu + Logo + Search */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={onMenuClick}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <Image
                src="/logo.png"
                alt="Mini Drive Logo"
                width={32}
                height={32}
                className="rounded-lg md:w-[38px] md:h-[38px]"
              />
              <h1 className="text-base md:text-xl font-normal text-card-foreground hidden sm:block">
                Mini Drive
              </h1>
            </div>

            {/* Search - Hidden on small mobile */}
            <div className="hidden sm:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search in Drive"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 md:pl-10 pr-10 md:pr-12 py-1.5 md:py-2 w-full bg-muted border-0 rounded-full focus:bg-card focus:shadow-md focus:ring-2 focus:ring-ring transition-all text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 p-0 rounded-full"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Search Icon (mobile) + Theme + Profile */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="sm:hidden w-9 h-9 p-0">
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle Button */}
            <ThemeToggleButton variant="circle" start="center" />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-9 h-9 md:w-10 md:h-10 p-0 rounded-full"
                >
                  <Avatar className="w-7 h-7 md:w-8 md:h-8">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt="Profile"
                    />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 sm:w-72">
                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-card-foreground truncate text-sm sm:text-base">
                        {session?.user?.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {session?.user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
