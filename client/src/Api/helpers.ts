import axios from "axios";

axios.defaults.headers = {
  Authorization: "bearer " + localStorage.getItem("token"),
};

export default axios;
