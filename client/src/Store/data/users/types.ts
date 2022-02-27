import { User } from "Types";
import { Action } from "redux";

export interface State {
  users: User[];
  user: User | null;
  byId: { [key: string]: User };
}

export enum ActionType {
  GET_ALL = "data/users/GET_ALL",
  GET_ONE = "data/users/GET_ONE",
}

export interface GetUsersAction extends Action {
  type: ActionType.GET_ALL;
  payload: {
    users: User[];
  };
}

export interface GetUserAction extends Action {
  type: ActionType.GET_ONE;
  payload: {
    user: User | null;
  };
}

export type Actions = GetUsersAction | GetUserAction;
