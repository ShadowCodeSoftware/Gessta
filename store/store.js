import { configureStore } from '@reduxjs/toolkit';
import offersReducer from './slices/offersSlice';
import applicationsReducer from './slices/applicationsSlice';
import journalReducer from './slices/journalSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    applications: applicationsReducer,
    journal: journalReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});