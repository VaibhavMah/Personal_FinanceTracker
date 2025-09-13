import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change port if your backend is different
  withCredentials: true, // optional (for auth/cookies later)
});

export default api;
