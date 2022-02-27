import { deleteAccount } from "Store/auth";
import { useDispatch } from "Hooks/utils";

export function useDeleteAccount() {
  const dispatch = useDispatch();

  return () => dispatch(deleteAccount());
}
