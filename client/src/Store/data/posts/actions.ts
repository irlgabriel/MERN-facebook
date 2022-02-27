import { Post } from "Types";
import {
  ActionType,
  GetPostAction,
  DeletePostAction,
  EditPostAction,
  GetPostsAction,
  GetUsersPostsAction,
  CreatePostInput,
  CreatePostAction,
} from "./types";
import { Thunk } from "Store/types";
import { beginActivity, setError, endActivity } from "Store/activities";
import axios from "axios";
import { v4 as uuid } from "uuid";

const getPostsAction = (posts: Post[]): GetPostsAction => ({
  type: ActionType.GET_ALL,
  payload: { posts },
});

export const getPosts = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();

  const config = {
    headers: {
      Authorization: "bearer " + getState().auth.auth.token,
    },
  };

  try {
    dispatch(beginActivity({ type: ActionType.GET_ALL, uuid: activityId }));
    const { data } = await axios.get<Post[]>("/posts", config);
    dispatch(getPostsAction(data));
  } catch (e: any) {
    setError({
      type: ActionType.GET_ALL,
      message: e.message,
      uuid: activityId,
    });
  } finally {
    dispatch(endActivity({ uuid: activityId }));
  }
};

// EDIT
const editPostAction = (post: Post): EditPostAction => ({
  type: ActionType.EDIT_POST,
  payload: { post },
});

export const editPost =
  ({ id, post }: { id: string; post: CreatePostInput }): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: {
        Authorization: "bearer " + getState().auth.auth.token,
      },
    };

    try {
      dispatch(beginActivity({ type: ActionType.EDIT_POST, uuid: activityId }));
      const { data: editedPost } = await axios.put<Post>(
        `/posts/${id}`,
        post,
        config
      );
      dispatch(editPostAction(editedPost));
    } catch (e: any) {
      setError({
        type: ActionType.EDIT_POST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

// create
const createPostAction = (post: Post): CreatePostAction => ({
  type: ActionType.CREATE_POST,
  payload: { post },
});

export const createPost =
  (createPostInput: CreatePostInput): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: {
        Authorization: "bearer " + getState().auth.auth.token,
      },
    };

    try {
      dispatch(
        beginActivity({ type: ActionType.CREATE_POST, uuid: activityId })
      );
      const { data: post } = await axios.post<Post>(
        `/posts`,
        createPostInput,
        config
      );
      dispatch(createPostAction(post));
    } catch (e: any) {
      setError({
        type: ActionType.CREATE_POST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

//GET
const getPostAction = ({
  id,
  post,
}: {
  id: string;
  post: Post;
}): GetPostAction => ({
  type: ActionType.GET_POST,
  payload: { id, post },
});

export const getPost =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: {
        Authorization: "bearer " + getState().auth.auth.token,
      },
    };

    try {
      dispatch(beginActivity({ type: ActionType.GET_POST, uuid: activityId }));
      const { data: post } = await axios.get<Post>(`/posts/${id}`, config);

      dispatch(getPostAction({ post, id }));
    } catch (e: any) {
      setError({
        type: ActionType.GET_POST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

//remove
const removePostAction = (id: string): DeletePostAction => ({
  type: ActionType.DELETE_POST,
  payload: { id },
});

export const deletePost =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: {
        Authorization: "bearer " + getState().auth.auth.token,
      },
    };

    try {
      dispatch(
        beginActivity({ type: ActionType.DELETE_POST, uuid: activityId })
      );
      await axios.delete(`/posts/${id}`, config);
      dispatch(removePostAction(id));
    } catch (e: any) {
      setError({
        type: ActionType.DELETE_POST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

const getUserPostsAction = (
  posts: Post[],
  id: string
): GetUsersPostsAction => ({
  type: ActionType.GET_POSTS_BY_USER,
  payload: { posts, user_id: id },
});

export const getUserPosts =
  (userId: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: {
        Authorization: "bearer " + getState().auth.auth.token,
      },
    };

    try {
      dispatch(
        beginActivity({ type: ActionType.GET_POSTS_BY_USER, uuid: activityId })
      );
      const { data } = await axios.get<Post[]>(`/posts/${userId}`, config);
      dispatch(getUserPostsAction(data, userId));
    } catch (e: any) {
      setError({
        type: ActionType.GET_POSTS_BY_USER,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

export const likePost =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: {
        Authorization: "bearer " + getState().auth.auth.token,
      },
    };

    try {
      dispatch(beginActivity({ type: ActionType.LIKE_POST, uuid: activityId }));
      const { data: post } = await axios.post<Post>(
        `/posts/${id}/like`,
        {},
        config
      );
      dispatch(getPostAction({ id: post._id, post }));
    } catch (e: any) {
      setError({
        type: ActionType.LIKE_POST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };
