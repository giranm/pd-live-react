import {
  createStore, applyMiddleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {
  persistStore, persistReducer,
} from 'redux-persist';
import {
  persistConfig,
} from './persistence/config';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

// Expore store for Cypress tests
if (window.Cypress) {
  window.store = store;
}

export { store, persistor };
