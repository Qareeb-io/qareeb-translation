import React from "react";
import { Translation } from "../../../utils/types";
import { Trash, X } from "lucide-react"; // Import icons for the buttons

interface DeleteTCardModalProps {
  isOpen: boolean;
  translation: Translation | null;
  selectedCards: Set<number>;
  onDelete: (translationKey: string) => void;
  onClose: () => void;
}

const DeleteTCardModal: React.FC<DeleteTCardModalProps> = ({
  isOpen,
  translation,
  selectedCards,
  onDelete,
  onClose,
}) => {
  const handleDelete = () => {
    if (translation) {
      onDelete(translation.translationKey);
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
        {selectedCards ? (
          <p className="mt-4 text-light-text-primary dark:text-dark-text-primary">
            Are you sure you want to delete the selected translations?
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

export default DeleteTCardModal;
