import { Post } from "Types";
import { Action } from "redux";

export interface State {
  posts: Post[];
  byUser: { [key: string]: Post[] };
  byId: { [key: string]: Post };
}

export enum ActionType {
  GET_ALL = "data/posts/GET_ALL",
  CREATE_POST = "data/posts/CREATE_POST",
  EDIT_POST = "data/posts/EDIT_POST",
  GET_POST = "data/posts/GET_POST",
  DELETE_POST = "data/posts/DELETE_POST",
  GET_POSTS_BY_USER = "data/posts/GET_POSTS_BY_USER",
  LIKE_POST = "data/posts/LIKE_POST",
  GET_COMMENTS_COUNT = "data/posts/GET_COMMENTS_COUNT",
}

//should be in api
export interface CreatePostInput {
  content: string;
  image?: string;
}

export interface GetPostsAction extends Action {
  type: ActionType.GET_ALL;
  payload: {
    posts: Post[];
  };
}

export interface LikePostAction extends Action {
  type: ActionType.LIKE_POST;
  payload: {
    id: string;
  };
}

export interface DeletePostAction extends Action {
  type: ActionType.DELETE_POST;
  payload: {
    id: string;
  };
}

export interface EditPostAction extends Action {
  type: ActionType.EDIT_POST;
  payload: {
    post: Post;
  };
}

export interface CreatePostAction extends Action {
  type: ActionType.CREATE_POST;
  payload: {
    post: Post;
  };
}

export interface GetPostAction extends Action {
  type: ActionType.GET_POST;
  payload: {
    id: string;
    post: Post;
  };
}

export interface GetUsersPostsAction extends Action {
  type: ActionType.GET_POSTS_BY_USER;
  payload: {
    posts: Post[];
    user_id: string;
  };
}

export interface GetCommentsCountAction extends Action {
  type: ActionType.GET_COMMENTS_COUNT;
  payload: {
    count: number;
  };
}

export type Actions =
  | GetPostsAction
  | GetUsersPostsAction
  | EditPostAction
  | DeletePostAction
  | GetPostAction
  | CreatePostAction
  | LikePostAction
  | GetCommentsCountAction;
