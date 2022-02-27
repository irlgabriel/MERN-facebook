import { login, LoginCredentials, selectUser, ActionType } from "Store/auth";
import { useActivity } from "Hooks/activities";
import { useSelector, useDispatch } from "Hooks/utils";
import { User } from "Types";
import { ActivityError } from "Store/activities";

export function useLogin(): [
  { data: User | null; loading: boolean; error: ActivityError | null },
  ({ email, password }: LoginCredentials) => void
] {
  const dispatch = useDispatch();

  const data = useSelector((state) => selectUser(state.auth));

  const [{ loading, error }] = useActivity(ActionType.LOGIN);

  const handler = ({ email, password }: LoginCredentials) => {
    dispatch(login({ email, password }));
  };

  return [{ data, loading, error }, handler];
}
