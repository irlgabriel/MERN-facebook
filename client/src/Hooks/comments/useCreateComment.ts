import { useDispatch } from "Hooks";
import { createComment, CreateCommentInput } from "Store/data/comments";

export const useCreateComment = (): ((
  post_id: string,
  input: CreateCommentInput
) => void) => {
  const dispatch = useDispatch();

  function handler(post_id: string, input: CreateCommentInput) {
    dispatch(createComment(post_id, input));
  }

  return (post_id: string, input: CreateCommentInput) =>
    handler(post_id, input);
};
