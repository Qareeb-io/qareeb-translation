import React from "react";
import { Edit, FileText, FormInput, Trash, X } from "lucide-react"; // Import Close Icon

interface ViewTCardModalProps {
  isOpen: boolean;
  translation: {
    translationKey: string;
    translationPreview: string;
    detailedTranslations: string[];
  };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ViewTCardModal: React.FC<ViewTCardModalProps> = ({
  isOpen,
  translation,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-light-background dark:bg-dark-background p-6 rounded shadow-lg w-[95%] sm:w-[35%] max-w-full h-auto text-light-text-primary dark:text-dark-text-primary">
        <div className="flex justify-between items-center ">
          <div className="flex flex-row space-x-2">
            <FileText size={38} className="mt-1" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                {translation.translationKey}
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary -mt-1">
                {translation.translationPreview}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-light-primary dark:hover:bg-dark-primary hover:text-dark-text-primary transition-colors duration-300"
          >
            <X size={14} />
          </button>
        </div>

        {/* Translation Details (Listed on Separate Lines) */}
        <div className="mt-4 space-y-2">
          {translation.detailedTranslations.map((detail, index) => {
            // Split the detail into language and translation parts
            const [language, translationText] = detail.split(": ");

            return (
              <p
                key={index}
                className="text-base text-light-text-secondary dark:text-dark-text-secondary"
              >
                <span className="font-bold">{language}:</span> {translationText}
              </p>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Edit className="mr-2" size={20} />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash className="mr-2" size={20} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTCardModal;
