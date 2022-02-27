import { likePost } from "Store/data/posts";
import { useDispatch } from "Hooks";

export function useLikePost(id: string) {
  const dispatch = useDispatch();
  return () => dispatch(likePost(id));
}
