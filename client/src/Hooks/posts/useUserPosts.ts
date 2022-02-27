import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import { getUserPosts, selectPostsByUser, ActionType } from "Store/data/posts";
import { useActivity } from "Hooks";
import { Post } from "Types";
import { ActivityError } from "Store/activities";

export const useUserPosts = (
  id: string
): [
  { data: Post[]; loading: boolean; error: ActivityError | null },
  (id: string) => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_POSTS_BY_USER);

  const data = useSelector((state) => selectPostsByUser(state.data.posts, id));

  function handler(id: string) {
    dispatch(getUserPosts(id));
  }

  return [{ data, loading, error }, handler];
};
