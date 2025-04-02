import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from './en.json';
import esTranslations from './es.json';

const resources = {
    en: {
        translation: {
            ...enTranslations,
            settings: "Settings",
            theme: "App Theme",
        }
    },
    es: {
        translation: {
            ...esTranslations,
            settings: "Configuraciones",
            theme: "Tema de la aplicación",
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "es", // Idioma por defecto
    fallbackLng: "es",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;