import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

export const fetchProfiles = createAsyncThunk(
  'event/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.profiles.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createProfile = createAsyncThunk(
  'event/createProfile',
  async (name, { rejectWithValue }) => {
    try {
      const response = await apiService.profiles.create(name);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (profileIds = null, { rejectWithValue }) => {
    try {
      const response = await apiService.events.getAll(profileIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await apiService.events.create(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await apiService.events.update(eventId, eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchEventLogs = createAsyncThunk(
  'event/fetchEventLogs',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await apiService.events.getLogs(eventId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  profiles: [],
  events: [],
  selectedTimezone: 'America/New_York',
  selectedProfileIds: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setSelectedTimezone: (state, action) => {
      state.selectedTimezone = action.payload;
    },
    setSelectedProfileIds: (state, action) => {
      state.selectedProfileIds = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles.push(action.payload);
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.events.findIndex(e => e._id === action.payload._id);
        if (idx !== -1) {
          state.events[idx] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTimezone, setSelectedProfileIds, clearError } = eventSlice.actions;
export default eventSlice.reducer;

