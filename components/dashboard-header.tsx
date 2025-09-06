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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Settings, HelpCircle, SlidersHorizontal } from "lucide-react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

interface DashboardHeaderProps {
  onUploadClick?: () => void;
}

export function DashboardHeader({}: DashboardHeaderProps) {
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
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center gap-6 flex-1">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <h1 className="text-xl font-normal text-card-foreground">
                Mini Drive
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search in Drive"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-muted border-0 rounded-full focus:bg-card focus:shadow-md focus:ring-2 focus:ring-ring transition-all"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full"
                >
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <ThemeToggleButton variant="circle" start="center" />

            {/* Settings Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            {/* Help Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full"
                >
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help</TooltipContent>
            </Tooltip>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-10 h-10 p-0 rounded-full">
                  <Avatar className="w-8 h-8">
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
              <DropdownMenuContent align="end" className="w-72">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-card-foreground truncate">
                        {session?.user?.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {session?.user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <HelpCircle className="w-4 h-4" />
                  Help & feedback
                </DropdownMenuItem>
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
