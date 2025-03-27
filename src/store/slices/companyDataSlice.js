import { createSlice } from "@reduxjs/toolkit";

// Initial state for the counter slice
const initialState = {
  allCompanies: [],
  selectedCompanies: [],
};

// Create the slice
export const companiesDataSlice = createSlice({
  name: "companiesData",
  initialState,
  reducers: {
    setAllCompaniesList: (state, action) => {
      state.allCompanies = action.payload;
    },
    setSelectedCompaniesList: (state, action) => {
      state.selectedCompanies = action.payload;
    },
    updateSelectedCompaniesList: (state, action) => {
      const companyId = action.payload;

      if (state.selectedCompanies.includes(companyId)) {
        // Prevent removal if it's the only selected company
        if (state.selectedCompanies.length > 1) {
          state.selectedCompanies = state.selectedCompanies.filter(
            (id) => id !== companyId
          );
        }
      } else {
        // Add the company to the selected list
        state.selectedCompanies.push(companyId);
      }
    },
  },
});

// Export actions to be dispatched
export const {
  setAllCompaniesList,
  setSelectedCompaniesList,
  updateSelectedCompaniesList,
} = companiesDataSlice.actions;

// Export reducer to be added to the store
export default companiesDataSlice.reducer;
