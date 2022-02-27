import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { User } from "./Types";
import "./App.css";
import { Container } from "reactstrap";
import { default as Router } from "./Router";
import { store } from "Store/store";
import { useLogin, useCheckLogin } from "Hooks";

import Axios from "axios";

function App() {
  // const [{ data: user, loading }, login] = useLogin();

  // const [, isLoggedIn] = useCheckLogin();

  // const reloadUser = () => {
  // GET the full user object based on its id;
  // I use this for when I need to update the user after some changes have been made to it - for example when I add/remove a friend;
  //   if (user) {
  //     Axios.get<User>(`/users/${user._id}`)
  //       .then((res) => {
  //         setUser(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  // const getUser = (token: string) => {
  //   const config = { headers: { Authorization: `bearer ${token}` } };
  //   Axios.get("/isLoggedIn", config).then((res) => {
  //     Axios.get(`/users/${res.data.user_id}`).then((res) => setUser(res.data));
  //   });
  // };

  // Check if user is logged in
  // useEffect(() => {
  //   // check if there's a token in cookie(fb-auth) or localStorage(local-auth)
  //   isLoggedIn();
  // }, []);

  // const props = { user, reloadUser, setUser, getUser };

  return (
    <Provider store={store}>
      <Container style={{ minHeight: "100vh" }} fluid className="p-0">
        {/**@ts-ignore */}
        <Router />
      </Container>
    </Provider>
  );
}

export default App;
