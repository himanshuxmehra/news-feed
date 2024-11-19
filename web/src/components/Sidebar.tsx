"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./auth/LogoutButton";

function LargeSidebar() {
  return (
    <div className="w-64 h-full flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-[#edf2f4] flex">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h1 className="mx-2 text-2xl font-bold">Xseed News</h1>
        </Link>
      </div>
      <nav className="space-y-4 flex-grow">
        <Link
          href="#"
          className="flex items-center space-x-2 text-[#edf2f4] hover:bg-[#5C2C11]/10 px-3 py-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span className="font-semibold">Home</span>
        </Link>
        <Link
          href="#"
          className="flex items-center space-x-2 text-[#edf2f4] hover:bg-[#5C2C11]/10 px-3 py-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="font-semibold">Search</span>
        </Link>
        <Link
          href="#"
          className="flex items-center space-x-2 text-[#edf2f4] hover:bg-[#5C2C11]/10 px-3 py-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="font-semibold">Notifications</span>
        </Link>
        <Link
          href="#"
          className="flex items-center space-x-2 text-[#edf2f4] hover:bg-[#5C2C11]/10 px-3 py-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="font-semibold">Profile</span>
        </Link>
      </nav>
      <LogoutButton />
      <Button className="w-[80%] md:w-full self-center mt-4 bg-[#d80032] hover:bg-[#d80032a7] text-[#edf2f4] rounded-full">
        Post
      </Button>
    </div>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="hidden md:block border-r border-[#5C2C11]/20 p-4">
        <LargeSidebar />
      </div>

      {/* Hamburger menu for smaller screens */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#edf2f4]">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 px-2">
            <LargeSidebar />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Sidebar;
