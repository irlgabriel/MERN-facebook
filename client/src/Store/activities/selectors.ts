import { createSelector } from "reselect";
import { State } from "./types";

export const selectActivity = createSelector(
  (state: State, type: string) =>
    !!state.activities.find((activity) => activity.type === type),
  (activity) => activity
);

export const selectActivityPayload = createSelector(
  (state: State, type: string) => {
    const activity = state.activities.find(
      (activity) => activity.type === type
    );
    if (activity) return activity.payload;
    return null;
  },
  (payload) => payload
);

export const selectActivities = createSelector(
  (state: State, types: string[]) =>
    !!state.activities.find((activity) => types.includes(activity.type)),
  (activities) => activities
);

export const selectError = createSelector(
  (state: State, type: string) =>
    !!state.errors.find((error) => error.type === type),
  (error) => error
);

export const selectErrorDetails = createSelector(
  (state: State, type: string) =>
    state.errors.find((error) => error.type === type),
  (error) => error
);

export const selectErrors = createSelector(
  (state: State, types: string[]) =>
    !!state.errors.find((error) => types.includes(error.type)),
  (error) => error
);

export const selectErrorsDetails = createSelector(
  (state: State, types: string[]) =>
    state.errors.find((error) => types.includes(error.type)),
  (error) => error
);

export const selectAllErrors = createSelector(
  (state: State) => state.errors,
  (errors) => errors
);

export const selectErrorByCode = createSelector(
  (state: State, code: number) =>
    !!state.errors.find((error) => error.message.includes(code.toString())),
  (error) => error
);
