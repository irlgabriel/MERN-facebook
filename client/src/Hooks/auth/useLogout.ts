import { logout } from "Store/auth";
import { useDispatch } from "Hooks/utils";

export function useLogout() {
  const dispatch = useDispatch();
  return () => {
    dispatch(logout());
  };
}
