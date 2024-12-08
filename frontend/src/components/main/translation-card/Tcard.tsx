import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";

interface TcardProps {
  translationKey: string;
  translationPreview: string;
  index: number;
  onClick: () => void;
  onSelect: (index: number, selected: boolean) => void;
  isGloballySelected: boolean;
}

const Tcard: React.FC<TcardProps> = ({
  translationKey,
  translationPreview,
  index,
  onClick,
  onSelect,
  isGloballySelected,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  // Reset selection when global selection is cleared
  useEffect(() => {
    if (!isGloballySelected) {
      setIsSelected(false);
    }
  }, [isGloballySelected]);

  const handleLeftClick = (event: React.MouseEvent) => {
    // Prevent right-click menu from interfering
    if (event.button === 0) {
      event.stopPropagation();
      if (isGloballySelected) {
        // When in selection mode, toggle selection
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState);
        onSelect(index, newSelectedState);
      } else {
        // Normal click to open/view
        onClick();
      }
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent context menu
    event.stopPropagation();

    // Toggle selection state
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);
    onSelect(index, newSelectedState);
  };

  return (
    <div
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      className={`cursor-pointer border ${
        isSelected
          ? "border-light-primary dark:border-dark-primary bg-primary-light"
          : "border-light-muted/30 dark:border-dark-muted/30"
      } bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary shadow-md hover:shadow-lg rounded p-3 transition max-w-82 max-w-full`}
    >
      <div className="flex flex-row space-x-2">
        <FileText size={38} className="mt-1" />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{translationKey}</h2>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary -mt-1">
            {translationPreview}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tcard;
