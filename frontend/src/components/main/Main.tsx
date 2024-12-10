import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../ui/SearchBar";
import CustomButton from "../ui/CustomButton";
import { Plus, Tag } from "lucide-react";
import ViewTCardModal from "./translation-card/ViewTCardModal";
import { TranslationT, CategoryT } from "../../utils/types";
import AddEditTCardModal from "./translation-card/AddEditTCardModal";
import DeleteModal from "./translation-card/DeleteModal";
import useScreen from "../../hooks/useScreen";
import { TranslationApi } from "../../apis/translationApi";
import Category from "./translation-category/Category";
import AddEditCategory from "./translation-category/AddEditCategory";
import { CategoryApi } from "../../apis/categoryApi";

const Main: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTranslation, setSelectedTranslation] =
    useState<TranslationT | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isAddEdiCategoryOpen, setIsAddEdiCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryT>();
  const [isCategoryOpenDynamically, setIsCategoryOpenDynamically] =
    useState(false);
  const { isSmallScreen } = useScreen();
  const translationApi = new TranslationApi();
  const categoryApi = new CategoryApi();
  const containerRef = useRef<HTMLDivElement>(null);

  // Placeholder category data
  const [categories, setCategories] = useState([
    {
      name: "Greetings",
      translations: [
        {
          translationKey: "Welcome Message",
          translationPreview: "Welcome to the app",
          detailedTranslations: [
            "English: Welcome to the app",
            "Spanish: Bienvenido a la aplicación",
          ],
        },
        {
          translationKey: "Goodbye Message",
          translationPreview: "Goodbye",
          detailedTranslations: ["English: Goodbye", "Spanish: Adiós"],
        },
      ],
    },
    {
      name: "Errors",
      translations: [
        {
          translationKey: "Error Message",
          translationPreview: "An error has occurred",
          detailedTranslations: [
            "English: An error has occurred",
            "Spanish: Ha ocurrido un error",
          ],
        },
        {
          translationKey: "Timeout Message",
          translationPreview: "Request timed out",
          detailedTranslations: [
            "English: Request timed out",
            "Spanish: La solicitud ha expirado",
          ],
        },
      ],
    },
  ]);
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    const getCategories = async () => {
      const categories = await categoryApi.getAllCategories();
      if (categories) {
        setCategories(categories);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      // Reset to original data when search query is empty
      setFilteredCategories(categories);
      return;
    }

    const filteredCategories = categories
      .map((category) => {
        // Check if the category name matches
        const categoryNameMatches = category.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Filter translations within the category
        const filteredTranslations = category.translations.filter(
          (translation) =>
            translation.translationKey
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            translation.translationPreview
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            translation.detailedTranslations.some((detail) =>
              detail.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

        // Include the category:
        // - If the category name matches, include all translations
        // - If only translations match, include the category with filtered translations
        if (categoryNameMatches || filteredTranslations.length > 0) {
          return {
            ...category,
            translations: categoryNameMatches
              ? category.translations
              : filteredTranslations,
          };
        }

        return null; // Exclude categories that don't match
      })
      .filter(
        (
          category
        ): category is {
          name: string;
          translations: {
            translationKey: string;
            translationPreview: string;
            detailedTranslations: string[];
          }[];
        } => category !== null
      ); // Type guard for non-null values

    setFilteredCategories(filteredCategories);
  }, [searchQuery, categories]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query !== "" && filteredCategories.length > 0) {
      setIsCategoryOpenDynamically(true);
      return;
    }
    if (query === "") {
      setIsCategoryOpenDynamically(false);
    }
  };

  const handleAddTranslationClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    category: CategoryT
  ) => {
    e.stopPropagation();
    setIsAddEditModalOpen(true);
    setSelectedCategory(category);
  };

  const handleTranslationClick = (translation: TranslationT) => {
    setSelectedTranslation(translation);
    setIsAddEditModalOpen(true);
  };

  const addTranslation = async (translation: TranslationT) => {
    try {
      const response = await translationApi.addTranslation(translation);
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
    //unselect the category after an action
    setSelectedCategory(undefined);
  };

  const editTranslation = async (translation: TranslationT) => {
    try {
      const response = await translationApi.updateTranslation(
        selectedTranslation?.id!,
        translation
      );
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
    setSelectedCategory(undefined);
  };

  const deleteTranslation = async (t: TranslationT) => {
    try {
      const response = await translationApi.deleteTranslation(t?.id!);
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
    setSelectedCategory(undefined);
  };

  const addCategory = async (
    category: CategoryT,
    translations: TranslationT[]
  ) => {
    try {
      const response = await categoryApi.addCategory(category);
      console.log({ response });
      const response_2 = await categoryApi.insertTranslationBulk(
        category.name,
        translations
      );
      console.log({ response_2 });
    } catch (e) {
      console.log("Error", e);
    }
    setSelectedCategory(undefined);
  };

  const editCategory = async (category: CategoryT) => {
    try {
      const response = await categoryApi.updateCategory(category);
      console.log({ response });
    } catch (e) {
      console.log("Error", e);
    }
    setSelectedCategory(undefined);
  };

  const deleteCategory = async (category: CategoryT) => {
    try {
      const response = await categoryApi.deleteCategory(category);
      console.log({ response });
    } catch (e) {
      console.log("Error", e);
    }
    setSelectedCategory(undefined);
  };

  return (
    <main
      ref={containerRef}
      className="p-6 bg-light-background dark:bg-dark-background flex flex-col gap-6"
    >
      {/* Search Bar and Buttons */}
      <div className="flex items-center justify-between max-w-4xl">
        <SearchBar onSearch={handleSearch} />
        <div className="flex gap-2 justify-between">
          <CustomButton
            onClick={() => setIsAddEdiCategoryOpen(true)}
            text={`${isSmallScreen ? "Add" : "Add Category"}`}
            icon={<Plus />}
            className="w-28 md:w-60"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mt-2 space-y-6">
        {filteredCategories.map((category, index) => (
          <Category
            isOpenDynamic={isCategoryOpenDynamically}
            key={index}
            icon={<Tag />}
            name={category.name}
            translations={category.translations}
            onAddTranslation={(e) => handleAddTranslationClick(e, category)}
            onViewTranslation={(translation) =>
              handleTranslationClick(translation)
            }
            onEditCategory={(e) => {
              e.stopPropagation();
              setSelectedCategory(category);
              setIsAddEdiCategoryOpen(true);
            }}
            onDeleteCategory={(e) => {
              e.stopPropagation();
              setSelectedCategory(category);
              setIsDeleteModalOpen(true);
            }}
            onRemoveTranslation={(t) => {
              deleteTranslation(t);
            }}
          />
        ))}
      </div>

      {/* Modals */}
      <AddEditCategory
        isOpen={isAddEdiCategoryOpen}
        mode={selectedCategory ? "edit" : "add"}
        category={selectedCategory}
        onAdd={addCategory}
        onEdit={editCategory}
        onClose={() => {
          setIsAddEdiCategoryOpen(false);
          setSelectedCategory(undefined);
        }}
        onViewTranslation={(t) => handleTranslationClick(t)}
      />

      {selectedTranslation && (
        <ViewTCardModal
          isOpen={isViewModalOpen}
          translation={selectedTranslation}
          onClose={() => {
            setSelectedTranslation(null);
            setIsViewModalOpen(false);
          }}
          onEdit={() => setIsAddEditModalOpen(true)}
          onDelete={() => {
            setIsViewModalOpen(false);
            deleteTranslation(selectedTranslation);
          }}
        />
      )}

      <DeleteModal
        mode="category"
        isOpen={isDeleteModalOpen}
        category={selectedCategory!}
        onDelete={() =>
          selectedCategory ? deleteCategory(selectedCategory) : null
        }
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <AddEditTCardModal
        mode={selectedTranslation ? "edit" : "add"}
        isOpen={isAddEditModalOpen}
        translation={selectedTranslation}
        category={selectedCategory}
        onAdd={(t) => addTranslation(t)}
        onEdit={(t) => editTranslation(t)}
        onClose={() => {
          setSelectedTranslation(null);
          setIsAddEditModalOpen(false);
        }}
      />
    </main>
  );
};

export default Main;
