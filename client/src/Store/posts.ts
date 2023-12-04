import { GetPostsRequestInput, PaginationOptions } from "./types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { Post } from "../Types/types";
import { RootState } from "./store";

/**
 * ACTIONS
 */
export const addPost = createAsyncThunk(
  "posts/addPost",
  async ({ content, image }: { content: string; image: any }) => {
    const post = (await Axios.post<Post>("/posts", { content, image })).data;
    return post;
  }
);
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: string) => {
    const post = (await Axios.post<Post>("/posts/" + postId + "/like")).data;
    return post;
  }
);
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string) => {
    const post = (await Axios.post<Post>("/posts", { post_id: postId })).data;
    return post;
  }
);
export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ content, image }: Partial<{ content: string; image: any }>) => {
    const post = (await Axios.post<Post>("/posts", { content, image })).data;
    return post;
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (postId: string) => {
    const post = (await Axios.post<Post>("/post", { post_id: postId })).data;
    return post;
  }
);

export const fetchPosts = createAsyncThunk<any, any, { state: RootState }>(
  "posts/fetchPosts",
  async (_: void, { getState }) => {
    const { pageSize, offset } = getState().posts.pageOpts;
    const posts = (
      await Axios.get<Post[]>("/posts", { params: { pageSize, offset } })
    ).data;
    console.log({ posts });
    return posts;
  }
);

/**
 * STATE
 */
const initialState: State = {
  posts: [],
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
 * TYPES
 */
export interface State {
  posts: Post[];
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
      state.posts.push(...posts);
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
      state.posts.push(post);
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
      state.posts.push(post);
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
      state.posts = state.posts.map((d) => (d._id !== post._id ? d : post));
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
      state.posts = state.posts.filter((d) => d._id !== post._id);
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
      state.posts = state.posts.map((d) => (d._id !== post._id ? d : post));
    });
    builder.addCase(likePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default postsSlice;
