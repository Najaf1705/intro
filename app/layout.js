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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>Intro</title>
        <meta name="description" content="Intro - Your AI Interview Assistant" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap" rel="stylesheet"></link>

        {/* <link rel="preload" href="/fonts/Quicksand.ttf" as="font" crossOrigin="true" /> */}
        {/* <link rel="preload" href="/fonts/Quicksand-Bold.ttf" as="font" crossOrigin="true" /> */}

      </head>
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
                <span className="text-tertiary">Kurosaki Ichigo.</span> All
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