import { Button } from "flowbite-react";
import {
  FriendsContainer,
  FriendInfo,
  RoundImage,
} from "./FriendSuggestion.components";
import React from "react";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";

const FriendSuggestion = ({ onClick, sendRequest, to }) => {
  return (
    <FriendsContainer data-id={to._id} onClick={() => onClick(to._id)}>
      <img className="!w-16 !h-16 rounded-[32px] mr-2" src={to.profile_photo} />
      <FriendInfo>
        <h4>{to.display_name || to.first_name + " " + to.last_name}</h4>
        {
          <div>
            <Button
              onClick={() => sendRequest(to._id)}
              color="primary"
              className="w-100"
            >
              Send Friend Request
            </Button>
          </div>
        }
      </FriendInfo>
    </FriendsContainer>
  );
};

export default FriendSuggestion;
