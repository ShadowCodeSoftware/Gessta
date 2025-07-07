import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { offersService } from '../../services/api';

// Actions asynchrones
export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await offersService.getOffers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  'offers/fetchOfferById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await offersService.getOffer(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOffer = createAsyncThunk(
  'offers/createOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      const response = await offersService.createOffer(offerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOffer = createAsyncThunk(
  'offers/updateOffer',
  async ({ id, offerData }, { rejectWithValue }) => {
    try {
      const response = await offersService.updateOffer(id, offerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOffer = createAsyncThunk(
  'offers/deleteOffer',
  async (id, { rejectWithValue }) => {
    try {
      await offersService.deleteOffer(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// État initial
const initialState = {
  offers: [],
  currentOffer: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    domain: 'all',
    duration: 'all',
    location: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

// Slice
const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        domain: 'all',
        duration: 'all',
        location: '',
      };
    },
    setCurrentOffer: (state, action) => {
      state.currentOffer = action.payload;
    },
    clearCurrentOffer: (state) => {
      state.currentOffer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch offers
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          totalPages: action.payload.last_page,
          totalItems: action.payload.total,
          itemsPerPage: action.payload.per_page,
        };
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch offer by ID
      .addCase(fetchOfferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffer = action.payload;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create offer
      .addCase(createOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.unshift(action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update offer
      .addCase(updateOffer.fulfilled, (state, action) => {
        const index = state.offers.findIndex(offer => offer.id === action.payload.id);
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
        if (state.currentOffer?.id === action.payload.id) {
          state.currentOffer = action.payload;
        }
      })
      // Delete offer
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.offers = state.offers.filter(offer => offer.id !== action.payload);
        if (state.currentOffer?.id === action.payload) {
          state.currentOffer = null;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentOffer,
  clearCurrentOffer,
  clearError,
} = offersSlice.actions;

export default offersSlice.reducer;

// Sélecteurs
export const selectOffers = (state) => state.offers.offers;
export const selectCurrentOffer = (state) => state.offers.currentOffer;
export const selectOffersLoading = (state) => state.offers.loading;
export const selectOffersError = (state) => state.offers.error;
export const selectOffersFilters = (state) => state.offers.filters;
export const selectOffersPagination = (state) => state.offers.pagination;