// Configuration for Fuse.js (Fuzzy Search)

import {
  availableIncidentTableColumns,
} from './incident-table-columns';

// Docs: https://fusejs.io/api/options.html
const fuseOptions = {
  threshold: 0.2,
  distance: 100,
  useExtendedSearch: true,
  keys: availableIncidentTableColumns.map((col) => {
    // Handle specific cases for columns with functional accessor
    let key = '';
    switch (col.Header) {
      case 'Assignees':
        key = 'assignments.summary';
        break;
      case 'Teams':
        key = 'teams.summary';
        break;
      case 'Acknowledgments':
        key = 'acknowledgements.summary';
        break;
      case 'Priority':
        key = 'priority.summary';
        break;
      case 'Latest Note':
        key = 'notes.content';
        break;
      default:
        key = col.accessor;
        break;
    }
    return key;
  }),
};

export default fuseOptions;
