/**
 * CREATE
 */
export interface CreateCommentParams extends Record<string, any> {
  post_id: string;
}

export interface CreateCommentInput {
  content: string;
  comment: string;
}

/**
 * EDIT
 */
export interface EditCommentInput {
  content: string;
}

/**
 * LIKE
 */
export interface LikeCommentInput {
  comment_id: string;
  post_id: string;
}

/**
 * DELETE
 */
export interface DeleteCommmentParams {
  comment_id: string;
}
