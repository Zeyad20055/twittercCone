// ============================================================
// REDUX STORE
// Currently the app uses Context API for auth state management.
// This store is available if you need to add global state slices
// for features like notifications, theme, etc.
//
// To activate Redux in App.jsx:
//   import { Provider } from 'react-redux'
//   import { store } from './app/store'
//   Wrap <App> with <Provider store={store}>
// ============================================================

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add reducers here as the app grows
    // Example: notifications: notificationsReducer,
  },
});

export default store;
