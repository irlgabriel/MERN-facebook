import { User } from "Types";
import { ActionType, GetUsersAction, GetUserAction } from "./types";
import { Thunk } from "Store/types";
import { beginActivity, setError, endActivity } from "Store/activities";
import axios from "axios";
import { v4 as uuid } from "uuid";

const getUsersAction = (users: User[]): GetUsersAction => ({
  type: ActionType.GET_ALL,
  payload: { users },
});

export const getUsers = (): Thunk => async (dispatch) => {
  const activityId = uuid();

  try {
    dispatch(beginActivity({ type: ActionType.GET_ALL, uuid: activityId }));
    const { data } = await axios.get<User[]>("/users");
    dispatch(getUsersAction(data));
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

const getUserAction = (user: User | null): GetUserAction => ({
  type: ActionType.GET_ONE,
  payload: { user },
});

export const getUser =
  (id?: string): Thunk =>
  async (dispatch) => {
    const activityId = uuid();

    try {
      dispatch(beginActivity({ type: ActionType.GET_ONE, uuid: activityId }));
      const { data } = await axios.get<User | null>(`/users/${id}`);
      if (data) dispatch(getUserAction(data));
    } catch (e: any) {
      setError({
        type: ActionType.GET_ONE,
        message: e.message,
        uuid: activityId,
      });
    } finally {
      dispatch(endActivity({ uuid: activityId }));
    }
  };
