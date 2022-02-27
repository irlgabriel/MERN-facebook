import { useDispatch } from "Hooks/utils";
import { declineRequest } from "Store/data/friend_requests";

export function useDeclineRequest() {
  const dispatch = useDispatch();
  //req_id
  return (id: string) => dispatch(declineRequest(id));
}
