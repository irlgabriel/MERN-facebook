import { CreateCommentRequestInput } from "./types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "../Api/helpers";
import { Comment, Post } from "../Types/types";
import { RootState } from "./store";

/**
 * ACTIONS
 */
export const getComments = createAsyncThunk(
  "comments/getComments",
  async (postId: string) => {
    const comments = (
      await axios.get<Comment[]>("/posts/" + postId + "/comments")
    ).data;
    return { comments, postId };
  }
);
export const getReplies = createAsyncThunk(
  "comments/getReplies",
  async ({ postId, commentId }: { postId: string; commentId: string }) => {
    const comments = (
      await axios.get<Comment[]>("/posts/" + postId + "/comments/" + commentId)
    ).data;
    console.log('in action',{comments})
    return comments;
  }
);
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (input: CreateCommentRequestInput) => {
    const comment = (
      await axios.post<Comment>("/posts/" + input.post_id + "/comments", {
        ...input,
      })
    ).data;
    return comment;
  }
);

/**
 * STATE
 */
const initialState: State = {
  comments: [],
  byPostId: {},
  byCommentId: {},
  loading: false,
  fetched: false,
  error: null,
};

/**
 * TYPES
 */
export interface State {
  comments: Comment[];
  byCommentId: Record<string, Comment>;
  byPostId: Record<string, string[]>;
  loading: boolean;
  fetched: boolean;
  error: string | null;
}

/**
 * SELECTORS
 */

export const selectComments = createSelector(
  (state: State, ids: string[]) => ids.map((id) => state.byCommentId[id]),
  (comments) => comments
);

///
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPosts: () => undefined,
  },
  extraReducers: (builder) => {
    /// GET REPLIES
    builder.addCase(getReplies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getReplies.fulfilled, (state, action) => {
      const comments = action.payload;
      state.loading = false;
      state.comments.push(...comments);
    });
    builder.addCase(getReplies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// CREATE COMMENT
    builder.addCase(createComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      const comment = action.payload;
      state.loading = false;
      state.comments.push(comment);
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// GET COMMENTS
    builder.addCase(getComments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      const { comments, postId } = action.payload;
      console.log('in reducer',{comments})
      state.loading = false;

      state.byPostId[postId] = comments.map((d) => d._id);
      comments.forEach((comment) => {
        state.byCommentId[comment._id] = comment;
      });
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export default postsSlice;
