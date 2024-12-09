export interface TranslationT {
  id?: string;
  translationKey: string;
  translationPreview: string;
  detailedTranslations: string[];
  categoryName?: string;
  creationDate?: Date;
}

export interface CategoryT {
  id?: string;
  name: string;
  description?: string;
  creationDate?: Date;
}
