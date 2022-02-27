import { useSelector } from "Hooks";
import { selectFriendRequest } from "Store/data/friend_requests";

export const useFriendRequest = (id: string) => {
  return useSelector((state) =>
    selectFriendRequest(state.data.friend_requests, id)
  );
};
