import React from "react";
import { CategoryT, TranslationT } from "../../../utils/types";
import { Trash, X } from "lucide-react"; // Import icons for the buttons

interface DeleteModalProps {
  mode: "translation" | "category";
  isOpen: boolean;
  category?: CategoryT | null;
  translation?: TranslationT | null;
  onDelete: (translationKey: string) => void;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  mode,
  isOpen,
  category,
  translation,
  onDelete,
  onClose,
}) => {
  const handleDelete = () => {
    if (category) {
      onDelete(category.name);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-light-background dark:bg-dark-background p-6 rounded shadow-lg w-96 max-w-full">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center">
            <Trash className="mr-2" />
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-light-primary dark:hover:bg-dark-primary hover:text-dark-text-primary transition-colors duration-300"
          >
            <X size={14} />
          </button>
        </div>
        {mode === "category" ? (
          <p className="mt-4 text-light-text-primary dark:text-dark-text-primary">
            Are you sure you want to delete this category?
          </p>
        ) : (
          <p className="mt-4 text-light-text-primary dark:text-dark-text-primary">
            Are you sure you want to delete the translation "
            {translation?.translationKey}"?
          </p>
        )}
        <div className="mt-6 flex justify-between gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <Trash />
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <X />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
