import i18n from 'i18next';
import {
  initReactI18next,
} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import gb from 'date-fns/locale/en-GB';
import us from 'date-fns/locale/en-US';
import fr from 'date-fns/locale/fr';
import es from 'date-fns/locale/es';
import de from 'date-fns/locale/de';
import ja from 'date-fns/locale/ja';
import {
  registerLocale,
} from 'react-datepicker';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationES from './locales/es/translation.json';
import translationDE from './locales/de/translation.json';
import translationJA from './locales/ja/translation.json';

// Variable for supported locales
registerLocale('en-GB', gb);
registerLocale('en-US', us);
registerLocale('fr', fr);
registerLocale('es', es);
registerLocale('de', de);
registerLocale('ja', ja);

// the translations
export const lngs = {
  'en-GB': {
    translation: translationEN,
    nativeName: 'English (United Kingdom)',
  },
  'en-US': {
    translation: translationEN,
    nativeName: 'English (United States)',
  },
  fr: {
    translation: translationFR,
    nativeName: 'Français',
  },
  es: {
    translation: translationES,
    nativeName: 'Español',
  },
  de: {
    translation: translationDE,
    nativeName: 'Deutsch',
  },
  ja: {
    translation: translationJA,
    nativeName: '日本語',
  },
};

// locales is generated from the lngs object for compatibility with original locales implementation
/* eslint-disable no-param-reassign */
export const locales = Object.keys(lngs).reduce((acc, lng) => {
  acc[lng] = lngs[lng].nativeName;
  return acc;
}, {});

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources: lngs,
    fallbackLng: 'en', // use en if detected lng is not available
    // array of allowed languages
    supportedLngs: ['en', 'fr', 'es', 'de', 'ja'],
    // if true, will consider variants as supported when the main language is.
    // E.g. en-US will be valid if en is in supportedLngs.
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
