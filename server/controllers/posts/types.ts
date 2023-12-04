type PaginationOptions = {
  pageSize: number;
  offset: number;
};

export interface GetPostsRequestInput extends PaginationOptions {}
