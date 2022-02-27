import { useDispatch } from "Hooks";
import { likeComment } from "Store/data/comments";

export const useLikeComment = (): ((post_id: string, id: string) => void) => {
  const dispatch = useDispatch();

  function handler(post_id: string, id: string) {
    dispatch(likeComment(post_id, id));
  }

  return (post_id: string, id: string) => handler(post_id, id);
};
