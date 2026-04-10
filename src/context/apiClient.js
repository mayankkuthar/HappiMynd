import axios from "axios";
import { config } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create instance
const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: 15000, // prevents hanging requests
});

// Request interceptor
apiClient.interceptors.request.use(
  async (req) => {
    // Try to get token from multiple sources
    let token = global?.authToken || global?.authState?.user?.access_token;
    
    // If not found in global, try AsyncStorage
    if (!token) {
      try {
        const userStr = await AsyncStorage.getItem("USER");
        if (userStr) {
          const userData = JSON.parse(userStr);
          token = userData?.access_token;
          // Cache it in global for future requests
          if (token) {
            global.authToken = token;
          }
        }
      } catch (error) {
        console.log("Error reading token from AsyncStorage:", error);
      }
    }
    
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