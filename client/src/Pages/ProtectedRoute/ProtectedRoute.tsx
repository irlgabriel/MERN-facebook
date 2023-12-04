import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppSelector } from "../../Hooks/utils";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Route
      exact
      {...rest}
      render={(props) => {
        if (user) {
          return <Component {...rest} {...props} user={user} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
