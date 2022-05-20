import React from "react";
import {
  FriendsContainer,
  FriendInfo,
  RoundImage,
} from "./FriendRequest.components";
import { useFriendRequest, useDeclineRequest, useConfirmRequest } from "Hooks";

interface Props {
  onClick: (user: string) => void;
  id: string;
}

const FriendRequest = ({ onClick, id }: Props) => {
  const request = useFriendRequest(id);
  const declineFriend = useDeclineRequest();
  const confirmFriend = useConfirmRequest();

  if (!request) return null;

  const { from } = request;

  return (
    <FriendsContainer onClick={() => onClick(from._id)} data-id={from._id}>
      <RoundImage src={from.profile_photo} />
      <FriendInfo>
        <h4>{from.display_name || from.first_name + " " + from.last_name}</h4>
        <div className="d-flex w-100 align-items-center">
          <button
            onClick={() => confirmFriend(id)}
            className="primary-button mr-2 w-100"
          >
            Confirm
          </button>
          <button
            onClick={() => declineFriend(id)}
            className="w-100 secondary-button"
          >
            Delete
          </button>
        </div>
      </FriendInfo>
    </FriendsContainer>
  );
};
export default FriendRequest;
