import { useDispatch } from "Hooks";
import { deletePost } from "Store/data/posts";

export const useRemovePost = (id: string) => {
  const dispatch = useDispatch();
  return () => dispatch(deletePost(id));
};
