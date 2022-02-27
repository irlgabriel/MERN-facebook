import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import { getUsers, selectUsers, ActionType } from "Store/data/users";
import { useActivity } from "Hooks";
import { User } from "Types";
import { ActivityError } from "Store/activities";

export const useUsers = (): [
  { data: User[]; loading: boolean; error: ActivityError | null },
  () => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_ALL);

  const data = useSelector((state) => selectUsers(state.data.users));

  function handler() {
    dispatch(getUsers());
  }

  return [{ data, loading, error }, handler];
};
