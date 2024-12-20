import React, { useState, useEffect } from "react";
import { CategoryT, TranslationT } from "../../../utils/types";
import {
  Pencil,
  Check,
  X,
  Plus,
  Globe,
  Key,
  FileText,
  Zap,
  Loader,
} from "lucide-react";
import { TranslationApi } from "../../../apis/translationApi";
import { AiApi } from "../../../apis/aiApi";
import { cleanJsonResponse } from "../../../utils/helper";

interface AddEditTCardModalProps {
  isOpen: boolean;
  mode: "edit" | "add";
  translation: TranslationT | null;
  category: CategoryT | undefined;
  onAdd: (newTranslation: TranslationT) => void;
  onEdit: (updatedTranslation: TranslationT) => void;
  onClose: () => void;
}

type TranslationDetails = {
  [key: string]: string;
};

const AddEditTCardModal: React.FC<AddEditTCardModalProps> = ({
  isOpen,
  mode,
  translation,
  category,
  onAdd,
  onEdit,
  onClose,
}) => {
  const [translationKey, setTranslationKey] = useState("");
  const [translationPreview, setTranslationPreview] = useState("");
  const translationApi = new TranslationApi();
  const aiApi = new AiApi();
  const [loading, setLoading] = useState(false);
  const [detailedTranslations, setDetailedTranslations] =
    useState<TranslationDetails>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [allowedLanguages, setAllowedLanguages] = useState("");

  useEffect(() => {
    if (translation) {
      setTranslationKey(translation.translationKey);
      setTranslationPreview(translation.translationPreview);
      // Convert the detailedTranslations array into an object for easier access
      const translationDetails: TranslationDetails =
        translation.detailedTranslations.reduce((acc, detail) => {
          const [language, translationText] = detail.split(": ");
          acc[language] = translationText;
          return acc;
        }, {} as TranslationDetails);

      setDetailedTranslations(translationDetails);
    }
  }, [translation]);

  useEffect(() => {
    const getLanguages = async () => {
      const cacheKey = "cachedLanguages";
      const cacheExpirationKey = "cachedLanguagesExpiration";

      // Check if cached data is available and valid
      const cachedLanguages = localStorage.getItem(cacheKey);
      const cacheExpiration = localStorage.getItem(cacheExpirationKey);

      if (cachedLanguages && cacheExpiration) {
        const isCacheValid = new Date() < new Date(cacheExpiration);
        if (isCacheValid) {
          setAllowedLanguages(JSON.parse(cachedLanguages));
          return;
        }
      }

      // Fetch data from API if cache is expired or missing
      const response = await translationApi.getLanguages();
      console.log({ response });
      if (response) {
        setAllowedLanguages(response);

        // Store data and set expiration (1 day)
        localStorage.setItem(cacheKey, JSON.stringify(response));
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        localStorage.setItem(cacheExpirationKey, expirationDate.toISOString());
      }
    };

    getLanguages();
  }, []);

  const handleClose = () => {
    setTranslationKey("");
    setTranslationPreview("");
    setDetailedTranslations({});
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    language: string
  ) => {
    setDetailedTranslations((prevState) => ({
      ...prevState,
      [language]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (translationKey.trim() === "") {
      setErrors({ key: "Translation key is required" });
      return;
    }

    if (!detailedTranslations["English"]) {
      setErrors({ English: "English translation is required" });
      return;
    }

    const newTranslation: TranslationT = {
      translationKey,
      translationPreview,
      detailedTranslations: Object.entries(detailedTranslations).map(
        ([language, translationText]) => `${language}: ${translationText}`
      ),
    };

    newTranslation.categoryName = category?.name;

    if (translation) {
      onEdit(newTranslation);
    } else {
      onAdd(newTranslation);
    }
    handleClose();
  };

  const getTranslations = async () => {
    setErrors({});

    if (translationKey.trim() === "") {
      setErrors({ key: "Translation key is required" });
      return;
    }
    setLoading(true);
    try {
      const response = await aiApi.generateTranslationByKey(translationKey);
      console.log({ response });
      if (response) {
        const cleanedResponse = cleanJsonResponse(response);
        const jsonResponse = JSON.parse(cleanedResponse);

        // Convert the JSON response into the format required for detailedTranslations
        const translations = jsonResponse.reduce(
          (
            acc: TranslationDetails,
            translation: { key: string; [key: string]: string }
          ) => {
            Object.keys(translation).forEach((language) => {
              if (language !== "key") {
                acc[language] = translation[language];
              }
            });
            return acc;
          }
        );

        setDetailedTranslations(translations);
        setTranslationPreview(translations["English"] || "");
      }
    } catch (e) {
      console.log("error", e);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-light-background dark:bg-dark-background p-6 rounded-lg md:w-[40%] sm:w-[95%] max-w-full h-[98vh] overflow-y-auto dark:dark-scrollbar light-scrollbar flex flex-col text-light-text-primary dark:text-dark-text-primary">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center">
            {translation ? (
              <Pencil className="mr-2" />
            ) : (
              <Plus className="mr-2" />
            )}
            {translation ? "Edit Translation" : "Add Translation"}
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
              Key
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                <Key
                  size={20}
                  className={`text-light-primary dark:text-dark-primary  ${
                    errors["key"] ? "mb-5" : "mb-1"
                  }`}
                />
              </span>
              <input
                type="text"
                value={translationKey}
                onChange={(e) => setTranslationKey(e.target.value)}
                placeholder="Translation Key"
                className={`w-full pl-10 pr-4 py-3 mt-1 rounded border border-light-muted/30  bg-light-surface/50 dark:bg-dark-surface/50 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary mb-2 

                ${
                  errors["key"]
                    ? "border-red-500 focus:ring-0 dark:focus:ring-0"
                    : "border-light-muted/30"
                } `}
              />
              {errors["key"] && (
                <p className="text-sm text-red-500 mb-3">{errors["key"]}</p>
              )}
            </div>
            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              Preview
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                <FileText
                  size={20}
                  className="mb-1 text-light-primary dark:text-dark-primary"
                />
              </span>
              <input
                type="text"
                value={translationPreview}
                onChange={(e) => setTranslationPreview(e.target.value)}
                placeholder="Translation Preview"
                className="w-full pl-10 pr-4 py-3 mt-1 rounded border border-light-muted/30 bg-light-surface/50 dark:bg-dark-surface/50 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary mb-2"
              />
            </div>

            <div className="grid grid-cols-1">
              {allowedLanguages &&
                allowedLanguages.split(", ").map((language) => (
                  <div key={language} className="relative">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {language}
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
                        <Globe
                          size={20}
                          className="mb-1 text-light-primary dark:text-dark-primary"
                        />
                      </span>
                      <input
                        type="text"
                        value={detailedTranslations[language] || ""}
                        onChange={(e) => handleInputChange(e, language)}
                        placeholder={`${language} Translation`}
                        className={`w-full pl-10 pr-4 py-3 rounded border  bg-light-surface/50 dark:bg-dark-surface/50 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary mb-2 ${
                          errors[language]
                            ? "border-red-500 focus:ring-0 dark:focus:ring-0"
                            : "border-light-muted/30"
                        }`}
                      />
                    </div>
                    {errors[language] && (
                      <p className="text-sm text-red-500">{errors[language]}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <div className="flex flex-row space-x-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-light-primary dark:bg-dark-primary hover:bg-light-accentPrimary dark:hover:bg-dark-accentPrimary text-white rounded transition duration-300 flex items-center gap-2"
            >
              <Check />
              {translation ? "Save" : "Add"}
            </button>
            {mode === "add" && (
              <button
                onClick={getTranslations}
                className="px-4 py-2 bg-light-primary dark:bg-dark-primary hover:bg-light-accentPrimary dark:hover:bg-dark-accentPrimary text-white rounded transition duration-300 flex items-center gap-2"
              >
                {loading ? <Loader className="animate-spin" /> : <Zap />}
                AI
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <X />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTCardModal;
