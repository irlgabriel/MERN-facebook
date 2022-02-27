import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import { getUser, selectUser, ActionType } from "Store/data/users";
import { useActivity } from "Hooks";
import { User } from "Types";
import { ActivityError } from "Store/activities";

export const useUser = (
  id?: string
): [
  { data: User | null; loading: boolean; error: ActivityError | null },
  (id: string) => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_ONE);

  const data = useSelector((state) => selectUser(state.data.users, id));

  function handler(id: string) {
    dispatch(getUser(id));
  }

  return [{ data, loading, error }, handler];
};
