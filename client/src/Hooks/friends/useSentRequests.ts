import { useSelector } from "Hooks/utils";
import { selectSentRequests } from "Store/data/friend_requests";

export function useSentRequests(id: string) {
  return useSelector((state) =>
    selectSentRequests(state.data.friend_requests, id)
  );
}
