import { isLoggedIn, selectUser, ActionType } from "Store/auth";
import { useActivity } from "Hooks/activities";
import { useSelector } from "Hooks/utils";
import { useDispatch } from "react-redux";
import { User } from "Types";
import { ActivityError } from "Store/activities";

export function useCheckLogin(): [
  { data: User | null; loading: boolean; error: ActivityError | null },
  () => void
] {
  const dispatch = useDispatch();

  const data = useSelector((state) => selectUser(state.auth));

  const [{ loading, error }] = useActivity(ActionType.IS_LOGGED_IN);

  const handler = () => {
    dispatch(isLoggedIn());
  };

  return [{ data, loading, error }, handler];
}
