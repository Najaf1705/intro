"use client";
import { Quicksand } from "next/font/google"; // Import Quicksand
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";

// Define Quicksand font from Google Fonts
const quicksand = Quicksand({
  subsets: ["latin"], // Required: specify the character subset
  weight: ["300", "400", "500", "600", "700"], // Specify weights you want
  variable: "--font-quicksand", // Optional: CSS variable for flexibility
});

const store = makeStore(); // Create a Redux store instance

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} antialiased flex flex-col min-h-screen`}
      >
        <Provider store={store}>
          <ThemeProvider>
            <ClerkProvider>
              <UserProvider>
                <div className="flex-grow">{children}</div>
                <footer className="text-center text-sm font-bold mt-auto">
                  © {new Date().getFullYear()}{" "}
                  <span className="text-tertiary">Kurosaki Ichigo.</span> All
                  rights reserved.
                </footer>
                <Toaster />
              </UserProvider>
            </ClerkProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}