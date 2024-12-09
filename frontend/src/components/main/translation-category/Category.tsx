import React, { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import Tcard from "../translation-card/Tcard";
import { TranslationT } from "../../../utils/types";

interface CategoryProps {
  icon: React.ReactNode;
  name: string;
  translations: TranslationT[];
  onAddTranslation: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEditCategory: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDeleteCategory: (e: React.MouseEvent<HTMLDivElement>) => void;
  onViewTranslation: (translation: TranslationT) => void;
}

const Category: React.FC<CategoryProps> = ({
  icon,
  name,
  translations,
  onAddTranslation,
  onEditCategory,
  onDeleteCategory,
  onViewTranslation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-light-primary dark:bg-dark-primary/70 text-white rounded-t-lg cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-4">
          <div className="text-lg">{icon}</div>
          <span className="font-medium text-lg">{name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="hover:scale-110 dark:hover:scale-105 transiton duration-300"
            onClick={(e) => onAddTranslation(e)}
          >
            <Plus />
          </div>
          {isOpen && (
            <div className="flex flex-row space-x-2">
              <div
                className="hover:scale-110 dark:hover:scale-105 transiton duration-300"
                onClick={(e) => onEditCategory(e)}
              >
                <Edit />
              </div>
              <div
                className="hover:scale-110 dark:hover:scale-105 transiton duration-300"
                onClick={(e) => onDeleteCategory(e)}
              >
                <Trash />
              </div>
            </div>
          )}
          <div className="hover:scale-110 dark:hover:scale-105 transiton duration-300">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {translations.map((translation, index) => (
            <Tcard
              key={index}
              translationKey={translation.translationKey}
              translationPreview={translation.translationPreview}
              onClick={() => onViewTranslation(translation)}
              onSelect={(selected) => console.log("Selected:", selected)}
              index={index}
              isGloballySelected={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
