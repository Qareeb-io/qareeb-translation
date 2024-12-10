import React, { useState, useEffect } from "react";
import { Check, Loader, Pencil, Plus, X, Zap } from "lucide-react";
import { CategoryT, TranslationT } from "../../../utils/types";
import { AiApi } from "../../../apis/aiApi";
import Tcard from "../translation-card/Tcard";
import Alert from "../../ui/Alert";
import { cleanJsonResponse } from "../../../utils/helper";

interface AddEditCategoryProps {
  isOpen: boolean;
  mode: "edit" | "add";
  category: CategoryT | undefined;
  onAdd: (newCategory: CategoryT, t: TranslationT[]) => void;
  onEdit: (updatedCategory: CategoryT) => void;
  onClose: () => void;
  onViewTranslation: (t: TranslationT) => void;
}

const AddEditCategory: React.FC<AddEditCategoryProps> = ({
  isOpen,
  mode,
  category,
  onAdd,
  onEdit,
  onClose,
  onViewTranslation,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<TranslationT[]>([]);
  const [status, setStatus] = useState<{
    status: string;
    message: string;
    bg?: string;
  }>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const aiApi = new AiApi();

  useEffect(() => {
    if (category) {
      setName(category.name);
      if (category.description) setDescription(category.description);
    }
  }, [category]);

  const handleClose = () => {
    setName("");
    setDescription("");
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    if (name.trim() === "") {
      setErrors({ name: "Category name is required" });
      return;
    }

    const newCategory = { name, description };

    if (category) {
      onEdit(newCategory);
    } else {
      onAdd(newCategory, translations);
    }

    handleClose();
  };

  const generateTranslations = async () => {
    setErrors({});
    if (name.trim() === "") {
      setErrors({ name: "Category name is required" });
      return;
    }

    if (description.trim() === "") {
      setErrors({ description: "Category description is required" });
      return;
    }

    setLoading(true);

    try {
      const response = await aiApi.generateTranslationsForCategory(
        name,
        description
      );
      if (response) {
        let cleanedResponse = cleanJsonResponse(response);

        const jsonResponse = JSON.parse(cleanedResponse);

        // Format the response
        const formattedTranslations: TranslationT[] = jsonResponse.map(
          (translation: {
            key: string;
            English: string;
            French: string;
            Arabic: string;
          }) => ({
            translationKey: translation.key,
            translationPreview: translation.English,
            detailedTranslations: [
              `English: ${translation.English}`,
              `French: ${translation.French}`,
              `Arabic: ${translation.Arabic}`,
            ],
          })
        );

        console.log({ formattedTranslations });
        setTranslations(formattedTranslations);
      } else {
        setStatus({
          status: "Something went wrong",
          message: "Please try again",
        });
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
        }, 3000);
      }
    } catch (e) {
      console.log("Error", e);
    }

    setLoading(false);
  };

  const handleTranslationRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    translation: TranslationT
  ) => {
    e.stopPropagation();
    console.log({ translation });
    const newTranslations = translations.filter(
      (t) => t.translationKey !== translation.translationKey
    );
    setTranslations(newTranslations);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
      <div
        className={`bg-light-background dark:bg-dark-background p-6 rounded-lg w-[95%] ${
          translations.length < 1
            ? "md:w-[35%] h-[85vh]"
            : "md:w-[60%] h-[98vh]"
        } max-w-full overflow-y-auto dark:dark-scrollbar light-scrollbar flex flex-col text-light-text-primary dark:text-dark-text-primary`}
      >
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center">
            {category ? <Pencil className="mr-2" /> : <Plus className="mr-2" />}
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-light-primary dark:hover:bg-dark-primary hover:text-dark-text-primary transition-colors duration-300"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1">
          <div className="mt-4">
            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              Name
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                className={`w-full pl-3 pr-4 py-3 mt-1 rounded border border-light-muted/30 bg-light-surface/50 dark:bg-dark-surface/50 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary mb-2 ${
                  errors["name"]
                    ? "border-red-500 focus:ring-0 dark:focus:ring-0"
                    : "border-light-muted/30"
                }`}
              />
              {errors["name"] && (
                <p className="text-sm text-red-500 mb-3">{errors["name"]}</p>
              )}
            </div>

            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              Description
            </label>
            <div className="relative mt-1">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category Description"
                className={`w-full pl-3 pr-4 py-3 mt-1 ${
                  mode === "add" ? "h-[6rem]" : "h-[12rem]"
                } rounded border border-light-muted/30 bg-light-surface/50 dark:bg-dark-surface/50 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary
                 ${
                   errors["description"]
                     ? "border-red-500 focus:ring-0 dark:focus:ring-0"
                     : "border-light-muted/30"
                 }`}
              />
            </div>
            {errors["description"] && (
              <p className="text-sm text-red-500 mb-3">
                {errors["description"]}
              </p>
            )}
            {mode === "add" && (
              <div>
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  Translations
                </label>
                <div>
                  <button
                    onClick={generateTranslations}
                    className="flex items-center justify-center px-4 py-2 mt-2 bg-light-primary dark:bg-dark-primary hover:bg-light-accentPrimary dark:hover:bg-dark-accentPrimary text-white rounded transition duration-300 flex items-center gap-2"
                  >
                    {loading ? <Loader className="animate-spin" /> : <Zap />}
                    Generate Translations
                  </button>
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {translations &&
                        translations.length > 0 &&
                        translations.map((translation, index) => (
                          <Tcard
                            mode="quick"
                            key={index}
                            translationKey={translation.translationKey}
                            translationPreview={translation.translationPreview}
                            onClick={() => onViewTranslation(translation)}
                            onSelect={(selected) =>
                              console.log("Selected:", selected)
                            }
                            index={index}
                            onRemove={(e) =>
                              handleTranslationRemove(e, translation)
                            }
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-light-primary dark:bg-dark-primary hover:bg-light-accentPrimary dark:hover:bg-dark-accentPrimary text-white rounded transition duration-300 flex items-center gap-2"
          >
            <Check />
            {category ? "Save Changes" : "Add Category"}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <X />
            Cancel
          </button>
        </div>
      </div>
      {isAlertOpen && (
        <Alert
          title={status?.status}
          message={status?.message}
          onClose={() => setIsAlertOpen(false)}
        />
      )}
    </div>
  );
};

export default AddEditCategory;
