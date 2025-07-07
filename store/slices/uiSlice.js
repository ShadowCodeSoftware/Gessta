import { createSlice } from '@reduxjs/toolkit';

// État initial
const initialState = {
  // Modal states
  modals: {
    addEntryModal: false,
    addOfferModal: false,
    addApplicationModal: false,
    editEntryModal: false,
    editOfferModal: false,
    editApplicationModal: false,
    deleteConfirmModal: false,
  },
  // Loading states
  loading: {
    global: false,
    offers: false,
    applications: false,
    journal: false,
  },
  // Notifications
  notifications: [],
  // Sidebar state
  sidebarOpen: false,
  // Theme
  theme: 'light',
  // Current page
  currentPage: 'dashboard',
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Loading actions
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      if (state.loading.hasOwnProperty(key)) {
        state.loading[key] = value;
      }
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    // Page navigation
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  setCurrentPage,
} = uiSlice.actions;

export default uiSlice.reducer;

// Sélecteurs
export const selectModals = (state) => state.ui.modals;
export const selectModalState = (modalName) => (state) => state.ui.modals[modalName];
export const selectLoading = (state) => state.ui.loading;
export const selectGlobalLoading = (state) => state.ui.loading.global;
export const selectNotifications = (state) => state.ui.notifications;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectCurrentPage = (state) => state.ui.currentPage;