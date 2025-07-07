import { createSlice } from '@reduxjs/toolkit';

// État initial
const initialState = {
  theme: 'light',
  language: 'fr',
  activeTab: 'Dashboard',
  modals: {
    addEntry: false,
    editEntry: false,
    applyToOffer: false,
    notifications: false,
  },
  loading: {
    global: false,
    offers: false,
    applications: false,
    journal: false,
  },
  errors: {
    network: null,
    validation: null,
    general: null,
  },
  filters: {
    offers: {
      search: '',
      domain: 'all',
      duration: 'all',
      location: '',
    },
    applications: {
      status: 'all',
    },
  },
  preferences: {
    notifications: {
      push: true,
      email: true,
      newOffers: true,
      applicationUpdates: true,
      reportReminders: true,
    },
    display: {
      compactMode: false,
      showFeaturedFirst: true,
    },
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Language
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    
    // Navigation
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Loading states
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Errors
    setError: (state, action) => {
      const { type, message } = action.payload;
      state.errors[type] = message;
    },
    clearError: (state, action) => {
      state.errors[action.payload] = null;
    },
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Filters
    setFilter: (state, action) => {
      const { category, key, value } = action.payload;
      state.filters[category][key] = value;
    },
    clearFilters: (state, action) => {
      const category = action.payload;
      Object.keys(state.filters[category]).forEach(key => {
        if (typeof state.filters[category][key] === 'string') {
          state.filters[category][key] = key === 'search' ? '' : 'all';
        }
      });
    },
    
    // Preferences
    updatePreference: (state, action) => {
      const { category, key, value } = action.payload;
      state.preferences[category][key] = value;
    },
    resetPreferences: (state) => {
      state.preferences = initialState.preferences;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  setActiveTab,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  setError,
  clearError,
  clearAllErrors,
  setFilter,
  clearFilters,
  updatePreference,
  resetPreferences,
} = uiSlice.actions;

export default uiSlice.reducer;

// Sélecteurs
export const selectTheme = (state) => state.ui.theme;
export const selectLanguage = (state) => state.ui.language;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectModals = (state) => state.ui.modals;
export const selectLoading = (state) => state.ui.loading;
export const selectErrors = (state) => state.ui.errors;
export const selectFilters = (state) => state.ui.filters;
export const selectPreferences = (state) => state.ui.preferences;

// Sélecteurs dérivés
export const selectIsModalOpen = (modalName) => (state) =>
  state.ui.modals[modalName];

export const selectIsLoading = (key) => (state) =>
  state.ui.loading[key];

export const selectHasError = (type) => (state) =>
  !!state.ui.errors[type];

export const selectFiltersByCategory = (category) => (state) =>
  state.ui.filters[category];