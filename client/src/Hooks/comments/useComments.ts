import { useDispatch, useSelector } from "Hooks";
import { getComments, selectCommentsByPost } from "Store/data/comments";
import { Comment } from "Types";

export const useComments = (
  post_id: string
): [{ data: Comment[] }, (post_id: string) => void] => {
  const dispatch = useDispatch();

  const data = useSelector((state) =>
    selectCommentsByPost(state.data.comments, post_id)
  );

  function handler(post_id: string) {
    dispatch(getComments(post_id));
  }

  return [{ data }, handler];
};
