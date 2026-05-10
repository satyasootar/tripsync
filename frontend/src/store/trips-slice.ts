import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import type { Trip, ApiResponse } from "@/lib/types";

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
};

export const fetchTrips = createAsyncThunk("trips/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ApiResponse<Trip[]>>("/trips");
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch trips");
  }
});

export const fetchTrip = createAsyncThunk(
  "trips/fetchOne",
  async (tripId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<Trip>>(`/trips/${tripId}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch trip");
    }
  },
);

export const createTrip = createAsyncThunk(
  "trips/create",
  async (
    payload: {
      title: string;
      destination: string;
      startDate: string;
      endDate: string;
      description?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<ApiResponse<Trip>>("/trips", payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create trip");
    }
  },
);

export const updateTrip = createAsyncThunk(
  "trips/update",
  async (
    { tripId, ...payload }: { tripId: string } & Partial<Trip>,
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch<ApiResponse<Trip>>(`/trips/${tripId}`, payload);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update trip");
    }
  },
);

export const deleteTrip = createAsyncThunk(
  "trips/delete",
  async (tripId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/trips/${tripId}`);
      return tripId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete trip");
    }
  },
);

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    clearCurrentTrip(state) {
      state.currentTrip = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action: PayloadAction<Trip[]>) => {
        state.isLoading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch one
    builder
      .addCase(fetchTrip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.isLoading = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTrip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create
    builder.addCase(createTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    });

    // Update
    builder.addCase(updateTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.trips[index] = action.payload;
      if (state.currentTrip?.id === action.payload.id) state.currentTrip = action.payload;
    });

    // Delete
    builder.addCase(deleteTrip.fulfilled, (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter((t) => t.id !== action.payload);
      if (state.currentTrip?.id === action.payload) state.currentTrip = null;
    });
  },
});

export const { clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;
