"use client";

import { Toaster as Sonner } from "sonner"; // Import Sonner toaster library
import { useTheme } from "../../app/context/ThemeContext";  // Import the custom ThemeContext

const Toaster = ({
  ...props // Spread props for flexibility
}) => {
  const { theme = "light" } = useTheme();  // Use the theme from the context

  return (
    <Sonner
      theme={theme}
      className="toaster group" // Apply base classes
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-primary group-[.toaster]:text-secondary group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-primary group-[.toast]:text-secondary",
        },
      }}
      {...props} // Forward all additional props
    />
  );
};

export { Toaster }; // Export the Toaster for use in other components
