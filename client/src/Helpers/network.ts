import axios from "axios";
import { isClient } from "../helpers/utils";

axios.defaults.baseURL = process.env.API_URL ?? "http://localhost:5000";

axios.interceptors.request.use(
  (config) => {
    if (isClient()) {
      config.headers["Authorization"] =
        "bearer " + localStorage?.getItem("token");
    }
    config.withCredentials = false;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
