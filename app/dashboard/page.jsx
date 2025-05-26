"use client";
import React from "react";
import AddNewInt from "@/components/AddNewInt";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import PreviousInt from "@/components/PreviousInt";

function Dashboard() {
  const { isLoaded, user } = useUser(); // Get user data from Clerk

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-background mt-12 min-h-auto">
      <h2 className="mt-5 font-bold text-2xl text-tertiary flex items-center gap-2">
        {getGreeting()}
        <span className="text-tertiary font-bold">
          {isLoaded ? (
            user?.firstName
          ) : (
            "Zoro"
            // <Skeleton className="h-6 w-24 rounded-lg" /> // Skeleton for loading state
          )}
        </span>
      </h2>
      <h2>Create and start your AI mockup Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-5 wrap">
        {/* <AddNewInt />
        <AddNewInt /> */}
        <AddNewInt />
      </div>
      <PreviousInt/>
    </div>
  );
}

export default Dashboard;