import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://coursevo.duckdns.org/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
