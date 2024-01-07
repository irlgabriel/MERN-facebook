import { UserIdRequestInput } from "./types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { FriendRequest, User } from "../Types/types";
import axios from "../helpers/network";

/**
 * ACTIONS
 */
export const getRequests = createAsyncThunk(
  "friendRequests/getFriendRequests",
  async () => {
    const requests = (await axios.get<FriendRequest[]>("/friend_requests/"))
      .data;

    return requests;
  }
);

export const getRecommendations = createAsyncThunk(
  "friendRequests/getRecommendations",
  async () => {
    const users = (await axios.get<User[]>("/friend_requests/recommendations"))
      .data;

    return users;
  }
);

export const sendRequest = createAsyncThunk(
  "friendRequests/sendRequest",
  async ({ userId }: UserIdRequestInput) => {
    const request = (
      await axios.post<FriendRequest>(`/friend_requests/${userId}/send`, {})
    ).data;

    return request;
  }
);
export const acceptRequest = createAsyncThunk(
  "friendRequests/acceptRequest",
  async ({ userId }: UserIdRequestInput) => {
    const request = (
      await axios.post<FriendRequest>(`/friend_requests/${userId}/accept`, {})
    ).data;

    return request;
  }
);
export const declineRequest = createAsyncThunk(
  "friendRequests/declineRequest",
  async ({ userId }: UserIdRequestInput) => {
    const request = (
      await axios.delete<FriendRequest>(`/friend_requests/${userId}/decline`)
    ).data;

    return request;
  }
);
export const removeFriend = createAsyncThunk(
  "friendRequests/removeFriend",
  async ({ userId }: UserIdRequestInput) => {
    const request = (
      await axios.delete<FriendRequest>(`/friend_requests/${userId}/delete`)
    ).data;

    return request;
  }
);

/**
 * STATE
 */
const initialState: State = {
  requests: [],
  suggestions: [],
  loading: false,
  error: null,
};

/**
 * TYPES
 */
export interface State {
  requests: FriendRequest[];
  suggestions: User[];
  loading: boolean;
  error: string | null;
}

/**
 * SELECTORS
 */
const selectFriendRequests = (state: State) => state.requests;

const selectUserId = (_: State, userId: string) => userId;

export const selectSentFriendRequest = createSelector(
  [selectFriendRequests, selectUserId],
  (friendRequests, userId) =>
    friendRequests.find((request) => request.to === userId)
);

export const selectReceivedFriendRequest = createSelector(
  [selectFriendRequests, selectUserId],
  (friendRequests, userId) =>
    friendRequests.find((request) => request.from === userId)
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
    /// GET RECOMMENDATIONS
    builder.addCase(getRecommendations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRecommendations.fulfilled, (state, action) => {
      const suggestions = action.payload;
      state.loading = false;
      state.suggestions.push(...suggestions);
    });
    builder.addCase(getRecommendations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// SEND REQUEST
    builder.addCase(sendRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendRequest.fulfilled, (state, action) => {
      const request = action.payload;
      state.loading = false;
      state.requests.push(request);
    });
    builder.addCase(sendRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// ACCEPT REQUEST
    builder.addCase(acceptRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(acceptRequest.fulfilled, (state, action) => {
      const { _id: id } = action.payload;
      state.loading = false;
      state.requests = state.requests.filter((request) => request._id !== id);
    });
    builder.addCase(acceptRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// DECLINE REQUEST
    builder.addCase(declineRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(declineRequest.fulfilled, (state, action) => {
      const { _id: id } = action.payload;
      state.loading = false;
      state.requests = state.requests.filter((request) => request._id !== id);
    });
    builder.addCase(declineRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });

    /// GET REQUESTS
    builder.addCase(getRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRequests.fulfilled, (state, action) => {
      const requests = action.payload;
      state.loading = false;

      state.requests = requests;
    });
    builder.addCase(getRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default postsSlice;
