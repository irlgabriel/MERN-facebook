const token = localStorage.getItem("token") || document.cookie.split("=")[1];

const initialState = {
  auth: {
    token: token || null,
    user: null,
    currentUser: null,
  },
};

export default initialState;
