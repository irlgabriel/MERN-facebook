import { User } from "Types";
import { Action } from "redux";

export interface LoginData {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface State {
  auth: {
    token: string | null;
    user: User | null;
    currentUser: User | null;
  };
}

export enum ActionType {
  LOGIN = "auth/LOGIN",
  LOGOUT = "auth/LOGOUT",
  IS_LOGGED_IN = "auth/IS_LOGGED_IN",
  DELETE_ACCOUNT = "auth/DELETE_ACCOUNT",
}

export interface LoginAction extends Action {
  type: ActionType.LOGIN;
  payload: {
    user: User;
    token: string;
  };
}

export interface IsLoggedInAction extends Action {
  type: ActionType.IS_LOGGED_IN;
  payload: {
    user: User;
    token: string;
  };
}

export interface LogoutAction extends Action {
  type: ActionType.LOGOUT;
}

export interface DeleteAccountAction extends Action {
  type: ActionType.DELETE_ACCOUNT;
}

export type Actions =
  | LoginAction
  | LogoutAction
  | IsLoggedInAction
  | DeleteAccountAction;
