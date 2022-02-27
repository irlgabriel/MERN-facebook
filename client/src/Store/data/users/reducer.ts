import produce from "immer";

import initialState from "./initialState";
import { Actions, State, ActionType } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.GET_ALL: {
      const { users } = action.payload;
      return produce(state, (draft) => {
        draft.users = users;
        users.forEach((u) => {
          draft.byId[u._id] = u;
        });
      });
    }

    case ActionType.GET_ONE: {
      const { user } = action.payload;
      if (!user) return state;
      return produce(state, (draft) => {
        draft.user = user;
        draft.byId[user._id] = user;
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
