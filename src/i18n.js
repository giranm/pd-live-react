import i18n from 'i18next';
import {
  initReactI18next,
} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Search: 'Search',
      Filters: 'Filters',
      'Live Incidents Console': 'Live Incidents Console',
      Settings: 'Settings',
      'View Disclaimer': 'View Disclaimer',
      'Log Out': 'Log Out',
      Version: 'Version',
      Since: 'Since',
      State: 'State',
      Triggered: 'Triggered',
      Acknowledged: 'Acknowledged',
      Resolved: 'Resolved',
      Urgency: 'Urgency',
      High: 'High',
      Low: 'Low',
      Priorities: 'Priorities',
      Team: 'Team',
      Users: 'Users',
      'Escalation Policy': 'Escalation Policy',
      Service: 'Service',
    },
  },
  fr: {
    translation: {
      Search: 'Chercher',
      Filters: 'Filtres',
      'Live Incidents Console': "Console d'incidents en direct",
      Settings: 'Paramètres',
      'View Disclaimer': 'Clause de non-responsabilité',
      'Log Out': 'Se déconnecter',
      Version: 'Version',
      Since: 'Depuis',
      State: 'Statut',
      Triggered: 'Déclenché',
      Acknowledged: 'Reconnu',
      Resolved: 'Résolu',
      Urgency: 'Urgence',
      High: 'Haute',
      Low: 'Basse',
      Priorities: 'Priorités',
      Team: 'Équipe',
      Users: 'Utilisateurs',
      'Escalation Policy': "Politique d'escalade",
      Service: 'Service',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    // lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
