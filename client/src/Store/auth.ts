import { User } from "./../Types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../Api/helpers";
import { Post } from "../Types/types";

/**
 * ACTIONS
 */
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const { token, user } = (
      await Axios.post<{ token: string; user: User }>("/login", {
        email,
        password,
      })
    ).data;
    localStorage.setItem("token", token);
    return user;
  }
);

export const getLoggedInUser = createAsyncThunk(
  "auth/getLoggedInUser",
  async () => {
    const userId = (
      await Axios.get<{ user_id: User["_id"] | null }>("/isLoggedIn")
    ).data.user_id;
    if (userId) {
      console.log(userId);
      const user = (await Axios.get<User>("/users/" + userId)).data;
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
  },
});

export default postsSlice;
