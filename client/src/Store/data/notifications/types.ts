import { Notification } from "Types";
import { Action } from "redux";

export interface State {
  notifications: Notification[];
  byId: {
    [key: string]: Notification;
  };
}

export enum ActionType {
  GET_ALL = "data/notifications/GET_ALL",
  CLEAR_ALL = "data/notifications/CLEAR_ALL",
  DELETE_ALL = "data/notifications/DELETE_ALL",
  CLEAR_ONE = "data/notifications/CLEAR_ONE",
  DELETE_ONE = "data/notifications/DELETE_ONE",
}

export interface GetNotificationsAction extends Action {
  type: ActionType.GET_ALL;
  payload: {
    notifications: Notification[];
  };
}

export interface ClearNotificationsAction extends Action {
  type: ActionType.CLEAR_ALL;
}

export interface ClearNotificationAction extends Action {
  type: ActionType.CLEAR_ONE;
  payload: {
    id: string;
  };
}

export interface DeleteNotificationsAction extends Action {
  type: ActionType.DELETE_ALL;
}

export interface DeleteNotificationAction extends Action {
  type: ActionType.DELETE_ONE;
  payload: {
    id: string;
  };
}

export type Actions =
  | GetNotificationsAction
  | ClearNotificationsAction
  | ClearNotificationAction
  | DeleteNotificationsAction
  | DeleteNotificationAction;
