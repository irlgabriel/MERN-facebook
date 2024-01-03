import React, { useEffect, useState } from "react";
import {
  Wrapper,
  FriendsContainer,
  Friend,
  Image,
} from "./FriendsProfile.components";
import { User } from "../../Types/types";

const FriendsProfile = ({ user }) => {
  const [friends, setFriends] = useState<User[]>([]);

  return (
    <Wrapper>
      <FriendsContainer>
        {friends.map((friend) => (
          <Friend
            href={friend._id === user._id ? "/profile" : `/users/${friend._id}`}
          >
            <Image
              width="36px"
              height="36px"
              className="mr-2"
              src={friend.profile_photo}
            ></Image>
            <p style={{ width: "90%" }} className="mb-0">
              {friend.display_name ||
                friend.first_name + " " + friend.last_name}
            </p>
          </Friend>
        ))}
      </FriendsContainer>
    </Wrapper>
  );
};

export default FriendsProfile;
