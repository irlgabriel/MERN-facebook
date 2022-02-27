import produce from "immer";
import { ActionType, State, Actions as Action } from "./types";
import { default as initialState } from "./initialState";

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.IS_LOGGED_IN: {
      const { user, token } = action.payload;
      return produce(state, (draft) => {
        draft.auth.currentUser = user;
        draft.auth.token = token;
      });
    }

    case ActionType.LOGIN: {
      const { token, user } = action.payload;
      return produce(state, (draft) => {
        draft.auth.token = token;
        draft.auth.user = user;
        draft.auth.currentUser = user;
      });
    }

    case ActionType.LOGOUT: {
      return produce(state, (draft) => {
        draft.auth.user = null;
        draft.auth.token = null;
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
