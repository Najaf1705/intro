"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { MoonIcon, SunDimIcon, MenuIcon, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function Header() {
  const { isLoaded } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const path = usePathname();
  const router = useRouter();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]); // Only re-run when menuOpen changes

  // Navigation items array
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/questions", label: "Questions" },
    { path: "/upgrade", label: "Upgrade" },
    { path: "/working", label: "How it works?" },
  ];

  // Handle navigation
  const handleNavClick = (linkPath) => {
    router.push(linkPath);
    setMenuOpen(false);
  };

  return (
    <header className="flex p-4 items-center justify-between bg-secondary text-secondary-foreground shadow-primary shadow-sm relative">
      {/* Logo and Menu Toggle */}
      <div className="flex items-center">
        <button
          className="md:hidden mr-2 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <XIcon size={24} /> : <MenuIcon size={28} />}
        </button>
        <Image src="/logo.svg" width={30} height={30} alt="Intro logo" priority />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Navigation Menu */}
      <nav>
        <ul
          ref={menuRef}
          className={`fixed top-0 left-0 h-full w-3/4 bg-secondary text-secondary-foreground z-50 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:flex md:gap-8 md:mx-auto md:justify-center md:items-center md:transform-none md:w-auto md:h-auto`}
        >
          {navItems.map(({ path: linkPath, label }) => (
            <li
              key={label}
              className={`font-bold text-lg hover:text-tertiary hover:scale-105 cursor-pointer transition-all duration-200 p-4 md:p-0 ${
                path === linkPath ? "text-tertiary" : ""
              }`}
              onClick={() => handleNavClick(linkPath)}
            >
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme Toggle and User */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1 hover:opacity-75 transition-opacity"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? (
            <SunDimIcon className="text-white" size={24} />
          ) : (
            <MoonIcon className="text-black" size={24} />
          )}
        </button>
        {!isLoaded ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  );
}

export default Header;