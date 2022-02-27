import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import { getPosts, selectPosts, ActionType } from "Store/data/posts";
import { useActivity } from "Hooks";
import { Post } from "Types";
import { ActivityError } from "Store/activities";

export const usePosts = (): [
  { data: Post[]; loading: boolean; error: ActivityError | null },
  () => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_ALL);

  const data = useSelector((state) => selectPosts(state.data.posts));

  function handler() {
    dispatch(getPosts());
  }

  return [{ data, loading, error }, handler];
};
