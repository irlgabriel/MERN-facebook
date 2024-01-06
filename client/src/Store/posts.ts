import { PaginationOptions, GetUserPostsRequestInput } from "./types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "../helpers/network";
import { isUser } from "../Types/types";
import { RootState } from "./store";
import { IPost } from "../../../server/models/posts";

/**
 * ACTIONS
 */
export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ content, image }: { content: string; image: any }) => {
    const post = (await axios.post<IPost>("/posts", { content, image })).data;
    return post;
  }
);
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: string) => {
    const post = (await axios.post<IPost>("/posts/" + postId + "/like")).data;
    return post;
  }
);
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string) => {
    const post = (await axios.delete<IPost>("/posts/" + postId)).data;
    return post;
  }
);
export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ content, image }: Partial<{ content: string; image: any }>) => {
    const post = (await axios.post<IPost>("/posts", { content, image })).data;
    return post;
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (postId: string) => {
    const post = (await axios.post<IPost>("/post", { post_id: postId })).data;
    return post;
  }
);

export const fetchPosts = createAsyncThunk<IPost[], void, { state: RootState }>(
  "posts/fetchPosts",
  async (_: void, { getState }) => {
    const { pageSize, offset } = getState().posts.pageOpts;
    const posts = (
      await axios.get<IPost[]>("/posts", {
        params: { pageSize, offset },
      })
    ).data;
    return posts;
  }
);

export const fetchUserPosts = createAsyncThunk<
  IPost[],
  GetUserPostsRequestInput,
  { state: RootState }
>(
  "posts/fetchUserPosts",
  async ({ userId }: GetUserPostsRequestInput, { getState }) => {
    const { pageSize, offset } = getState().posts.pageOpts;
    const posts = (
      await axios.get<IPost[]>("/posts/user", {
        params: { pageSize, offset, userId },
      })
    ).data;
    return posts;
  }
);

/**
 * STATE
 */
const initialState: State = {
  ids: [],
  byId: {},
  idsByUserId: {},
  loading: false,
  fetched: false,
  pageOpts: {
    pageSize: 10,
    offset: 0,
  },
  error: null,
  hasMoreData: true,
};
/**
 * SELECTORS
 */
const selectPostsMap = (state: State) => state.byId;
const selectPostIds = (state: State) => state.ids;
const selectUserIdToPostIdsMap = (state: State) => state.idsByUserId;
const selectUserId = (_: State, userId: string) => userId;
const selectPostId = (_: State, postId: string) => postId;

export const selectPostById = createSelector(
  [selectPostsMap, selectPostId],
  (posts, id) => posts[id]
);

export const selectPostsByUser = createSelector(
  [selectPostsMap, selectUserIdToPostIdsMap, selectUserId],
  (posts, usersPostIds, userId) => {
    if (!usersPostIds[userId]) return [];
    return usersPostIds[userId].map((id) => posts[id]);
  }
);

export const selectAllPosts = createSelector(
  [selectPostsMap, selectPostIds],
  (postsMap, ids) => ids.map((id) => postsMap[id])
);

/**
 * TYPES
 */
export interface State {
  ids: string[];
  byId: Record<string, IPost>;
  idsByUserId: Record<string, string[]>;
  loading: boolean;
  fetched: boolean;
  error: string | null;
  pageOpts: PaginationOptions;
  hasMoreData: boolean;
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPosts: () => undefined,
  },
  extraReducers: (builder) => {
    /// GET POSTS
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      const posts = action.payload;
      state.loading = false;
      posts.forEach((post) => {
        let userId: string | null = null;
        if (isUser(post.user)) {
          userId = post.user._id;
        } else {
          userId = post!.user!.toString();
        }
        if (!userId) return;

        state.ids.push(post._id);
        state.byId[post._id] = post;
        if (!state.idsByUserId[userId]) {
          state.idsByUserId[userId] = [];
        }
        state.idsByUserId[userId].push(post._id);
      });
      state.fetched = true;
      if (posts.length) {
        state.pageOpts.offset += posts.length;
      } else {
        state.hasMoreData = false;
      }
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// GET POST
    builder.addCase(fetchPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      const post = action.payload;
      state.loading = false;
      let userId: string | null = null;
      if (isUser(post.user)) {
        userId = post.user._id;
      } else {
        userId = post.user!.toString();
      }
      if (!userId) return;

      state.ids.push(post._id);
      state.byId[post._id] = post;
      if (!state.idsByUserId[userId]) {
        state.idsByUserId[userId] = [];
      }
      state.idsByUserId[userId].push(post._id);
    });
    builder.addCase(fetchPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// ADD POST
    builder.addCase(addPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addPost.fulfilled, (state, action) => {
      const post = action.payload;
      state.loading = false;
      let userId: string | null = null;
      if (isUser(post.user)) {
        userId = post.user._id;
      } else {
        userId = post.user!.toString();
      }
      if (!userId) return;

      state.ids.unshift(post._id);
      state.byId[post._id] = post;
      if (!state.idsByUserId[userId]) {
        state.idsByUserId[userId] = [];
      }
      state.idsByUserId[userId].unshift(post._id);
    });
    builder.addCase(addPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// EDIT POST
    builder.addCase(editPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editPost.fulfilled, (state, action) => {
      const post = action.payload;
      state.loading = false;
      state.byId[post._id] = post;
    });
    builder.addCase(editPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// DELETE POST
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const post = action.payload;
      state.loading = false;
      delete state.byId[post._id];
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// LIKE POST
    builder.addCase(likePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(likePost.fulfilled, (state, action) => {
      const post = action.payload;
      state.loading = false;
      state.byId[post._id] = post;
    });
    builder.addCase(likePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// GET USER POSTS
    builder.addCase(fetchUserPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserPosts.fulfilled, (state, action) => {
      const posts = action.payload;
      state.loading = false;
      posts.forEach((post) => {
        let userId: string | null = null;
        if (isUser(post.user)) {
          userId = post.user._id;
        } else {
          userId = post.user!.toString();
        }
        if (!userId) return;

        state.ids.push(post._id);
        state.byId[post._id] = post;
        if (!state.idsByUserId[userId]) {
          state.idsByUserId[userId] = [];
        }
        state.idsByUserId[userId].push(post._id);
      });
      state.fetched = true;
      if (posts.length) {
        state.pageOpts.offset += posts.length;
      } else {
        state.hasMoreData = false;
      }
    });
    builder.addCase(fetchUserPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default postsSlice;
