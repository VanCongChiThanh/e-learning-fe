import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
