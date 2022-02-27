import { initialState } from "./initialState";
import { ActionType, Actions, State } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.ACTIVITY: {
      return {
        ...state,
        activities: action.payload.type
          ? [...state.activities, action.payload]
          : state.activities.filter(
              (activity) => action.payload.uuid !== activity.uuid
            ),
      };
    }

    case ActionType.ERROR: {
      return {
        ...state,
        errors: action.payload.type
          ? [...state.errors, action.payload]
          : state.errors.filter((error) => action.payload.uuid !== error.uuid),
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
