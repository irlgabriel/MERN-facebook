import { useDispatch } from "Hooks";
import { editComment, CreateCommentInput } from "Store/data/comments";

export const useEditComment = (): ((
  post_id: string,
  id: string,
  input: CreateCommentInput
) => void) => {
  const dispatch = useDispatch();

  function handler(post_id: string, id: string, input: CreateCommentInput) {
    dispatch(editComment(post_id, id, input));
  }

  return (post_id: string, id: string, input: CreateCommentInput) =>
    handler(post_id, id, input);
};
