import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||"http://localhost:8080",
});

// Automatically add JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token saved after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
