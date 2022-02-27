import { createSelector } from "reselect";
import { State } from "./types";

export const selectNotifications = createSelector(
  (state: State) => state.notifications,
  (notifications) => notifications
);

export const selectNotification = createSelector(
  (state: State, id: string) => state.byId[id],
  (notification) => notification
);
