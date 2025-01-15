"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { MoonIcon, SunDimIcon, MenuIcon, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function Header() {
    const { isLoaded } = useUser(); 
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle
    const menuRef = useRef(null); // Ref to track the menu element
    const path = usePathname();
    const router = useRouter();
  
    // Close menu if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
        <div className="flex p-4 items-center justify-between bg-secondary text-secondary-foreground shadow-primary shadow-sm">
            {/* Logo */}
            <div className="flex">
                {/* Hamburger Menu for Small Screens */}
                <button className="md:hidden mr-2" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <XIcon size={24} /> : <MenuIcon size={28} />}
                </button>
                <Image src={"/logo.svg"} width={30} height={30} alt="Intro" />
            </div>
            
            {/* blurs the bg when menuOpen */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${
                    menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* Navigation Menu */}
            <ul
                ref={menuRef}
                className={`fixed top-0 left-0 h-full w-3/4 bg-secondary text-secondary-foreground z-50 transform transition-transform duration-300 ease-in-out ${
                menuOpen ? "translate-x-0 flex flex-col justify-center gap-8 p-8" : "-translate-x-full"
                } md:static md:flex md:gap-8 md:mx-auto md:justify-center md:items-center md:transform-none md:w-auto md:h-auto`}
            >
                {[
                { path: "/dashboard", label: "Dashboard" },
                { path: "/questions", label: "Questions" },
                { path: "/upgrade", label: "Upgrade" },
                { path: "/working", label: "How it works?" },
                ].map(({ path: linkPath, label }) => (
                <li
                    key={label}
                    className={`font-bold text-lg hover:text-tertiary hover:scale-105 cursor-pointer transition-transform duration-200 ${
                    path === linkPath ? "text-tertiary" : ""
                    }`}
                    onClick={() => {
                    router.push(linkPath);
                    setMenuOpen(false); // Close menu after navigation
                    }}
                >
                    {label}
                </li>
                ))}
            </ul>

            {/* Theme Toggle and User Button */}
            <div className="md:flex justify-center align-middle">
                <button onClick={toggleTheme} className="mr-2">
                    {theme === "dark" ? (
                        <SunDimIcon className="text-white" />
                    ) : (
                        <MoonIcon className="text-black" />
                    )}
                </button>
                {!isLoaded ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                    <UserButton />
                )}
            </div>
        </div>
    );
}

export default Header;
