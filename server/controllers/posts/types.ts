type PaginationOptions = {
  userId: string;
  pageSize: number;
  offset: number;
};

export interface GetPostsRequestInput extends PaginationOptions {}
