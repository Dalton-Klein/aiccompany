import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Preferences } from "./interfaces";

const initialState: Preferences = {
  discoverFilters: {
    sort: "",
    age: [],
    hours: [],
    availability: [],
    language: [],
    region: [],
    playlist: [],
    rank: [],
  },
  selectedCalendar: { id: 0 },
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setPreferences(state, { payload }: PayloadAction<Preferences>) {
      state = payload;
      return state;
    },
    resetPreferences(state) {
      state = { ...initialState };
      return state;
    },
    resetFilterPreferences(state) {
      state.discoverFilters = { ...initialState.discoverFilters };
      return state;
    },
    setPreferencesError(state, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const {
  setPreferences,
  resetPreferences,
  resetFilterPreferences,
  setPreferencesError,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
