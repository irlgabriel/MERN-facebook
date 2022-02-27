import produce from "immer";

import initialState from "./initialState";
import { Actions, State, ActionType } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.GET_ALL: {
      const { comments } = action.payload;
      return produce(state, (draft) => {
        draft.comments = comments;
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
