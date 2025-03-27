import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import AppNavigator from "./AppNavigator";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import i18n from "i18next";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-loading-skeleton/dist/skeleton.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Provider store={store}>
            <AuthProvider>
              <ToastContainer />
              <AppNavigator />
            </AuthProvider>
          </Provider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;
