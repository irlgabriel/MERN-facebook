import { FriendRequest } from "Types";
import {
  ActionType,
  GetFriendRequestsAction,
  GetFriendSuggestionsAction,
  GetUserFriendRequestsAction,
  SendRequestAction,
  ConfirmRequestAction,
  DeclineRequestAction,
} from "./types";
import { Thunk } from "Store/types";
import { beginActivity, setError, endActivity } from "Store/activities";
import axios from "axios";
import { v4 as uuid } from "uuid";

const getFriendRequestsAction = (
  requests: FriendRequest[]
): GetFriendRequestsAction => ({
  type: ActionType.GET_ALL,
  payload: { requests },
});

export const getFriendRequests = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();

  const config = {
    headers: { Authorization: `bearer ${getState().auth.auth.token}` },
  };

  try {
    dispatch(beginActivity({ type: ActionType.GET_ALL, uuid: activityId }));
    const { data } = await axios.get<FriendRequest[]>(
      "/friend_requests",
      config
    );
    dispatch(getFriendRequestsAction(data));
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

const getUserFriendRequestsAction = (
  requests: FriendRequest[],
  user_id: string
): GetUserFriendRequestsAction => ({
  type: ActionType.GET_ALL,
  payload: { requests, user_id },
});

export const getUserFriendRequests =
  (user_id: string): Thunk =>
  async (dispatch) => {
    const activityId = uuid();

    try {
      dispatch(
        beginActivity({
          type: ActionType.GET_USER_FRIEND_REQUESTS,
          uuid: activityId,
        })
      );
      const { data } = await axios.get<FriendRequest[]>("/friend_requests");
      dispatch(getFriendRequestsAction(data));
    } catch (e: any) {
      setError({
        type: ActionType.GET_USER_FRIEND_REQUESTS,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

const getFriendSuggestionsAction = (
  requests: FriendRequest[]
): GetFriendSuggestionsAction => ({
  type: ActionType.GET_SUGGESTIONS,
  payload: { requests },
});

export const getFriendSuggestions = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();

  const config = {
    headers: { Authorization: `bearer ${getState().auth.auth.token}` },
  };

  try {
    dispatch(
      beginActivity({ type: ActionType.GET_SUGGESTIONS, uuid: activityId })
    );
    const { data } = await axios.get<FriendRequest[]>(
      "/friend_requests/recommendations",
      config
    );
    dispatch(getFriendSuggestionsAction(data));
  } catch (e: any) {
    setError({
      type: ActionType.GET_SUGGESTIONS,
      message: e.message,
      uuid: activityId,
    });
  } finally {
    dispatch(endActivity({ uuid: activityId }));
  }
};

const confirmRequestAction = (request_id: string): ConfirmRequestAction => ({
  type: ActionType.CONFIRM_REQUEST,
  payload: { request_id },
});

export const confirmRequest =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };
    try {
      dispatch(
        beginActivity({ type: ActionType.CONFIRM_REQUEST, uuid: activityId })
      );
      await axios.post<FriendRequest>(
        `/friend_requests/${id}/confirm`,
        {},
        config
      );
      dispatch(confirmRequestAction(id));
    } catch (e: any) {
      setError({
        type: ActionType.CONFIRM_REQUEST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

const sendRequestAction = (request_id: string): SendRequestAction => ({
  type: ActionType.SEND_REQUEST,
  payload: { request_id },
});

export const sendRequest =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };

    try {
      dispatch(
        beginActivity({ type: ActionType.SEND_REQUEST, uuid: activityId })
      );
      await axios.post(`/friend_requests/${id}/send`, {}, config);
      dispatch(sendRequestAction(id));
    } catch (e: any) {
      setError({
        type: ActionType.SEND_REQUEST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

const declineRequestAction = (request_id: string): DeclineRequestAction => ({
  type: ActionType.DECLINE_REQUEST,
  payload: { request_id },
});

export const declineRequest =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const config = {
      headers: { Authorization: `bearer ${getState().auth.auth.token}` },
    };

    try {
      dispatch(
        beginActivity({ type: ActionType.DECLINE_REQUEST, uuid: activityId })
      );
      await axios.post(`/friend_requests/${id}/decline`, {}, config);
      dispatch(declineRequestAction(id));
    } catch (e: any) {
      setError({
        type: ActionType.DECLINE_REQUEST,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };
