import React, { useState, useEffect } from "react";
import { FileText, Trash, X } from "lucide-react";

interface TcardProps {
  mode?: "quick" | "normal";
  translationKey: string;
  translationPreview: string;
  index: number;
  onClick: () => void;
  onSelect: (index: number, selected: boolean) => void;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Tcard: React.FC<TcardProps> = ({
  mode = "normal",
  translationKey,
  translationPreview,
  index,
  onClick,
  onSelect,
  onRemove,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleLeftClick = (event: React.MouseEvent) => {
    // Prevent right-click menu from interfering
    if (event.button === 0) {
      event.stopPropagation();

      // Normal click to open/view
      onClick();
    }
  };

  return (
    <div
      onClick={handleLeftClick}
      className={`relative cursor-pointer border ${
        isSelected
          ? "border-light-primary dark:border-dark-primary bg-primary-light"
          : "border-light-muted/30 dark:border-dark-muted/30"
      } bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary shadow-md hover:shadow-lg rounded p-3 transition max-w-full`}
    >
      {mode === "quick" && (
        <button
          onClick={(e) => (onRemove ? onRemove(e) : null)}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-light-primary dark:hover:bg-dark-primary hover:text-dark-text-primary transition-colors duration-300"
        >
          <X size={14} />
        </button>
      )}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2">
          <FileText size={38} className="mt-1" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{translationKey}</h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary -mt-1">
              {translationPreview}
            </p>
          </div>
        </div>
        {mode === "normal" && (
          <button
            onClick={(e) => (onRemove ? onRemove(e) : null)}
            className="flex p-1 items-center rounded-full text-gray-800 dark:text-gray-300 hover:scale-110 dark:hover:scale-110 transition duration-300"
          >
            <Trash size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Tcard;
