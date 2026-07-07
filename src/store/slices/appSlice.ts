import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  hasOnboarded: boolean;
  displayName: string;
  shelfBookCount: number;
}

const initialState: AppState = {
  hasOnboarded: false,
  displayName: "",
  shelfBookCount: 0,
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
    addScannedBooks: (state, action: PayloadAction<number>) => {
      state.shelfBookCount = Math.max(state.shelfBookCount, action.payload);
    },
    resetApp: () => initialState,
  },
});

export const { setDisplayName, completeOnboarding, addScannedBooks, resetApp } =
  appSlice.actions;
export default appSlice.reducer;
