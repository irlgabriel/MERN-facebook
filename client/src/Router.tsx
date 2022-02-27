//@ts-nocheck
import React, { SetStateAction, useEffect } from "react";
import { Route, HashRouter, Redirect } from "react-router-dom";
import { User } from "Types";
import { Home, Profile, Friends, PostPage, Register, Index } from "Pages";
import { useLogin, useCheckLogin, useUsers, usePosts } from "Hooks";

function Router() {
  const [, getUsers] = useUsers();
  const [, getPosts] = usePosts();
  const [{ data: user }, login] = useLogin();
  const [, isLoggedIn] = useCheckLogin();

  useEffect(() => {
    isLoggedIn();
  }, []);

  //temporary
  useEffect(() => {
    getUsers();
    // getPosts();
  }, [user]);

  if (user !== null) {
    return (
      <HashRouter>
        <Route exact path="/home" component={Home} />
        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="/friends" component={Friends}></Route>
        <Route exact path="/posts/:post_id" component={PostPage}></Route>
        <Route exact path="/users/:user_id" component={Profile}></Route>
        <Route path="*">
          <Redirect to="/home" />
        </Route>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <Route
        exact
        path="/register"
        render={() => <Register {...props} />}
      ></Route>
      <Route exact path="/" component={Index}></Route>

      {/* Necessary for facebook oauth in development */}
      <Route exact path="/_=_" render={() => <Index />}></Route>
      <Route path="*">
        <Redirect to="/index" />
      </Route>
    </HashRouter>
  );
}
export default Router;
