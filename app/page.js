"use client";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isLoaded: isUserLoaded } = useUserContext();
  const { loading: isThemeLoading } = useTheme();

  // Show loader if either UserContext or ThemeContext is still loading
  if (!isUserLoaded || isThemeLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-tertiary" size={40} />
      </div>
    );
  }

  // Redirect to dashboard once loading is complete
  router.replace("/dashboard");
  return null;
}
