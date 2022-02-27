import { useDispatch } from "Hooks/utils";
import { sendRequest } from "Store/data/friend_requests";

export function useSendRequest() {
  const dispatch = useDispatch();
  //req_id
  return (id: string) => dispatch(sendRequest(id));
}
