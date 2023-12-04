export interface PaginationOptions {
  pageSize: number;
  offset: number;
}

export type GetPostsRequestInput = PaginationOptions;

export type CreateCommentRequestInput = Partial<{
  comment: string;
  post_id: string;
}> & { content: string };
