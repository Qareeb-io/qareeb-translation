import React, { useEffect, useState, useRef } from "react";
import Tcard from "./translation-card/Tcard";
import SearchBar from "../ui/SearchBar";
import CustomButton from "../ui/CustomButton";
import { Plus, Trash } from "lucide-react";
import ViewTCardModal from "./translation-card/ViewTCardModal";
import { Translation } from "../../utils/types";
import AddEditTCardModal from "./translation-card/AddEditTCardModal";
import DeleteTCardModal from "./translation-card/DeleteTCardModal";
import useScreen from "../../hooks/useScreen";
import { TranslationApi } from "../../apis/translationApi";

const Main: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([
    {
      translationKey: "Welcome Message",
      translationPreview: "Welcome to the app",
      detailedTranslations: [
        "English: Welcome to the app",
        "Spanish: Bienvenido a la aplicación",
      ],
    },
    {
      translationKey: "Logout Message",
      translationPreview: "You have logged out",
      detailedTranslations: [
        "English: You have logged out",
        "Spanish: Has cerrado sesión",
      ],
    },
    {
      translationKey: "Error Message",
      translationPreview: "An error has occurred",
      detailedTranslations: [
        "English: An error has occurred",
        "Spanish: Ha ocurrido un error",
      ],
    },
  ]);
  const [filteredTranslations, setFilteredTranslations] =
    useState<Translation[]>(translations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTranslation, setSelectedTranslation] =
    useState<Translation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const { isSmallScreen } = useScreen();
  const translationApi = new TranslationApi();
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedCards(new Set()); // Unselect all cards
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddTranslationClick = () => {
    setIsAddEditModalOpen(true);
  };

  const handleCardClick = (translation: Translation) => {
    setSelectedTranslation(translation);
    setIsViewModalOpen(true);
  };

  const handleSelectCard = (index: number, selected: boolean) => {
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

  const addTranslation = async (translation: Translation) => {
    try {
      const response = await translationApi.addTranslation(translation);
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
  };

  const editTranslation = async (translation: Translation) => {
    try {
      const response = await translationApi.updateTranslation(
        selectedTranslation?.id!,
        translation
      );
      console.log({ response });
    } catch (e) {
      console.log("error", e);
    }
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
            onClick={handleAddTranslationClick}
            text={`${isSmallScreen ? "Add" : "Add Translation"}`}
            icon={<Plus />}
            className="w-28 md:w-60"
          />
        </div>
      </div>

      {/* Translation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTranslations.map((translation, index) => (
          <Tcard
            key={index}
            index={index}
            translationKey={translation.translationKey}
            translationPreview={translation.translationPreview}
            onClick={() => handleCardClick(translation)}
            onSelect={handleSelectCard}
            isGloballySelected={selectedCards.size > 0}
          />
        ))}
      </div>

      {selectedTranslation && (
        <ViewTCardModal
          isOpen={isViewModalOpen}
          translation={selectedTranslation}
          onClose={() => {
            setSelectedTranslation(null);
            setIsViewModalOpen(false);
          }}
          onEdit={() => setIsAddEditModalOpen(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
        />
      )}

      <AddEditTCardModal
        mode={selectedTranslation ? "edit" : "add"}
        isOpen={isAddEditModalOpen}
        translation={selectedTranslation}
        onAdd={addTranslation}
        onEdit={editTranslation}
        onClose={() => {
          setSelectedTranslation(null);
          setIsAddEditModalOpen(false);
        }}
      />

      <DeleteTCardModal
        isOpen={isDeleteModalOpen}
        translation={selectedTranslation!}
        selectedCards={selectedCards}
        onDelete={() =>
          selectedCards ? deleteSelectedCards() : deleteTranslation()
        }
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </main>
  );
};

export default Main;
