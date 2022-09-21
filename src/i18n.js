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
      Acknowledge: 'Acknowledge',
      Escalate: 'Escalate',
      Reassign: 'Reassign',
      'Add Responders': 'Add Responders',
      Responders: 'Responders',
      Snooze: 'Snooze',
      Custom: 'Custom',
      Merge: 'Merge',
      Resolve: 'Resolve',
      'Update Priority': 'Update Priority',
      'Add Note': 'Add Note',
      'Add Note to incident(s) here': 'Add Note to incident(s) here',
      'Run Action': 'Run Action',
      'Response Plays': 'Response Plays',
      Actions: 'Actions',
      'External Systems': 'External Systems',
      Selected: 'Selected',
      'N/A': 'N/A',
      Querying: 'Querying',
      'Fetching Notes': 'Fetching Notes',
      'Fetching Alerts': 'Fetching Alerts',
      Refreshing: 'Refreshing',
      'Search for Escalation Policies and/or Users': 'Search for Escalation Policies and/or Users',
      'Search for Escalation Policy or User': 'Search for Escalation Policy or User',
      'Provide brief message for additional responders':
        'Provide brief message for additional responders',
      'characters remaining': 'characters remaining',
      Cancel: 'Cancel',
      'Reassign To': 'Reassign To',
      'Merge Incidents': 'Merge Incidents',
      'The alerts of the selected incidents will be merged into a single incident': 'The alerts of the selected incidents will be merged into a single incident',
      'Select an open incident to merge into': 'Select an open incident to merge into',
      'The remaining selected incidents will be resolved after the merge is complete': 'The remaining selected incidents will be resolved after the merge is complete',
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
      Acknowledge: 'Reconnaître',
      Escalate: 'Escalader',
      Reassign: 'Réaffecter',
      'Add Responders': 'Ajouter des intervenants',
      Responders: 'Intervenants',
      Snooze: 'Roupillon',
      Custom: 'Personnalisé',
      Merge: 'Fusionner',
      Resolve: 'Résoudre',
      'Update Priority': 'Modifier la priorité',
      'Add Note': 'Ajouter une note',
      'Add Note to incident(s) here': 'Ajouter une note aux incidents ici',
      'Run Action': 'Exécuter une action',
      'Response Plays': 'Réponses',
      Actions: 'Actions',
      'External Systems': 'Systèmes externes',
      Selected: 'Sélectionné',
      'N/A': 'N/A',
      Querying: 'Requête',
      'Fetching Notes': 'Récupération des notes',
      'Fetching Alerts': 'Récupération des alertes',
      Refreshing: 'Rafraîchissement',
      'Search for Escalation Policies and/or Users':
        "Rechercher des politiques d'escalade et/ou des utilisateurs",
      'Search for Escalation Policy or User':
        "Rechercher une politique d'escalade ou un utilisateur",
      'Provide brief message for additional responders':
        'Fournir un message court pour les intervenants supplémentaires',
      'characters remaining': 'caractères restants',
      Cancel: 'Annuler',
      'Reassign To': 'Réaffecter à',
      'Merge Incidents': 'Fusionner les incidents',
      'The alerts of the selected incidents will be merged into a single incident': 'Les alertes des incidents sélectionnés seront fusionnées en un seul incident',
      'Select an open incident to merge into': 'Sélectionner un incident ouvert à fusionner',
      'The remaining selected incidents will be resolved after the merge is complete': 'Les incidents restants sélectionnés seront résolus après la fusion',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en", // use en if detected lng is not available
    // lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
