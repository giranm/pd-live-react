import i18n from 'i18next';
import {
  initReactI18next,
} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const lngs = {
  'en-US': {
    translation: translationEN,
    nativeName: 'English (United States)',
  },
  'en-GB': {
    translation: translationEN,
    nativeName: 'English (United Kingdom)',
  },
  fr: {
    translation: translationFR,
    nativeName: 'Français',
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources: lngs,
    fallbackLng: 'en', // use en if detected lng is not available
    // lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option,

    // array of allowed languages
    supportedLngs: ['en', 'fr'],
    // if true, will consider variants as supported when the main language is. E.g. en-US will be valid if en is in supportedLngs.
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
