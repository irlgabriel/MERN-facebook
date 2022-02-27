import { useDispatch, useSelector } from "Hooks";
import { getReplies, selectCommentsByComment } from "Store/data/comments";
import { Comment } from "Types";

export const useReplies = (
  comment_id: string
): [{ data: Comment[] }, (comment_id: string) => void] => {
  const dispatch = useDispatch();

  const data = useSelector((state) =>
    selectCommentsByComment(state.data.comments, comment_id)
  );

  function handler() {
    dispatch(getReplies(comment_id));
  }

  return [{ data }, handler];
};
