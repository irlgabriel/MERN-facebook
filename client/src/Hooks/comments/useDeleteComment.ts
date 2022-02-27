import { useDispatch } from "Hooks";
import { deleteComment } from "Store/data/comments";

export const useDeleteComment = (): ((post_id: string, id: string) => void) => {
  const dispatch = useDispatch();

  function handler(post_id: string, id: string) {
    dispatch(deleteComment(post_id, id));
  }

  return (post_id: string, id: string) => handler(post_id, id);
};
