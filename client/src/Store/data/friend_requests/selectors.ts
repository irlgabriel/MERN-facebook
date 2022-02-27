import { createSelector } from "reselect";
import { State } from "./types";

export const selectFriendRequests = createSelector(
  (state: State) => state.requests,
  (requests) => requests
);

export const selectFriendRequest = createSelector(
  (state: State, id: string) => state.byId[id],
  (request) => request
);

export const selectFriendSuggestions = createSelector(
  (state: State) => state.suggestions,
  (s) => s
);

export const selectSentRequests = createSelector(
  (state: State, id: string) => state.requests.filter((r) => r.from._id === id),
  (sent) => sent
);

export const selectReceivedRequests = createSelector(
  (state: State, id: string) => state.requests.filter((r) => r.to._id === id),
  (received) => received
);
