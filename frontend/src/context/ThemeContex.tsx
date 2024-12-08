"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Create the ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // Start as null

  // Load the theme from localStorage or system preferences
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      // Use the stored theme if it exists
      setIsDarkMode(storedTheme === "dark");
    } else {
      // Otherwise, use system preferences
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  // Apply the theme class on first render
  useEffect(() => {
    if (isDarkMode === null) return; // Wait until the theme is determined
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
