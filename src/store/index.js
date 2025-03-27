import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import companiesDataReducer from './slices/companyDataSlice';
import AppDataReducer from './slices/AppDataSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    counter: counterReducer, 
    companies: companiesDataReducer, 
    appdata: AppDataReducer, 
  },
});

export default store;
