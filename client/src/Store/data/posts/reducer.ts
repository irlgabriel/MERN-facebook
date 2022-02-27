import produce from "immer";

import initialState from "./initialState";
import { Actions, State, ActionType } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.GET_ALL: {
      const { posts } = action.payload;
      return produce(state, (draft) => {
        draft.posts = posts;
        draft.posts.forEach((p) => {
          // index to users
          draft.byUser[p.user._id] = [...(draft.byUser[p.user._id] || []), p];
          // index by id
          draft.byId[p._id] = p;
        });
      });
    }

    case ActionType.GET_POST: {
      const { post } = action.payload;

      return produce(state, (draft) => {
        draft.byId[post._id] = post;
        draft.posts.push(post);
        draft.byUser[post.user._id] = [
          ...(draft.byUser[post.user._id] || []),
          post,
        ];
      });
    }

    case ActionType.EDIT_POST: {
      const { post } = action.payload;

      return produce(state, (draft) => {
        draft.byId[post._id] = post;
      });
    }

    case ActionType.DELETE_POST: {
      const { id } = action.payload;

      return produce(state, (draft) => {
        delete draft.byId[id];

        delete draft.byUser[id];
        draft.posts = draft.posts.filter((p) => p._id !== id);
      });
    }

    case ActionType.CREATE_POST: {
      const { post } = action.payload;

      return produce(state, (draft) => {
        draft.byId[post._id] = post;

        draft.byUser[post.user._id] = [
          ...(draft.byUser[post.user._id] || []),
          post,
        ];
      });
    }

    case ActionType.GET_POSTS_BY_USER: {
      const { posts, user_id: userId } = action.payload;
      return produce(state, (draft) => {
        draft.byUser[userId] = posts;
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
