import {
  ActionType,
  LoginAction,
  LogoutAction,
  LoginData,
  LoginCredentials,
} from "./types";
import { v4 as uuid } from "uuid";
import { User } from "Types";
import { Thunk } from "Store/types";
import axios from "axios";
import { setError, beginActivity, endActivity } from "Store/activities";

const loginAction = ({ user, token }: LoginData): LoginAction => ({
  type: ActionType.LOGIN,
  payload: { user, token },
});

export const login =
  ({ email, password }: LoginCredentials): Thunk =>
  async (dispatch) => {
    try {
      const { data } = await axios.post<LoginData>("/login", {
        email,
        password,
      });
      dispatch(loginAction(data));
    } catch (e) {
      throw new Error("Error logging in");
    }
  };

const logoutAction = (): LogoutAction => ({
  type: ActionType.LOGOUT,
});

export const logout = (): Thunk => async (dispatch) => {
  try {
    await axios.post("/logout");
    localStorage.removeItem("token");
    dispatch(logoutAction());
  } catch (e) {
    throw new Error("Error logging out");
  }
};

export const isLoggedIn = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();
  const state = getState();

  const token = state.auth.auth.token;
  const config = { headers: { Authorization: `bearer ${token}` } };
  try {
    dispatch(
      beginActivity({ type: ActionType.IS_LOGGED_IN, uuid: activityId })
    );
    const {
      data: { user_id },
    } = await axios.get<{ user_id: string }>("/isLoggedIn", config);

    if (user_id) {
      const { data: user } = await axios.get<User | null>(`/users/${user_id}`);
      user && token && dispatch(loginAction({ user, token }));
    }
  } catch (e: any) {
    dispatch(
      setError({
        type: ActionType.IS_LOGGED_IN,
        message: e.message,
        uuid: activityId,
      })
    );
  } finally {
    dispatch(endActivity({ uuid: activityId }));
  }
};

export const deleteAccount = (): Thunk => async (dispatch, getState) => {
  const activityId = uuid();
  const token = getState().auth.auth.token;
  const config = { headers: { Authorization: `bearer ${token}` } };

  try {
    dispatch(
      beginActivity({ type: ActionType.DELETE_ACCOUNT, uuid: activityId })
    );
    await axios.delete("/users", config);
    dispatch(logout());
  } catch (e: any) {
    dispatch(
      setError({
        type: ActionType.DELETE_ACCOUNT,
        message: e.message,
        uuid: activityId,
      })
    );
  } finally {
    dispatch(endActivity({ uuid: activityId }));
  }
};
