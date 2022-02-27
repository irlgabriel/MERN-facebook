import { ActionCreator } from "redux";

import { Thunk } from "Store/types";
import {
  ActionType,
  Activity,
  ActivityAction,
  ActivityError,
  ActivityErrorAction,
} from "./types";

const DEFAULT_TIMEOUT = 3000;

const activityAction: ActionCreator<ActivityAction> = (activity: Activity) => ({
  type: ActionType.ACTIVITY,
  payload: activity,
});

export const beginActivity =
  (activity: Activity): Thunk =>
  async (dispatch) => {
    dispatch(activityAction(activity));
  };

export const endActivity =
  ({ uuid }: { uuid: string }): Thunk =>
  async (dispatch) => {
    dispatch(activityAction({ uuid, type: null }));
  };

const errorAction: ActionCreator<ActivityErrorAction> = (
  error: ActivityError
) => ({
  type: ActionType.ERROR,
  payload: error,
});

export const setError =
  (error: ActivityError): Thunk =>
  async (dispatch) => {
    try {
      dispatch(errorAction(error));
      setTimeout(async () => {
        await dispatch(clearError({ uuid: error.uuid }));
      }, error.timeout || DEFAULT_TIMEOUT);
    } catch (e) {
      // Dispatching an error here would most probably
      // create an infinite loop so let's simply log it
      console.error(
        `Awkward... an error occured while dispatching an error ${e}`
      );
    }
  };

export const clearError =
  ({ uuid }: { uuid: string }): Thunk =>
  async (dispatch) => {
    try {
      dispatch(errorAction({ uuid, type: null, error: null }));
    } catch (e) {
      // Dispatching an error here would most probably
      // create an infinite loop so let's simply log it
      console.error(`Awkward... an error occured while clearing an error ${e}`);
    }
  };
