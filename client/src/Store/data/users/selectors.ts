import { createSelector } from "reselect";
import { State } from "./types";

export const selectUsers = createSelector(
  (state: State) => state.users,
  (users) => users
);

export const selectUser = createSelector(
  (state: State, id: string | undefined) => (id ? state.byId[id] : null),
  (user) => user
);
