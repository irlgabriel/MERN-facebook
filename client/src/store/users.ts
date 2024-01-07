import { IUser } from "./../../../server/models/users";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "../helpers/network";
import { FriendRequest } from "../types/types";
import { UserIdRequestInput } from "./types";
import { RootState } from "./store";
import { getLoggedInUser } from "./auth";

/**
 * ACTIONS
 */
export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const users = (await axios.get<IUser[]>("/users")).data;
  return users;
});
export const getUser = createAsyncThunk(
  "users/getUser",
  async (userId: string) => {
    const user = (await axios.get<IUser>("/users/" + userId)).data;
    return user;
  }
);
export const deleteUser = createAsyncThunk("users/deleteUser", async () => {
  const user = (await axios.delete<IUser>("/users")).data;
  return user;
});
export const updateDesc = createAsyncThunk(
  "users/updateDesc",
  async ({ userId, description }: { userId: string; description: string }) => {
    const user = (await axios.post<IUser>("/users/" + userId, { description }))
      .data;
    return user;
  }
);
export const updateProfilePhoto = createAsyncThunk(
  "users/updateProfilePhoto",
  async ({ formData }: { formData: FormData }) => {
    const user = (await axios.post<IUser>("/users", { formData })).data;
    return user;
  }
);
export const updateCoverPhoto = createAsyncThunk(
  "users/updateCoverPhoto",
  async ({ formData }: { formData: FormData }) => {
    const user = (await axios.post<IUser>("/users", { formData })).data;
    return user;
  }
);

export const removeFriend = createAsyncThunk(
  "users/removeFriend",
  async ({ userId }: UserIdRequestInput, { getState }) => {
    const request = (
      await axios.delete<FriendRequest>(`/friend_requests/${userId}/delete`)
    ).data;

    const owner = (getState() as RootState).auth.user;

    return { request, owner };
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
 * SELECTORS
 */

const selectUserId = (_: State, userId: string) => userId;

const selectUsers = (state: State) => state.users;

export const selectUserById = createSelector(
  [selectUsers, selectUserId],
  (users, userId) => users?.find((user) => user._id === userId) ?? null
);

/**
 * TYPES
 */
export interface State {
  users: IUser[];
  loading: boolean;
  fetched: boolean;
  error: string | null;
}

const usersSlice = createSlice({
  name: "users",
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
    /// REMOVE FRIEND
    builder.addCase(removeFriend.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFriend.fulfilled, (state, action) => {
      const {
        request: { _id: removedFriendId },
        owner,
      } = action.payload;
      state.loading = false;
      state.users = state.users.map((u) =>
        u._id === owner?._id
          ? {
              ...u,
              friends: u.friends.filter(
                (friend) => friend.toString() !== removedFriendId
              ),
            }
          : u
      );
    });
    builder.addCase(removeFriend.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// GET LOGGED IN USER
    builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
      const user = action.payload;
      if (user) {
        state.users.push(user);
      }
    });
  },
});

export default usersSlice;
