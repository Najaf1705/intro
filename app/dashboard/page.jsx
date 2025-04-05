"use client";
import React from "react";
import AddNewInt from "@/components/AddNewInt";
import { useUserContext } from "@/context/UserContext";

function Dashboard() {
  const user = useUserContext(); // Access user data from context

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-background mt-12">
      <h2 className="mt-5 font-bold text-2xl text-tertiary">
        {getGreeting()} {user?.firstName}
      </h2>
      <h2>Create and start your AI mockup Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInt />
      </div>
    </div>
  );
}

export default Dashboard;