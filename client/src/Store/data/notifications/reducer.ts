import produce from "immer";

import initialState from "./initialState";
import { Actions, State, ActionType } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.GET_ALL: {
      const { notifications } = action.payload;
      return produce(state, (draft) => {
        draft.notifications = notifications;
        notifications.forEach((d) => (draft.byId[d._id] = d));
      });
    }

    case ActionType.CLEAR_ALL: {
      return produce(state, (draft) => {
        draft.notifications = [];
      });
    }

    case ActionType.DELETE_ALL: {
      return produce(state, (draft) => {
        draft.notifications = [];
      });
    }

    case ActionType.CLEAR_ONE: {
      const { id } = action.payload;

      return produce(state, (draft) => {
        draft.notifications = draft.notifications.filter((n) => n._id === id);
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
