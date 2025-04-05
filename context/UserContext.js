"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { isLoaded, user } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      setUserData(user);
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader className="animate-spin text-tertiary" size={40} />
      </div>
    );
  }

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}