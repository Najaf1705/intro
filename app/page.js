"use client";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Redirect to dashboard once loading is complete
  router.replace("/home");
  return null;
}
