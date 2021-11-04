import produce from 'immer';

import { REHYDRATE } from 'redux-persist/lib/constants';

const persistence = produce(
  (draft, action) => {
    switch (action.type) {
      case REHYDRATE:
        draft.persistedState = action.payload;
        break;
      default:
        break;
    }
  },
  {
    persistedState: {},
  },
);

export default persistence;
