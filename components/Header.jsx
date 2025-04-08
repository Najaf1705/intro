"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ThemeSwitch from "@/components/ThemeSwitch";

function Header() {
  const { isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const menuRef = useRef(null);
  const path = usePathname();
  const router = useRouter();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollingDown = currentScrollPos > prevScrollPos;
      setVisible(!scrollingDown || currentScrollPos < 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

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
  }, [menuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  // Navigation items array
  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/questions", label: "Questions" },
    { path: "/upgrade", label: "Upgrade" },
  ];

  // Handle navigation
  const handleNavClick = (linkPath) => {
    router.push(linkPath);
    setMenuOpen(false);
  };

  return (
    <header
      className={`flex p-4 items-center justify-between bg-secondary text-secondary-foreground shadow-primary shadow-sm fixed w-full top-0 left-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
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
          className={`fixed top-0 left-0 min-h-screen w-3/4 bg-secondary text-secondary-foreground z-50 transform px-2 pt-16 overflow-y-auto transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:flex md:gap-8 md:mx-auto md:justify-center md:items-center md:transform-none md:w-auto md:h-auto md:pt-0 md:overflow-visible md:min-h-0`}
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

      {/* Theme Switch and User */}
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        {!isLoaded ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : useUser().isSignedIn ? (
          <UserButton />
        ) : (
          <div className="flex gap-2">
            <button
              className="px-2 py-0.5 font-bold bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// Wrapper Component to Conditionally Render Header
export default function HeaderWrapper() {
  const path = usePathname();

  // Define paths to hide the header
  const hiddenPaths = ["/sign-in", "/sign-up", "/404"];
  
  // Define regex patterns for dynamic paths
  const dynamicPathPatterns = [
    /^\/dashboard\/interview\/[^/]+\/interviewScreen$/, // Matches /dashboard/interview/[interviewId]/interviewScreen
  ];

  // Check if the current path matches any hidden path or dynamic pattern
  const isHidden = hiddenPaths.includes(path) || dynamicPathPatterns.some((pattern) => pattern.test(path));

  // If the current path matches a hidden path, do not render the header
  if (isHidden) {
    return null;
  }

  return <Header />;
}