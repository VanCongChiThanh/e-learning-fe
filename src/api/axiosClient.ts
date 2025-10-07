import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/v1`
  : "/api/v1";
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
