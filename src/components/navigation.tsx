"use client";

import { clearCookies } from "@/app/actions/auth/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = (path: string) => (pathname === path ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900");
  if (pathname === "/login") return null;
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pos", label: "POS Billing" },
    { href: "/jobs", label: "Job Tickets" },
    { href: "/inventory", label: "Inventory" },
    { href: "/petty-cash", label: "Petty Cash" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="lg:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                  <SheetHeader>
                    <SheetTitle className="text-lg font-semibold text-blue-900">Promise Electronics</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-2">
                    {navLinks.map(({ href, label }) => (
                      <Link key={href} href={href} onClick={() => setSheetOpen(false)} className={`${isActive(href)} block px-3 py-2 rounded-md text-sm sm:text-base font-medium`}>
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-200 my-3"></div>
                    <button
                      onClick={() => {
                        clearCookies();
                        setSheetOpen(false);
                      }}
                      className="w-full text-left text-sm sm:text-base text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-blue-900">Promise Electronics</h1>
            </div>
            <div className="hidden lg:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} className={`${isActive(href)} px-3 py-2 rounded-md text-sm sm:text-base font-medium`}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:block text-sm text-gray-500 mr-4 font-mono" id="current-time"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <Avatar className="h-9 w-9 border border-gray-300 bg-gray-100">
                    <AvatarImage src={!imageError ? "/user-avatar.jpg" : ""} alt="User avatar" onError={() => setImageError(true)} />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">P</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-white rounded-md shadow-lg">
                <DropdownMenuItem onClick={() => clearCookies()} className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
