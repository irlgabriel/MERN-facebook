import { combineReducers } from "redux";

import {
  initialState as initialPostsState,
  State as Posts,
  reducer as posts,
  Actions as PostActions,
} from "./data/posts";

import {
  initialState as initialCommentsState,
  State as Comments,
  reducer as comments,
  Actions as CommentActions,
} from "./data/comments";

import {
  initialState as initialNotificationsState,
  State as Notifications,
  reducer as notifications,
  Actions as NotificationActions,
} from "./data/notifications";

import {
  initialState as initialUsersState,
  State as Users,
  reducer as users,
  Actions as UserActions,
} from "./data/users";

import {
  initialState as initialFriendRequestsState,
  State as FriendRequests,
  reducer as friend_requests,
  Actions as FriendActions,
} from "./data/friend_requests";

import {
  initialState as initialAuthState,
  State as Auth,
  reducer as auth,
  Actions as AuthActions,
  ActionType as AuthActionType,
} from "./auth";

import {
  initialState as initialActivitiesState,
  State as Activities,
  reducer as activities,
  Actions as ActivitiesActions,
} from "./activities";

export interface ApplicationState {
  auth: Auth;
  data: {
    posts: Posts;
    comments: Comments;
    notifications: Notifications;
    users: Users;
    friend_requests: FriendRequests;
  };
  ui: {
    activities: Activities;
  };
}

export type ApplicationActions =
  | PostActions
  | AuthActions
  | CommentActions
  | NotificationActions
  | ActivitiesActions
  | UserActions
  | FriendActions;

const appReducer = combineReducers<ApplicationState>({
  auth,
  data: combineReducers({
    friend_requests,
    users,
    comments,
    posts,
    notifications,
  }),
  ui: combineReducers({ activities }),
});

const rootReducer = (
  state: ApplicationState | undefined,
  action: ApplicationActions
) => {
  function resetState() {
    if (state) {
      state.auth = initialAuthState;
      state.data.posts = initialPostsState;
      state.data.comments = initialCommentsState;
      state.data.users = initialUsersState;
      state.data.friend_requests = initialFriendRequestsState;
      state.data.notifications = initialNotificationsState;
      state.ui.activities = initialActivitiesState;
    }
  }

  if (state) {
    if (action.type === AuthActionType.LOGOUT) {
      resetState();
    }
  }

  return appReducer(state, action);
};

export default rootReducer;
