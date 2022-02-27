import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import { getPost, selectPost, ActionType } from "Store/data/posts";
import { useActivity } from "Hooks";
import { Post } from "Types";
import { ActivityError } from "Store/activities";

export const useGetPost = (
  id?: string
): [
  { data: Post | null; loading: boolean; error: ActivityError | null },
  (id: string) => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_ALL);

  const data = useSelector((state) => selectPost(state.data.posts, id));

  function handler(id: string) {
    dispatch(getPost(id));
  }

  return [{ data, loading, error }, handler];
};
