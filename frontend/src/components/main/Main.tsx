import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../ui/SearchBar";
import CustomButton from "../ui/CustomButton";
import { Plus, Trash } from "lucide-react";
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
  const [translations, setTranslations] = useState<TranslationT[]>([
    /* Placeholder translations */
  ]);
  const [filteredTranslations, setFilteredTranslations] =
    useState<TranslationT[]>(translations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTranslation, setSelectedTranslation] =
    useState<TranslationT | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isAddEdiCategoryOpen, setIsAddEdiCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryT>();
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const { isSmallScreen } = useScreen();
  const translationApi = new TranslationApi();
  const categoryApi = new CategoryApi();
  const containerRef = useRef<HTMLDivElement>(null);

  // Placeholder category data
  const categories = [
    {
      icon: <Plus />, // Add an appropriate icon here
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
      icon: <Trash />, // Add an appropriate icon here
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
  ];

  useEffect(() => {
    const getTranslations = async () => {
      const translations = await translationApi.getTranslations();
      if (translations) {
        setTranslations(translations);
        setFilteredTranslations(translations);
      }
    };

    getTranslations();
  }, []);

  useEffect(() => {
    const results = translations.filter((translation) =>
      translation.translationKey
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredTranslations(results);
  }, [searchQuery, translations]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
    setIsViewModalOpen(true);
  };

  const handleTranslationSelect = (index: number, selected: boolean) => {
    setSelectedCards((prev) => {
      const updated = new Set(prev);
      if (selected) {
        updated.add(index);
      } else {
        updated.delete(index);
      }
      return updated;
    });
  };

  const handleEditCategory = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleDeleteCategory = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
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

  const deleteTranslation = async () => {
    try {
      const response = await translationApi.deleteTranslation(
        selectedTranslation?.id!
      );
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
    setSelectedCategory(undefined);
  };

  const deleteSelectedCards = async () => {
    const selectedIds = Array.from(selectedCards).map(
      (index) => translations[index].id
    );

    const remainingTranslations = translations.filter(
      (_, index) => !selectedCards.has(index)
    );

    setTranslations(remainingTranslations);
    setFilteredTranslations(remainingTranslations);
    setSelectedCards(new Set());

    try {
      const response = await translationApi.deleteTranslationBulk(selectedIds);
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
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

  return (
    <main
      ref={containerRef}
      className="p-6 bg-light-background dark:bg-dark-background flex flex-col gap-6"
    >
      {/* Search Bar and Buttons */}
      <div className="flex items-center justify-between">
        {!(selectedCards.size > 0 && isSmallScreen) && (
          <SearchBar onSearch={handleSearch} />
        )}
        <div className="flex gap-2 justify-between">
          {selectedCards.size > 0 && (
            <CustomButton
              onClick={() => setIsDeleteModalOpen(true)}
              text={`${isSmallScreen ? "Delete" : "Delete Selected"}`}
              icon={<Trash size={20} className="mb-1" />}
              className="bg-red-500 text-white w-35 md:w-52"
            />
          )}
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
        {categories.map((category, index) => (
          <Category
            key={index}
            icon={category.icon}
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
            deleteTranslation();
          }}
        />
      )}

      <DeleteModal
        mode="category"
        isOpen={isDeleteModalOpen}
        translation={selectedTranslation!}
        selectedCards={selectedCards}
        onDelete={() => {}}
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
