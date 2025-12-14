import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend root
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// OPTIONAL: auto-attach token if you store it
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
