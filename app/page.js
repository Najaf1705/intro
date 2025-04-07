"use client";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Show loader if  ThemeContext is still loading
  if (isThemeLoading) {
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
