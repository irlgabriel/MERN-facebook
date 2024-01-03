import { User } from "./../Types/types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { removeFriend } from "./users";
import axios from "../helpers/network";
/**
 * ACTIONS
 */
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const { token, user } = (
      await axios.post<{ token: string; user: User }>("/login", {
        email,
        password,
      })
    ).data;
    typeof window !== undefined && localStorage.setItem("token", token);
    return user;
  }
);

export const getLoggedInUser = createAsyncThunk(
  "auth/getLoggedInUser",
  async () => {
    const userId = (
      await axios.get<{ user_id: User["_id"] | null }>("/isLoggedIn")
    ).data.user_id;
    if (userId) {
      console.log(userId);
      const user = (await axios.get<User>("/users/" + userId)).data;
      console.log({ user });
      return user;
    }
  }
);

/**
 * STATE
 */
const initialState: State = {
  user: null,
  loading: false,
  fetched: false,
  error: null,
};

/**
 * TYPES
 */
export interface State {
  user: User | null;
  loading: boolean;
  fetched: boolean;
  error: string | null;
}
/**
 * SELECTORS
 */

const selectUser = (state: State) => state.user;

const selectUserId = (_: State, userId: string) => userId;

export const selectIsFriend = createSelector(
  [selectUser, selectUserId],
  (user, userId) => {
    if (!user) return false;
    user?.friends.includes(userId);
  }
);

/**
 * REDUCER
 */

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPosts: () => undefined,
  },
  extraReducers: (builder) => {
    /// LOGIN
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      return state;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      //@ts-ignore
      const user = action.payload as User;
      state.loading = false;
      state.user = user;
      state.fetched = true;
      return state;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
      return state;
    });
    /// GET LOGGED IN USER
    builder.addCase(getLoggedInUser.pending, (state) => {
      state.loading = true;
      return state;
    });
    builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
      //@ts-ignore
      const user = action.payload as User;
      state.loading = false;
      state.user = user;
      state.fetched = true;
      return state;
    });
    builder.addCase(getLoggedInUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
      return state;
    });
    // REMOVE FRIEND
    builder.addCase(removeFriend.fulfilled, (state, action) => {
      const {
        request: { _id: removedFriendId },
        owner,
      } = action.payload;

      // not logged in
      if (!state.user) return;

      state.loading = false;
      state.user.friends = state.user.friends.filter(
        (friend) => friend !== removedFriendId
      );

      return state;
    });
  },
});

export default postsSlice;
