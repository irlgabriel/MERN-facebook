import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { User } from "../Types/types";

/**
 * ACTIONS
 */
const getUsers = createAsyncThunk("users/getUsers", async () => {
  const users = (await Axios.get<User[]>("/users")).data;
  return users;
});
const getUser = createAsyncThunk("users/getUser", async (userId: string) => {
  const user = (await Axios.get<User>("/users/" + userId)).data;
  return user;
});
const deleteUser = createAsyncThunk("users/deleteUser", async () => {
  const user = (await Axios.delete<User>("/users")).data;
  return user;
});
const updateDesc = createAsyncThunk(
  "users/updateDesc",
  async ({ userId, description }: { userId: string; description: string }) => {
    const user = (await Axios.post<User>("/users/" + userId, { description }))
      .data;
    return user;
  }
);
const updateProfilePhoto = createAsyncThunk(
  "users/updateProfilePhoto",
  async ({ formData }: { formData: FormData }) => {
    const user = (await Axios.post<User>("/users", { formData })).data;
    return user;
  }
);
const updateCoverPhoto = createAsyncThunk(
  "users/updateCoverPhoto",
  async ({ formData }: { formData: FormData }) => {
    const user = (await Axios.post<User>("/users", { formData })).data;
    return user;
  }
);

/**
 * STATE
 */
const initialState: State = {
  users: [],
  loading: false,
  fetched: false,
  error: null,
};

/**
 * TYPES
 */
export interface State {
  users: User[];
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
    /// GET USERS
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      const users = action.payload;
      state.loading = false;
      state.users.push(...users);
      state.fetched = true;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// GET USER
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      const user = action.payload;
      state.loading = false;
      state.users.push(user);
      state.fetched = true;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// DELETE USER
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const user = action.payload;
      state.loading = false;
      state.users = state.users.filter((u) => u._id !== user._id);
      state.fetched = true;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// UPDATE DESCRIPTION
    builder.addCase(updateDesc.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateDesc.fulfilled, (state, action) => {
      const user = action.payload;
      state.loading = false;
      state.users = state.users
        .filter((d) => !!d)
        .map((u) => (u._id !== user._id ? u : user));
      state.fetched = true;
    });
    builder.addCase(updateDesc.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// UPDATE PROFILE PHOTO
    builder.addCase(updateProfilePhoto.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfilePhoto.fulfilled, (state, action) => {
      const user = action.payload;
      state.loading = false;
      state.users.push(user);
      state.fetched = true;
    });
    builder.addCase(updateProfilePhoto.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// UPDATE PROFILE PHOTO
    builder.addCase(updateCoverPhoto.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCoverPhoto.fulfilled, (state, action) => {
      const user = action.payload;
      state.loading = false;
      state.users.push(user);
      state.fetched = true;
    });
    builder.addCase(updateCoverPhoto.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default postsSlice;
