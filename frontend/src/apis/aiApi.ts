import { GoogleGenerativeAI } from "@google/generative-ai";
import { TranslationApi } from "./translationApi";
const REACT_APP_GEMINI_KEY = "AIzaSyBowicWyGh8ZaVtyc6h0a5qhv-Q6Yjicyk"; //shouldnt be here

const API_KEY: string | undefined = REACT_APP_GEMINI_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });
const translationApi = new TranslationApi();

export class AiApi {
  MAIN_PROMPT = `This is a translation helper and managment tool for developers, 
    the goal is to facilitate the creation of multi-language applications. 
    You will help with returning the translations of given words and generating the translations 
    related to certain categories, your response should have no introduction nor conclusion. `;

  languages = "";

  geminiGetAnswer = async (prompt: string) => {
    const result = await model?.generateContent(prompt);

    return result?.response.text();
  };

  promptAi = async (prompt: string) => {
    try {
      const response = this.geminiGetAnswer(prompt);
      return response;
    } catch (e) {
      console.log(`Failed to prompt AI`);
    }
  };

  generateTranslationsForCategory = async (
    name: string,
    description: string
  ) => {
    const languages = await this.getFormattedLanguages();

    const prompt = `${this.MAIN_PROMPT} Given the translation category with this name: ${name}, 
      and this description: ${description}, and for these languages: ${languages}
       give translations as a JSON format of this shape: 
      [{key: translation_key, 
      Language_1: Language_1 translation,
      Language_2: Language_2 translation
      },]
      For example: for a category named "user", and a description "user actions", and languages 
      of english and french, you could return translations as follows, make sure to return a valid JSON.
      [
        {
          key: "user_deleted_successfully", 
          English: "User was deleted successfully",
          French: "L'utilisateur a été supprimé avec succès"
        },
        {
          key: "user_logged_in_successfully", 
          English: "User logged in successfully",
          French: "L'utilisateur s'est connecté avec succès"
       }
      ]"
      `;

    try {
      const response = await this.promptAi(prompt);
      console.log("response in getTranslationsForCategory", response);
      return response;
    } catch (e) {
      console.log(`Failed to get translations for category ${name}`);
    }
  };

  generateTranslationByKey = async (key: string) => {
    const languages = await this.getFormattedLanguages();

    const prompt = `${this.MAIN_PROMPT} Given this translation key: ${key}, give an appropriate translation 
    for these languages: ${languages} following this form: 
      {
        key: ${key}
        Language_1: Language_1 translation,
        Language_2: Language_2 translation      
      }
     For example: for a key "user", and languages of english and french, 
     you could return a translation as follows, make sure to return a valid JSON.
      [
        {
          key: "user_deleted_successfully", 
          English: "User was deleted successfully",
          French: "L'utilisateur a été supprimé avec succès"
        }
      ]
    `;

    try {
      const response = await this.promptAi(prompt);
      console.log("response in generateTranslationByKey", response);
      return response;
    } catch (e) {
      console.log(`Failed to get translation for key: ${key}`);
    }
  };

  getFormattedLanguages = async () => {
    if (this.languages.trim() === "") {
      try {
        this.languages = await translationApi.getLanguages();
      } catch (e) {
        console.log(`Failed to get languages`);
      }
    }

    return this.languages;
  };
}
