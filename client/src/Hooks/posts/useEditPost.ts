import {
  editPost,
  selectPost,
  CreatePostInput,
  ActionType,
} from "Store/data/posts";
import { Post } from "Types";
import { useActivity, useSelector, useDispatch } from "Hooks";
import { ActivityError } from "Store/activities";

export const useEditPost = (
  id?: string
): [
  { data: Post | null; loading: boolean; error: ActivityError | null },
  ({ id, post }: { id: string; post: CreatePostInput }) => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.EDIT_POST);

  const data = useSelector((state) => selectPost(state.data.posts, id));

  const handler = ({ id, post }: { id: string; post: CreatePostInput }) => {
    dispatch(editPost({ id, post }));
  };

  return [{ data, loading, error }, handler];
};
