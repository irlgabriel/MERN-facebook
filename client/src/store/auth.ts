import { IUser } from "./../../../server/models/users";
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
    console.log("Axios Base URL:", axios.defaults.baseURL);
    const { token, user } = (
      await axios.post<{ token: string; user: IUser }>("/login", {
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
      await axios.get<{ user_id: IUser["_id"] | null }>("/isLoggedIn")
    ).data.user_id;
    if (userId) {
      const user = (await axios.get<IUser>("/users/" + userId)).data;
      return user;
    }
    return null;
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
  user: IUser | null;
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
    //@ts-ignore
    return user?.friends.includes(userId) || user._id === userId;
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
      const user = action.payload as IUser;
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
      const user = action.payload as IUser;
      state.loading = false;
      state.user = user;
      state.fetched = true;
      return state;
    });
    builder.addCase(getLoggedInUser.rejected, (state, action) => {
      state.fetched = true;
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
        (friend) => friend.toString() !== removedFriendId
      );

      return state;
    });
  },
});

export default postsSlice;
