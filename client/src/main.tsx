import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { UIProvider } from "./contexts/UIContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Initialize language direction from localStorage before rendering
try {
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    // Set HTML direction attribute based on the saved language
    document.documentElement.dir = savedLanguage === "he" ? "rtl" : "ltr";
    document.documentElement.lang = savedLanguage;
    console.log("Initial language direction set to:", document.documentElement.dir);
  }
} catch (error) {
  console.error("Error setting initial language direction:", error);
}

// Render the application
createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <UIProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </CartProvider>
    </UIProvider>
  </LanguageProvider>
);
