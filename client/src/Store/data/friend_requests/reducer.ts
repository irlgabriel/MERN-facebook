import produce from "immer";

import initialState from "./initialState";
import { Actions, State, ActionType } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.GET_ALL: {
      const { requests } = action.payload;
      return produce(state, (draft) => {
        draft.requests = requests;
        requests.forEach((d) => (draft.byId[d._id] = d));
      });
    }

    case ActionType.GET_SUGGESTIONS: {
      const { requests } = action.payload;
      return produce(state, (draft) => {
        draft.suggestions = requests;
      });
    }

    case ActionType.SEND_REQUEST: {
      const { request_id } = action.payload;

      return produce(state, (draft) => {
        draft.suggestions.map((s) => s._id !== request_id);
      });
    }

    //same
    case ActionType.DECLINE_REQUEST: {
      const { request_id } = action.payload;

      return produce(state, (draft) => {
        draft.suggestions.map((s) => s._id !== request_id);
      });
    }

    case ActionType.CONFIRM_REQUEST: {
      const { request_id } = action.payload;

      return produce(state, (draft) => {
        draft.requests.filter((r) => r._id !== request_id);
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
