"use client";
import { Quicksand } from "next/font/google"; // Import Quicksand
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeProviders } from "@/app/themeProvider"; // Import your theme provider
import { Toaster } from "@/components/ui/toaster"
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import Header from "@/components/Header";

// Define Quicksand font from Google Fonts
const quicksand = Quicksand({
  subsets: ["latin"], // Required: specify the character subset
  weight: ["300", "400", "500", "600", "700"], // Specify weights you want
  variable: "--font-quicksand", // Optional: CSS variable for flexibility
});

const store = makeStore(); // Create a Redux store instance

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} antialiased flex flex-col min-h-screen`}
      >
        <Provider store={store}>
          <ThemeProviders>
            <ClerkProvider>
              <Header/>
              <div className="flex-grow">{children}</div>
              <footer className="text-center text-sm font-bold mt-auto">
                © {new Date().getFullYear()}{" "}
                <span className="text-tertiary">Enzoe.</span> All
                rights reserved.
              </footer>
              <Toaster />
            </ClerkProvider>
          </ThemeProviders>
        </Provider>
      </body>
    </html>
  );
}