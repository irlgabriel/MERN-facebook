import { useSelector } from "Hooks";
import { selectCurrentUser } from "Store/auth";
import { User } from "Types";

export const useCurrentUser = (): User | null => {
  return useSelector((state) => selectCurrentUser(state.auth));
};
