import { useCallback } from "react";
import { toast, ToastOptions } from "react-toastify";

interface CustomToastOptions extends ToastOptions {
  showProgressBar?: boolean;
  progressBarColor?: string;
}

// Custom hook to provide a toast notification
const useToast = () => {
  const showToast = useCallback((message: string, options: CustomToastOptions = {}) => {
    const {
      showProgressBar = false,  // Default is false, but can be passed as true 
      progressBarColor = "#4caf50",  // Default color is green, but can be customized
      ...otherOptions
    } = options;

    toast(message, {
      autoClose: 3000,
      ...otherOptions, // Spread any additional options provided
      style: {
        backgroundColor: "white",  // White background
        color: "black",            // Black text
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds subtle shadow
      }, 
      progress: showProgressBar ? 1 : 0,  // Convert boolean to number (1 for show, 0 for hide)
      // Note: progressStyle is not supported by react-toastify
    });
  }, []);

  return showToast;
};

export default useToast;
