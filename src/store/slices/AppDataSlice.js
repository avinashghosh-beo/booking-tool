import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  breadCrumbTitle: {
    customTitle: { route: "", title: "" },
  },
};

export const appDataSlice = createSlice({
  name: "appdata",
  initialState,
  reducers: {
    // Set breadcrumb title
    setBreadCrumbTitle: (state, action) => {
      // Action payload should have both `route` and `text`
      state.breadCrumbTitle.customTitle = {
        route: action.payload.route,
        title: action.payload.title,
      };
    },

    // Clear breadcrumb title
    clearBreadCrumbTitle: (state) => {
      // Resetting to initial state or default values
      state.breadCrumbTitle.customTitle = { route: "", title: "" };
    },
  },
});

// Export actions to be dispatched
export const { setBreadCrumbTitle, clearBreadCrumbTitle } =
  appDataSlice.actions;

// Export reducer to be added to the store
export default appDataSlice.reducer;
