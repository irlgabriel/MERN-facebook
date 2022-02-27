import { useSelector } from "Hooks/utils";
import { selectReceivedRequests } from "Store/data/friend_requests";

export function useReceivedRequests(id: string) {
  return useSelector((state) =>
    selectReceivedRequests(state.data.friend_requests, id)
  );
}
