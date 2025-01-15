"use client"
import { Button } from "@/components/ui/button";
import { MoonIcon, SunDimIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <h2>Levi</h2>
      <Link href={`dashboard`}>
        <Button variant="default">Dashboard</Button>
      </Link>
      <Link href={`lee`}>
        <Button variant="default">Ackermann</Button>
      </Link>
      <button onClick={toggleTheme} className="mr-2">
        {theme === "dark" ? (
          <SunDimIcon className="text-white" />
        ) : (
          <MoonIcon className="text-black" />
        )}
      </button>
    </div>
  );
}
