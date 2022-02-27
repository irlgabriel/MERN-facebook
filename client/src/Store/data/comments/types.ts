import { Comment } from "Types";
import { Action } from "redux";

export interface State {
  comments: Comment[];
}

export enum ActionType {
  GET_ALL = "data/comments/GET_ALL",
  GET_POST_COMMENTS = "data/comments/GET_POST_COMMENTS",
}

export interface GetCommentsAction extends Action {
  type: ActionType.GET_ALL;
  payload: {
    comments: Comment[];
  };
}

export interface GetPostCommentsAction extends Action {
  type: ActionType.GET_POST_COMMENTS;
  payload: {
    comments: Comment[];
  };
}

export type Actions = GetCommentsAction | GetPostCommentsAction;
