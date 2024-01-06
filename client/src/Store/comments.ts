import { IComment } from "./../../../server/models/comments";
import axios from "../helpers/network";
import { CreateCommentRequestInput, DeleteCommentRequestInput } from "./types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { fetchPost, fetchPosts } from "./posts";
import { isComment } from "../Types/types";

/**
 * ACTIONS
 */
export const getComments = createAsyncThunk(
  "comments/getComments",
  async (postId: string) => {
    const comments = (
      await axios.get<IComment[]>("/posts/" + postId + "/comments")
    ).data;
    return { comments, postId };
  }
);
export const getReplies = createAsyncThunk(
  "comments/getReplies",
  async ({ postId, commentId }: { postId: string; commentId: string }) => {
    const comments = (
      await axios.get<IComment[]>("/posts/" + postId + "/comments/" + commentId)
    ).data;
    return comments;
  }
);
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (input: CreateCommentRequestInput) => {
    const comment = (
      await axios.post<IComment>("/posts/" + input.post_id + "/comments", {
        ...input,
      })
    ).data;
    return comment;
  }
);

export const editComment = createAsyncThunk(
  "comments/editComment",
  async (input: CreateCommentRequestInput) => {
    const comment = (
      await axios.put<IComment>(
        "/posts/" + input.post_id + "/comments" + input.comment,
        {
          ...input,
        }
      )
    ).data;

    return comment;
  }
);

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({ postId, commentId }: DeleteCommentRequestInput) => {
    const comment = (
      await axios.post<IComment>(`/posts/${postId}/comments/${commentId}`)
    ).data;

    return { commentId, postId, comment };
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({
    commentId,
    postId,
    parentCommentId = undefined,
  }: DeleteCommentRequestInput) => {
    await axios.delete(`/posts/${postId}/comments/${commentId}`);

    return { commentId, postId, parentCommentId };
  }
);

/**
 * STATE
 */
const initialState: State = {
  ids: [],
  idsByPost: {},
  idsByComment: {},
  byId: {},
  loading: false,
  fetched: false,
  error: null,
};

/**
 * TYPES
 */
export interface State {
  ids: string[];
  byId: Record<string, IComment>;
  idsByPost: Record<string, string[]>;
  idsByComment: Record<string, string[]>;
  loading: boolean;
  fetched: boolean;
  error: string | null;
}

/**
 * SELECTORS
 */

const getStoreCommentsMap = (state: State) => state.byId;
const getCommentToCommentIdsMap = (state: State) => state.idsByComment;
const getPostToCommentIdsMap = (state: State) => state.idsByPost;
const getCommentId = (_: State, commentId: string) => commentId;
const getPostId = (_: State, postId: string) => postId;

export const selectReplies = createSelector(
  [getStoreCommentsMap, getCommentToCommentIdsMap, getCommentId],
  (commentsMap, idsByComment, id) => {
    if (!idsByComment[id]) return [];
    return idsByComment[id].map((id) => commentsMap[id]);
  }
);

export const selectCommentsByPost = createSelector(
  [getStoreCommentsMap, getPostToCommentIdsMap, getPostId],
  (commentsMap, postToCommentIdsMap, postId) => {
    if (!postToCommentIdsMap[postId]) return [];
    return postToCommentIdsMap[postId].map((id) => commentsMap[id]);
  }
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
    /// GET REPLIES
    builder.addCase(getReplies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getReplies.fulfilled, (state, action) => {
      const comments = action.payload;
      state.loading = false;
      comments.forEach((comment) => {
        state.ids.push(comment._id);

        if (!state.idsByPost[comment._id]) {
          state.idsByPost[comment._id] = [];
        }
        state.idsByPost[comment._id].push(comment._id);

        // is reply
        if (comment.comment) {
          const parentCommentId = (
            isComment(comment.comment) ? comment.comment._id : comment.comment
          ).toString();

          if (!state.idsByComment[parentCommentId]) {
            state.idsByComment[parentCommentId] = [];
          }
          state.idsByComment[parentCommentId].push(comment._id);
        }
      });
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
      state.byId[comment._id] = comment;
      state.idsByPost[comment!.post!.toString()];
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
      state.loading = false;

      state.idsByPost[postId] = comments.map((d) => d._id);
      comments.forEach((comment) => {
        state.byId[comment._id] = comment;
        state.idsByComment[comment._id] = [];
      });
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// DELETE COMMENT
    builder.addCase(deleteComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const { commentId, postId } = action.payload;
      state.loading = false;

      state.ids = state.ids.filter((id) => id !== commentId);
      state.idsByPost[postId] = state.idsByPost[postId].filter(
        (id) => id !== commentId
      );
      state.idsByComment[postId] = state.idsByComment[postId].filter(
        (id) => id !== commentId
      );
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// LIKE COMMENT
    builder.addCase(likeComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(likeComment.fulfilled, (state, action) => {
      const { comment } = action.payload;
      state.loading = false;

      state.byId[comment._id] = comment;
    });
    builder.addCase(likeComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
    /// LIKE COMMENT
    builder.addCase(editComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editComment.fulfilled, (state, action) => {
      const comment = action.payload;
      state.loading = false;

      state.byId[comment._id] = comment;
    });
    builder.addCase(editComment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });

    /**
     * extra
     */
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      const post = action.payload;

      state.idsByPost[post._id] = [];
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      const posts = action.payload;

      posts.forEach(({ _id }) => {
        state.idsByPost[_id] = [];
      });
    });
  },
});

export default postsSlice;
