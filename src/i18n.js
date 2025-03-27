import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en.json";
import deTranslations from "./locales/de.json";
import esTranslations from "./locales/es.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: localStorage.getItem("_lang") || undefined,
    resources: {
      en: { translation: enTranslations },
      de: { translation: deTranslations },
      es: { translation: esTranslations },
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    debug: true, // Enable debug mode for additional logs
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    // Log the detected language and LanguageDetector
    console.log("Detected language:", i18n.language);
    console.log("LanguageDetector module:", LanguageDetector);
  });

export default i18n;
