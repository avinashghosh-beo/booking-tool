// apiClient.js
import axios from "axios";
import { encryptData, decryptData } from "../utils/crypto";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 100000, // Set a timeout for requests (optional)
  headers: {
    "Content-Type": "application/json", // Default headers
    Accept: "application/json",
  },
});

// Add interceptors for request/response if needed
apiClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("app_data");
    if (storedUser) {
      const decryptedUser = decryptData(storedUser);
      const token = decryptedUser?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const company = localStorage.getItem("AC");
    if (company) config.headers.company = company;

    // If the data is FormData, let axios set the correct Content-Type with boundary
    if (config.data instanceof FormData) {
      // Remove the default Content-Type so axios can set it with the boundary
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Handle response errors
    console.error("API Error:", error.response || error.message);

    // If the error status is 401 (Unauthorized), handle it here
    if (error.response && error.response.status === 401) {
      // Clear the local storage entry 'app_data' and reload the app
      localStorage.removeItem("app_data");
      window.location.reload();
    }

    // Reject the promise and return the error
    return Promise.reject(error);
  }
);

// Centralized PATCH request
export const patchRequest = async (url, data, config = {}) => {
  try {
    const requestConfig = {
      ...config,
    };

    const response = await apiClient.patch(url, data, requestConfig);
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error;
  }
};

// Centralized PATCH request
export const putRequest = async (url, data, config = {}) => {
  try {
    // Create a new config object with the appropriate Content-Type
    const requestConfig = {
      ...config,
    };

    const response = await apiClient.put(url, data, requestConfig);
    return response.data; // Return the response data
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Centralized DELETE request
export const deleteRequest = async (url, data, config = {}) => {
  try {
    // Create a new config object with the appropriate Content-Type
    const requestConfig = {
      ...config,
    };

    const response = await apiClient.delete(url, { data: data }, requestConfig);
    return response.data; // Return the response data
  } catch (error) {
    console.error("DELETE request failed:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Centralized POST request
export const postRequest = async (url, data, config = {}) => {
  try {
    // Check if data is FormData
    const isFormData = data instanceof FormData;

    // Create a new config object with the appropriate Content-Type
    const requestConfig = {
      ...config,
    };

    // Log FormData contents for debugging (remove in production)
    if (isFormData) {
      console.log(`Sending FormData to ${url}:`);
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    }

    const response = await apiClient.post(url, data, requestConfig);
    return response.data; // Return the response data
  } catch (error) {
    console.error("POST request failed:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Centralized GET request
export const getRequest = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Rethrow to allow the caller to handle it
  }
};

// New function specifically for FormData uploads
export const uploadFormData = async (url, formData, onProgress = null) => {
  try {
    const config = {
      headers: {
        // Let axios set the Content-Type header with the correct boundary
      },
    };

    // Add progress tracking if provided
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      };
    }

    // Log FormData contents for debugging
    console.log(`Uploading file to ${url}:`);
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const response = await apiClient.post(url, formData, config);
    return response.data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const fetchBuffer = async (url, options = {}) => {
  try {
    const config = {
      responseType: "blob",
      method: options.method || "GET",
      headers: {
        ...options.headers,
        Accept: options.contentType || "application/pdf",
      },
      ...options,
    };

    const response = await apiClient.get(url, config);

    // Validate response
    if (!(response.data instanceof Blob)) {
      throw new Error("Invalid binary response received");
    }

    // Get filename from Content-Disposition header if present
    const contentDisposition = response.headers["content-disposition"];
    let filename = null;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      filename = filenameMatch ? filenameMatch[1].replace(/['"]/g, "") : null;
    }

    return {
      status: response.status,
      data: response.data, // Blob
      filename,
      contentType: response.headers["content-type"],
    };
  } catch (error) {
    // Handle errors consistently with other functions
    throw error;
  }
};
