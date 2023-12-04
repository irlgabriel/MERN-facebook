import React, { useEffect } from "react";
import "./App.css";
import { Container } from "reactstrap";
import {
  Index,
  Home,
  Profile,
  Register,
  Friends,
  PostPage,
  ProtectedRoute,
} from "./Pages";
import { Route, HashRouter as Router } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./Hooks/utils";
import { getLoggedInUser } from "./Store/auth";
import LoadingOverlay from "./Components/LoadingOverlay/LoadingOverlay";

function App() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, []);

  return (
    <Router>
      <LoadingOverlay loading={loading}>
        <Container style={{ minHeight: "100vh" }} fluid className="p-0">
          {/* Page routes */}
          <ProtectedRoute exact path="/home" component={Home} />
          <ProtectedRoute path="/profile" component={Profile}></ProtectedRoute>
          <Route path="/register" render={() => <Register />}></Route>
          <Route path="/" exact render={() => <Index />}></Route>
          <ProtectedRoute
            path="/friends"
            exact
            component={Friends}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/posts/:post_id"
            component={PostPage}
          ></ProtectedRoute>
          <ProtectedRoute
            exact
            path="/users/:user_id"
            component={Profile}
          ></ProtectedRoute>

          {/* Necessary for facebook oauth in development */}
          <Route path="/_=_" exact render={() => <Index />}></Route>
        </Container>
      </LoadingOverlay>
    </Router>
  );
}

export default App;
