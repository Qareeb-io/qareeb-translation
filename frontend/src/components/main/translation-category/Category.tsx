import React, { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import Tcard from "../translation-card/Tcard";
import { TranslationT } from "../../../utils/types";

interface CategoryProps {
  isOpenDynamic: boolean;
  icon: React.ReactNode;
  name: string;
  translations: TranslationT[];
  onAddTranslation: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEditCategory: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDeleteCategory: (e: React.MouseEvent<HTMLDivElement>) => void;
  onViewTranslation: (translation: TranslationT) => void;
  onRemoveTranslation: (translation: TranslationT) => void;
}

const Category: React.FC<CategoryProps> = ({
  isOpenDynamic,
  icon,
  name,
  translations,
  onAddTranslation,
  onEditCategory,
  onDeleteCategory,
  onViewTranslation,
  onRemoveTranslation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-w-4xl">
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
          {(isOpen || isOpenDynamic) && (
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
      {(isOpen || isOpenDynamic) && (
        <div className="p-4 grid grid-cols-1 gap-4">
          {translations.map((translation, index) => (
            <Tcard
              key={index}
              translationKey={translation.translationKey}
              translationPreview={translation.translationPreview}
              onClick={() => onViewTranslation(translation)}
              onRemove={(e) => {
                e.stopPropagation();
                onRemoveTranslation(translation);
              }}
              onSelect={(selected) => console.log("Selected:", selected)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
