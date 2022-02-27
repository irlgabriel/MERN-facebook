import { FriendRequest } from "Types";
import { Action } from "redux";

export interface State {
  requests: FriendRequest[];
  byId: {
    [key: string]: FriendRequest;
  };
  suggestions: FriendRequest[];
  byUser: {
    [key: string]: FriendRequest[];
  };
}

export enum ActionType {
  GET_ALL = "data/friend_requests/GET_ALL",
  GET_SUGGESTIONS = "data/friend_requests/GET_SUGGESTIONS",
  SEND_REQUEST = "data/friend_requests/SEND_REQUEST",
  DECLINE_REQUEST = "data/friend_requests/DECLINE_REQUEST",
  CONFIRM_REQUEST = "data/friend_requests/CONFIRM_REQUEST",
  GET_USER_FRIEND_REQUESTS = "data/friend_requests/GET_USER_FRIEND_REQUESTS",
}

export interface GetFriendRequestsAction extends Action {
  type: ActionType.GET_ALL;
  payload: {
    requests: FriendRequest[];
  };
}

export interface GetUserFriendRequestsAction extends Action {
  type: ActionType.GET_ALL;
  payload: {
    requests: FriendRequest[];
    user_id: string;
  };
}

export interface GetFriendSuggestionsAction extends Action {
  type: ActionType.GET_SUGGESTIONS;
  payload: {
    requests: FriendRequest[];
  };
}

export interface SendRequestAction extends Action {
  type: ActionType.SEND_REQUEST;
  payload: {
    request_id: string;
  };
}

export interface DeclineRequestAction extends Action {
  type: ActionType.DECLINE_REQUEST;
  payload: {
    request_id: string;
  };
}

export interface ConfirmRequestAction extends Action {
  type: ActionType.CONFIRM_REQUEST;
  payload: {
    request_id: string;
  };
}

export type Actions =
  | GetFriendRequestsAction
  | GetFriendSuggestionsAction
  | DeclineRequestAction
  | SendRequestAction
  | ConfirmRequestAction
  | GetUserFriendRequestsAction;
