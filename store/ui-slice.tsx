import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "UI",
  initialState: { scroll: false },
  reducers: {
    setScrollTo(state, action) {
      state.scroll = action.payload;
    },
  },
});

export const UIActions = uiSlice.actions;
export default uiSlice;
