import React from "react";
import {
  FriendsContainer,
  FriendInfo,
  RoundImage,
} from "./FriendRequest.components";
import { Button } from "reactstrap";
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
          <Button
            onClick={() => confirmFriend(id)}
            color="primary"
            className="mr-2 w-100"
          >
            Confirm
          </Button>
          <Button
            onClick={() => declineFriend(id)}
            className="w-100"
            color="secondary"
          >
            Delete
          </Button>
        </div>
      </FriendInfo>
    </FriendsContainer>
  );
};
export default FriendRequest;
