import { Comment } from "Types";
import { Action } from "redux";

export interface State {
  comments: Comment[];
  byPost: { [key: string]: Comment[] };
  byComment: { [key: string]: Comment[] };
}

export interface CreateCommentInput {
  content: string;
  image?: string;
}

export enum ActionType {
  GET_ALL = "data/comments/GET_ALL",
  GET_POST_COMMENTS = "data/comments/GET_POST_COMMENTS",
  GET_REPLIES = "data/comments/GET_REPLIES",
  DELETE_COMMENT = "data/comments/DELETE_COMMENT",
  CREATE_COMMENT = "data/comments/CREATE_COMMENT",
  EDIT_COMMENT = "data/comments/EDIT_COMMENT",
  LIKE_COMMENT = "data/comments/LIKE_COMMENT",
  GET_COMMENTS_COUNT = "data/comments/GET_COMMENTS_COUNT",
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

export interface GetRepliesAction extends Action {
  type: ActionType.GET_REPLIES;
  payload: {
    comments: Comment[];
  };
}

export interface CreateCommentAction extends Action {
  type: ActionType.CREATE_COMMENT;
  payload: {
    comment: Comment;
  };
}

export interface DeleteCommentAction extends Action {
  type: ActionType.DELETE_COMMENT;
  payload: {
    comment: Comment;
  };
}

export interface EditCommentAction extends Action {
  type: ActionType.EDIT_COMMENT;
  payload: {
    comment: Comment;
  };
}

export interface LikeCommentAction extends Action {
  type: ActionType.LIKE_COMMENT;
  payload: {
    comment: Comment;
  };
}

export type Actions =
  | GetCommentsAction
  | GetPostCommentsAction
  | GetRepliesAction
  | CreateCommentAction
  | DeleteCommentAction
  | EditCommentAction
  | LikeCommentAction;
