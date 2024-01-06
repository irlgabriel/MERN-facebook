import { configureStore } from "@reduxjs/toolkit";
import authSlice, { State as AuthState } from "./auth";
import postsSlice, { State as PostsState } from "./posts";
import usersSlice, { State as UsersState } from "./users";
import commentsState, { State as CommentsState } from "./comments";
import friendRequestsState, {
  State as FriendRequestsState,
} from "./friendRequests";
import notificationsState, {
  State as NotificationsState,
} from "./notifications";

export interface State {
  posts: PostsState;
  comments: CommentsState;
  users: UsersState;
  auth: AuthState;
  friendRequests: FriendRequestsState;
  notifications: NotificationsState;
}

const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    users: usersSlice.reducer,
    auth: authSlice.reducer,
    comments: commentsState.reducer,
    friendRequests: friendRequestsState.reducer,
    notifications: notificationsState.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
