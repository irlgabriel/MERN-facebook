import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../helpers/network";
import { Notification } from "../types/types";

/**
 * ACTIONS
 */
export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async () => {
    const notifications = (await axios.get<Notification[]>("/notifications"))
      .data;

    return notifications;
  }
);
export const readNotification = createAsyncThunk(
  "notifications/readNotification",
  async (notificationId: string) => {
    const notification = (
      await axios.put<Notification>(`/notifications/${notificationId}`)
    ).data;

    return notification;
  }
);
export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAllNotifications",
  async () => {
    await axios.delete("/notifications");

    return null;
  }
);
export const clearNotification = createAsyncThunk(
  "notifications/clearNotification",
  async (notificationId: string) => {
    await axios.delete(`/notifications/${notificationId}`);

    return notificationId;
  }
);

/**
 * STATE
 */
const initialState: State = {
  notifications: [],
  loading: false,
  error: null,
};

/**
 * TYPES
 */
export interface State {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPosts: () => undefined,
  },
  extraReducers: (builder) => {
    /// GET POSTS
    builder.addCase(getNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      const notifications = action.payload;
      state.notifications = notifications;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });

    /// READ NOTIFICATION
    builder.addCase(readNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(readNotification.fulfilled, (state, action) => {
      const notification = action.payload;
      state.loading = false;
      state.notifications = state.notifications.map((d) =>
        d._id === notification._id ? notification : d
      );
    });
    builder.addCase(readNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });

    /// CLEAR NOTIFICATION
    builder.addCase(clearNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clearNotification.fulfilled, (state, action) => {
      const notificationId = action.payload;
      state.loading = false;
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== notificationId
      );
    });
    builder.addCase(clearNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// LIKE NOTIFICATION
    builder.addCase(clearAllNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clearAllNotifications.fulfilled, (state) => {
      state.loading = false;
      state.notifications = [];
    });
    builder.addCase(clearAllNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default postsSlice;
