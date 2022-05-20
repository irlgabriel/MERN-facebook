import { Comment } from "Types";
import {
  ActionType,
  GetCommentsAction,
  GetRepliesAction,
  EditCommentAction,
  CreateCommentAction,
  DeleteCommentAction,
  CreateCommentInput,
  LikeCommentAction,
} from "./types";
import { Thunk } from "Store/types";
import axios from "axios";

const getCommentsAction = (comments: Comment[]): GetCommentsAction => ({
  type: ActionType.GET_ALL,
  payload: { comments },
});

export const getComments =
  (post_id: string): Thunk =>
  async (dispatch) => {
    try {
      const { data } = await axios.get<Comment[]>(`posts/${post_id}/comments`);
      dispatch(getCommentsAction(data));
    } catch (e: any) {
      throw new Error("failed to fetch comments");
    }
  };

const getRepliesAction = (comments: Comment[]): GetRepliesAction => ({
  type: ActionType.GET_REPLIES,
  payload: { comments },
});

export const getReplies =
  (comment_id: string): Thunk =>
  async (dispatch) => {
    try {
      const { data } = await axios.get<Comment[]>(`/comments/${comment_id}`);
      dispatch(getRepliesAction(data));
    } catch (e: any) {
      throw new Error("failed to fetch comments");
    }
  };

const editCommentAction = (comment: Comment): EditCommentAction => ({
  type: ActionType.EDIT_COMMENT,
  payload: { comment },
});

export const editComment =
  (post_id: string, comment_id: string, input: CreateCommentInput): Thunk =>
  async (dispatch, getState) => {
    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };
    try {
      const { data } = await axios.put<Comment>(
        `posts/${post_id}/comments/${comment_id}`,
        input,
        config
      );
      dispatch(editCommentAction(data));
    } catch (e: any) {
      throw new Error("failed to fetch comments");
    }
  };

const createCommentAction = (comment: Comment): CreateCommentAction => ({
  type: ActionType.CREATE_COMMENT,
  payload: { comment },
});

export const createComment =
  (post_id: string, input: CreateCommentInput): Thunk =>
  async (dispatch, getState) => {
    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };
    try {
      const { data } = await axios.post<Comment>(
        `posts/${post_id}/comments/`,
        input,
        config
      );
      dispatch(createCommentAction(data));
    } catch (e: any) {
      throw new Error("failed to fetch comments");
    }
  };

const deleteCommentAction = (comment: Comment): DeleteCommentAction => ({
  type: ActionType.DELETE_COMMENT,
  payload: { comment },
});

export const deleteComment =
  (post_id: string, comment_id: string): Thunk =>
  async (dispatch, getState) => {
    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };
    try {
      const { data } = await axios.delete<Comment>(
        `posts/${post_id}/comments/${comment_id}`,
        config
      );
      dispatch(deleteCommentAction(data));
    } catch (e: any) {
      console.log(e);
      // throw new Error("failed to fetch comments");
    }
  };

const likeCommentAction = (comment: Comment): LikeCommentAction => ({
  type: ActionType.LIKE_COMMENT,
  payload: { comment },
});

export const likeComment =
  (post_id: string, comment_id: string): Thunk =>
  async (dispatch, getState) => {
    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };

    try {
      const { data } = await axios.post<Comment>(
        `posts/${post_id}/comments/${comment_id}`,
        {},
        config
      );
      dispatch(likeCommentAction(data));
    } catch (e: any) {
      throw new Error("failed to fetch comments");
    }
  };
