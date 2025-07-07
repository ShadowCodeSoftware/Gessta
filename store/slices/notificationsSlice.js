import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsService } from '../../services/api';

// Actions asynchrones
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationsService.getApplications();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationsService.createApplication(applicationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await applicationsService.updateApplicationStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      await applicationsService.deleteApplication(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// État initial
const initialState = {
  applications: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  },
};

// Slice
const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state) => {
      const stats = state.applications.reduce(
        (acc, app) => {
          acc.total++;
          acc[app.status]++;
          return acc;
        },
        { total: 0, pending: 0, accepted: 0, rejected: 0 }
      );
      state.stats = stats;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data || action.payload;
        applicationsSlice.caseReducers.updateStats(state);
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
        applicationsSlice.caseReducers.updateStats(state);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
          applicationsSlice.caseReducers.updateStats(state);
        }
      })
      // Delete application
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(app => app.id !== action.payload);
        applicationsSlice.caseReducers.updateStats(state);
      });
  },
});

export const { clearError } = applicationsSlice.actions;

export default applicationsSlice.reducer;

// Sélecteurs
export const selectApplications = (state) => state.applications.applications;
export const selectApplicationsLoading = (state) => state.applications.loading;
export const selectApplicationsError = (state) => state.applications.error;
export const selectApplicationsStats = (state) => state.applications.stats;

// Sélecteurs dérivés
export const selectApplicationsByStatus = (status) => (state) =>
  state.applications.applications.filter(app => app.status === status);

export const selectRecentApplications = (limit = 5) => (state) =>
  state.applications.applications
    .slice()
    .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
    .slice(0, limit);