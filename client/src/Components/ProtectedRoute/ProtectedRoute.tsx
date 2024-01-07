import { ComponentType, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import { getLoggedInUser } from "../../store/auth";
import { useRouter } from "next/router";
import { connect } from "react-redux";

// export const ProtectedRoute: React.FC = (Component) => {
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state) => state.auth.user);
//   const fetchedUser = useAppSelector((state) => state.auth.fetched);

//   const { push } = useRouter();

//   // CHECK IF USER IS LOGGED IN
//   useEffect(() => {
//     if (!fetchedUser) {
//       dispatch(getLoggedInUser());
//     }
//     if (fetchedUser && !user) {
//       push("/");
//     }
//   }, [fetchedUser]);

//   // NOT LOGGED IN
//   return Component;

// };

export const ProtectedRoute =
  <P extends {}>(Component: React.FC<P>): React.FC<P> =>
  (props) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.user);
    const fetchedUser = useAppSelector((state) => state.auth.fetched);

    const { push } = useRouter();

    // CHECK IF USER IS LOGGED IN
    useEffect(() => {
      if (!fetchedUser) {
        dispatch(getLoggedInUser());
      }
      if (fetchedUser && !isAuthenticated) {
        push("/");
      }
    }, [fetchedUser]);

    if (isAuthenticated) {
      return <Component {...props} />;
    }
    return <></>;
  };
