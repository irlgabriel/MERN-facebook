import { Notification } from "Types";
import {
  ActionType,
  GetNotificationsAction,
  ClearNotificationsAction,
  ClearNotificationAction,
  DeleteNotificationsAction,
  DeleteNotificationAction,
} from "./types";
import { Thunk } from "Store/types";
import { beginActivity, setError, endActivity } from "Store/activities";
import axios from "axios";
import { v4 as uuid } from "uuid";

const getNotificationsActions = (
  notifications: Notification[]
): GetNotificationsAction => ({
  type: ActionType.GET_ALL,
  payload: { notifications },
});

export const getNotifications = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();

  const config = {
    headers: { Authorization: `bearer ${getState().auth.auth.token}` },
  };

  try {
    dispatch(beginActivity({ type: ActionType.GET_ALL, uuid: activityId }));
    const { data } = await axios.get<Notification[]>("/notifications", config);
    dispatch(getNotificationsActions(data));
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

const clearNotificationsAction = (): ClearNotificationsAction => ({
  type: ActionType.CLEAR_ALL,
});

export const clearNotifications = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();

  const token = getState().auth.auth.token;

  const config = { headers: { Authorization: `bearer ${token}` } };
  try {
    dispatch(beginActivity({ type: ActionType.CLEAR_ALL, uuid: activityId }));
    await axios.put("/notifications", {}, config);
    dispatch(clearNotificationsAction());
  } catch (e: any) {
    setError({
      type: ActionType.CLEAR_ALL,
      message: e.message,
      uuid: activityId,
    });
  } finally {
    dispatch(endActivity({ uuid: activityId }));
  }
};

const clearNotificationAction = (id: string): ClearNotificationAction => ({
  type: ActionType.CLEAR_ONE,
  payload: {
    id,
  },
});

export const clearNotification =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const token = getState().auth.auth.token;

    const config = { headers: { Authorization: `bearer ${token}` } };

    try {
      dispatch(beginActivity({ type: ActionType.CLEAR_ONE, uuid: activityId }));
      await axios.put(`/notifications/${id}`, {}, config);
      dispatch(clearNotificationAction(id));
    } catch (e: any) {
      setError({
        type: ActionType.CLEAR_ONE,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };

const deleteNotificationsAction = (): DeleteNotificationsAction => ({
  type: ActionType.DELETE_ALL,
});

export const deleteNotifications = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();

  const token = getState().auth.auth.token;

  const config = { headers: { Authorization: `bearer ${token}` } };
  try {
    dispatch(beginActivity({ type: ActionType.DELETE_ALL, uuid: activityId }));
    await axios.delete("/notifications", config);
    dispatch(deleteNotificationsAction());
  } catch (e: any) {
    setError({
      type: ActionType.DELETE_ALL,
      message: e.message,
      uuid: activityId,
    });
  } finally {
    dispatch(endActivity({ uuid: activityId }));
  }
};

const deleteNotificationAction = (id: string): DeleteNotificationAction => ({
  type: ActionType.DELETE_ONE,
  payload: {
    id,
  },
});

export const deleteNotification =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const activityId = uuid();

    const token = getState().auth.auth.token;

    const config = { headers: { Authorization: `bearer ${token}` } };

    try {
      dispatch(
        beginActivity({ type: ActionType.DELETE_ONE, uuid: activityId })
      );
      await axios.delete(`/notifications/${id}`, config);
      dispatch(deleteNotificationAction(id));
    } catch (e: any) {
      setError({
        type: ActionType.DELETE_ONE,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };
