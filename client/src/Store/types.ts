// PAGINATION
export interface PaginationOptions {
  pageSize: number;
  offset: number;
}

// GENERICS
export type UserIdRequestInput = {
  userId: string;
};

// POSTS
export type GetUserPostsRequestInput = { userId: string };

// COMMENTS
export type CreateCommentRequestInput = Partial<{
  comment: string;
  post_id: string;
}> & { data: FormData };

export type DeleteCommentRequestInput = {
  parentCommentId?: string;
  commentId: string;
  postId: string;
};

// FRIEND REQUESTS
