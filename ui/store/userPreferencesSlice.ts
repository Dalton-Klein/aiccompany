import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Preferences } from "./interfaces";

const initialState: Preferences = {
  lastTabPage: "dashboard",
  selectedCalendar: { id: 0 },
  refreshCalendar: false,
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
    setPreferencesError(state, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const { setPreferences, resetPreferences, setPreferencesError } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
