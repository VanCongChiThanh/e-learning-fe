import axios from "axios";
const AI_SERVER_URL = process.env.REACT_APP_AI_SERVER_URL || "http://localhost:5000/api";

const aiAPI = axios.create({
  baseURL: AI_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default aiAPI;