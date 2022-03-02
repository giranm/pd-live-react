import gb from 'date-fns/locale/en-GB';
import us from 'date-fns/locale/en-US';
import {
  registerLocale,
} from 'react-datepicker';

registerLocale('en-GB', gb);
registerLocale('en-US', us);

// Temporary variable for supported locales - to be implemented properly with i18n Support
const locales = {
  'en-GB': 'English (United Kingdom)',
  'en-US': 'English (United States)',
};

export default locales;
