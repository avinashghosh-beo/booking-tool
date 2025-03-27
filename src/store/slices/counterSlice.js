import { createSlice } from '@reduxjs/toolkit';

// Initial state for the counter slice
const initialState = {
  value: 0,
};

// Create the slice
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Export actions to be dispatched
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export reducer to be added to the store
export default counterSlice.reducer;
