import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContex";

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-light-primary dark:bg-dark-primary text-light-surface py-4 px-6 shadow-md flex items-center justify-between">
      <h1 className="flex flex-col md:flex-row font-bold">
        <span className="text-3xl mr-2">Qareeb</span>{" "}
        <span className="text-1xl md:text-2xl mt-1">Translation Manager</span>
      </h1>
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 bg-light-primary dark:bg-dark-primary text-light-surface rounded-full hover:bg-light-accentSecondary dark:hover:bg-dark-accentSecondary transition"
        aria-label="Switch Theme"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>
    </header>
  );
};

export default Header;
