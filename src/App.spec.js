// import React from 'react';
// import { mount } from '@cypress/react';

// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from 'redux/store';

// import App from './App';

it('Renders Application', () => {
  // mount(
  //   <Provider store={store}>
  //     <PersistGate loading={null} persistor={persistor}>
  //       <React.StrictMode>
  //         <App />
  //       </React.StrictMode>
  //     </PersistGate>
  //   </Provider>,
  // );
  cy.visit('http://localhost:3000');
  cy.get('#pd-login-button').contains('Authorize PagerDuty');
});
