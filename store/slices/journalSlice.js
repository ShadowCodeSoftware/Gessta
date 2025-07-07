import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { journalService } from '../../services/api';

// Actions asynchrones
export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await journalService.getEntries();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await journalService.createEntry(entryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ id, entryData }, { rejectWithValue }) => {
    try {
      const response = await journalService.updateEntry(id, entryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await journalService.deleteEntry(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// État initial
const initialState = {
  entries: [],
  loading: false,
  error: null,
  stats: {
    totalEntries: 0,
    thisWeek: 0,
    thisMonth: 0,
  },
};

// Slice
const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state) => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = state.entries.reduce(
        (acc, entry) => {
          const entryDate = new Date(entry.entry_date);
          acc.totalEntries++;
          
          if (entryDate >= oneWeekAgo) {
            acc.thisWeek++;
          }
          
          if (entryDate >= oneMonthAgo) {
            acc.thisMonth++;
          }
          
          return acc;
        },
        { totalEntries: 0, thisWeek: 0, thisMonth: 0 }
      );
      
      state.stats = stats;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data || action.payload;
        journalSlice.caseReducers.updateStats(state);
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create entry
      .addCase(createJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
        journalSlice.caseReducers.updateStats(state);
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update entry
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(entry => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
          journalSlice.caseReducers.updateStats(state);
        }
      })
      // Delete entry
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(entry => entry.id !== action.payload);
        journalSlice.caseReducers.updateStats(state);
      });
  },
});

export const { clearError } = journalSlice.actions;

export default journalSlice.reducer;

// Sélecteurs
export const selectJournalEntries = (state) => state.journal.entries;
export const selectJournalLoading = (state) => state.journal.loading;
export const selectJournalError = (state) => state.journal.error;
export const selectJournalStats = (state) => state.journal.stats;

// Sélecteurs dérivés
export const selectEntriesByDate = (state) =>
  state.journal.entries
    .slice()
    .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));

export const selectRecentEntries = (limit = 5) => (state) =>
  selectEntriesByDate(state).slice(0, limit);