import { Action } from "redux";

export interface Activity {
  uuid: string;
  type: string;
  payload?: any;
}

export interface ActivityError extends Activity {
  message: string;
  timeout?: number;
  status?: number;
}

export interface State {
  activities: Activity[];
  errors: ActivityError[];
}

export enum ActionType {
  ACTIVITY = "ui/activities/ACTIVITY",
  ERROR = "ui/activities/ERROR",
}

export interface ActivityAction extends Action {
  type: ActionType.ACTIVITY;
  payload: Activity;
}

export interface ActivityErrorAction extends Action {
  type: ActionType.ERROR;
  payload: ActivityError;
}

export type Actions = ActivityAction | ActivityErrorAction;
