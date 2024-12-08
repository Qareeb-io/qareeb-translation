import { Translation } from "../utils/types";

export class TranslationApi {
  rootUrl = "/api/translations";

  getTranslations = async () => {
    try {
      const response = await fetch(`${this.rootUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching translations:", error);
      throw error;
    }
  };

  getTranslation = async (translationId: string) => {
    try {
      const response = await fetch(`${this.rootUrl}/${translationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch translation with ID: ${translationId}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error fetching translation with ID: ${translationId}`,
        error
      );
      throw error;
    }
  };

  addTranslation = async (translation: Translation) => {
    try {
      const response = await fetch(`${this.rootUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(translation),
      });

      if (!response.ok) {
        throw new Error("Failed to create translation");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating translation:", error);
      throw error;
    }
  };

  updateTranslation = async (
    translationId: string,
    translation: Translation
  ) => {
    try {
      const response = await fetch(`${this.rootUrl}/${translationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ translation }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update translation with ID: ${translationId}`
        );
      }
      console.log("response in updateBusiness", response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error updating translation with ID: ${translationId}`,
        error
      );
      throw error;
    }
  };

  deleteTranslation = async (translationId: string) => {
    try {
      const response = await fetch(`${this.rootUrl}/${translationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete translation with ID: ${translationId}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error deleting translation with ID: ${translationId}`,
        error
      );
      throw error;
    }
  };

  deleteTranslationBulk = async (translationsIds: (string | undefined)[]) => {
    try {
      const response = await fetch(`${this.rootUrl}/delete-bulk`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ translationsIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete translations`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting translations`, error);
      throw error;
    }
  };

  //get allowed languages in configuration
  getLanguages = async () => {
    try {
      const response = await fetch(`${this.rootUrl}/languages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  };
}
