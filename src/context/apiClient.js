import axios from "axios";
import { config } from "../config";

// Create instance
const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: 15000, // prevents hanging requests
});

// Request interceptor
apiClient.interceptors.request.use(
  async (req) => {
    // Attach token dynamically from multiple possible sources
    const token = global?.authToken || global?.authState?.user?.access_token;
    
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
      console.log("API Request - Token attached for:", req.url);
    } else {
      console.log("API Request - No token found for:", req.url);
    }
    
    return req;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("API ERROR:", error?.response || error.message);

    return Promise.reject(
      error?.response?.data || { message: "Something went wrong" }
    );
  }
);

export default apiClient;