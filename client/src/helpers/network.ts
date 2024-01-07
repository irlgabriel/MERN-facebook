import axios from "axios";
import { isClient } from "../helpers/utils";

axios.defaults.baseURL = process.env.API_URL ?? "http://54.93.240.69";

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
