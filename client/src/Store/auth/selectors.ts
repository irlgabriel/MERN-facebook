import { createSelector } from "reselect";
import { State } from "./types";

export const selectUser = createSelector(
  (state: State) => state.auth.user,
  (user) => user
);

export const selectCurrentUser = createSelector(
  (state: State) => state.auth.currentUser,
  (me) => me
);
