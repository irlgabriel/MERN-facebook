import { Container, Row, Col, Button } from "reactstrap";
import {
  FriendsContainer,
  FriendInfo,
  RoundImage,
} from "./FriendSuggestion.components";
import React from "react";

const FriendSuggestion = ({ onClick, sendRequest, to }) => {
  return (
    <FriendsContainer data-id={to._id} onClick={() => onClick(to._id)}>
      <RoundImage src={to.profile_photo} />
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
