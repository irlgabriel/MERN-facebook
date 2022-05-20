import React from "react";
import {
  FriendsContainer,
  FriendInfo,
  RoundImage,
} from "./FriendSuggestion.components";
import { User } from "Types";

interface Props {
  onClick: (arg: string) => void;
  sendRequest: (arg: string) => void;
  to: User;
}

const FriendSuggestion = ({ onClick, sendRequest, to }: Props) => {
  return (
    <FriendsContainer data-id={to._id} onClick={() => onClick(to._id)}>
      <RoundImage src={to.profile_photo} />
      <FriendInfo>
        <h4>{to.display_name || to.first_name + " " + to.last_name}</h4>
        {
          <div>
            <button
              onClick={() => sendRequest(to._id)}
              className="primary-button w-100"
            >
              Send Friend Request
            </button>
          </div>
        }
      </FriendInfo>
    </FriendsContainer>
  );
};

export default FriendSuggestion;
