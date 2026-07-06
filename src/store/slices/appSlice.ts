import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  hasOnboarded: boolean;
  displayName: string;
}

const initialState: AppState = {
  hasOnboarded: false,
  displayName: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload.trim();
    },
    completeOnboarding: (state) => {
      state.hasOnboarded = true;
    },
    resetApp: () => initialState,
  },
});

export const { setDisplayName, completeOnboarding, resetApp } = appSlice.actions;
export default appSlice.reducer;
