import { createSelector } from "reselect";
import { State } from "./types";

export const selectPosts = createSelector(
  (state: State) => state.posts,
  (posts) => posts
);
export const selectPost = createSelector(
  (state: State, id: string | undefined) => (id ? state.byId[id] : null),
  (posts) => posts
);

export const selectPostsByUser = createSelector(
  (state: State, id: string) => state.byUser[id],
  (posts) => posts
);
