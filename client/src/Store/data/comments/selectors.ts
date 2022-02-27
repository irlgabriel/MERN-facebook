import { createSelector } from "reselect";
import { State } from "./types";

export const selectAllComments = createSelector(
  (state: State) => state.comments,
  (comments) => comments
);

export const selectCommentsByPost = createSelector(
  (state: State, post_id: string) => state.byPost[post_id] ?? [],
  (comments) => comments
);

export const selectCommentsByComment = createSelector(
  (state: State, comment_id: string) => state.byComment[comment_id] ?? [],
  (comments) => comments
);
