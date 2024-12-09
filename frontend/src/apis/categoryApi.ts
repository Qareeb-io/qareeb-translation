import { CategoryT, TranslationT } from "../utils/types";

export class CategoryApi {
  rootUrl = "/api/category";
  getAllCategories = async () => {
    try {
      const response = await fetch(`${this.rootUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get categories");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  };

  getCategory = async (category: CategoryT) => {
    try {
      const response = await fetch(`${this.rootUrl}/${category.name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting category:", error);
      throw error;
    }
  };

  addCategory = async (category: CategoryT) => {
    try {
      const response = await fetch(`${this.rootUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  updateCategory = async (category: CategoryT) => {
    try {
      const response = await fetch(`${this.rootUrl}/${category.name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  insertTranslationBulk = async (
    categoryName: string,
    translations: TranslationT[]
  ) => {
    try {
      const response = await fetch(
        `${this.rootUrl}/${categoryName}/translations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translations),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to insert translations");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error inserting translations", error);
      throw error;
    }
  };
}
