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
import { Search, Menu, X } from "lucide-react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import Image from "next/image";
import { useSearch } from "@/hooks/search/useSearch";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import type { FileDocument } from "@/types";

interface DashboardHeaderProps {
  onUploadClick?: () => void;
  onMenuClick?: () => void;
  onFileSelect?: (file: FileDocument) => void;
}

export function DashboardHeader({
  onMenuClick,
  onFileSelect,
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isSearchOpen,
    setIsSearchOpen,
    clearSearch,
  } = useSearch();

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

  const handleFileSelect = (file: FileDocument) => {
    onFileSelect?.(file);
    clearSearch();
    setIsMobileSearchOpen(false);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleMobileSearchToggle = () => {
    if (isMobileSearchOpen) {
      clearSearch();
    }
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <TooltipProvider>
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 md:py-3">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={onMenuClick}
            >
              <Menu className="w-5 h-5" />
            </Button>

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
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden sm:flex flex-1 max-w-2xl justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setIsSearchOpen(true);
                  }
                }}
                className="pl-9 md:pl-10 pr-10 md:pr-12 py-1.5 md:py-2 w-full bg-muted border border-border rounded-full focus:bg-card focus:shadow-md focus:ring-2 focus:ring-ring transition-all text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <SearchDropdown
                isOpen={isSearchOpen}
                isSearching={isSearching}
                searchResults={searchResults}
                searchQuery={searchQuery}
                onClose={handleSearchClose}
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden w-9 h-9 p-0"
              onClick={handleMobileSearchToggle}
            >
              {isMobileSearchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>

            <ThemeToggleButton variant="circle" start="center" />

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

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="sm:hidden px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setIsSearchOpen(true);
                  }
                }}
                autoFocus
                className="pl-9 pr-9 py-2 w-full bg-muted border border-border rounded-full focus:bg-card focus:shadow-md focus:ring-2 focus:ring-ring transition-all text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <SearchDropdown
                isOpen={isSearchOpen}
                isSearching={isSearching}
                searchResults={searchResults}
                searchQuery={searchQuery}
                onClose={handleSearchClose}
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>
        )}
      </header>
    </TooltipProvider>
  );
}
