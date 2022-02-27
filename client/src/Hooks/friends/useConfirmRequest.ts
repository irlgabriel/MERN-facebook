import { useDispatch } from "Hooks/utils";
import { confirmRequest } from "Store/data/friend_requests";

export function useConfirmRequest() {
  const dispatch = useDispatch();
  //req_id
  return (id: string) => dispatch(confirmRequest(id));
}
