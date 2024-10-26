import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "../../Components";
// import { Profile } from "..";
import {
  LoadingOverlay,
  FriendSuggestion,
  FriendRequest,
} from "../../Components";
import Axios from "axios";
import { User } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import {
  acceptRequest,
  declineRequest,
  getRecommendations,
  getRequests,
  sendRequest,
} from "../../store/friendRequests";
import { fetchPosts } from "../../store/posts";
import { ProtectedRoute } from "../../Components/ProtectedRoute/ProtectedRoute";
import { IUser } from "../../../../server/models/users";
import { Profile } from "../users/[id]";

const Friends = () => {
  const dispatch = useAppDispatch();

  const [previewUser, setPreviewUser] = useState<IUser | undefined>(undefined);

  const user = useAppSelector((state) => state.auth.user) as IUser;
  const requests = useAppSelector((state) => state.friendRequests.requests);
  const suggestions = useAppSelector(
    (state) => state.friendRequests.suggestions
  );
  const loading = useAppSelector((state) => state.friendRequests.loading);

  const receivedRequests = useMemo(
    () => requests.filter((request) => request._id === user._id),
    [requests]
  );

  const clickHandler = (id: string) => {
    //e.stopPropagation();
    Axios.get(`/users/${id}`).then((res) => {
      setPreviewUser(res.data);
    });
  };

  /* Friend request logic functions */
  const sendFriendRequest = (userId: string) => {
    dispatch(sendRequest({ userId }));
  };

  const confirmFriend = (userId: string) => {
    //const _id = e.target.getAttribute('data-id');
    dispatch(acceptRequest({ userId }));
  };

  const declineFriend = (userId: string) => {
    declineRequest({ userId });
  };

  useEffect(() => {
    dispatch(getRequests());
    dispatch(getRecommendations());
    dispatch(fetchPosts());
  }, []);

  return (
    <div className="px-0 h-dvh w-full">
      {/* Loading overlay */}
      {loading && <LoadingOverlay />}
      <Navbar key="friends" />
      <div className="grid grid-rows-1 grid-flow-col gap-4 h-full">
        <div className="row-span-1 cols-span-1" style={{ background: "white" }}>
          <h2>Friends</h2>
          <h5>{receivedRequests.length} Friend Requests</h5>
          <hr className="my-1"></hr>
          {/* Friend Requests */}
          {receivedRequests.map((request) => (
            <FriendRequest
              onClick={clickHandler}
              _id={request._id}
              confirmFriend={confirmFriend}
              declineFriend={declineFriend}
              key={request._id}
              from={request.from}
            />
          ))}
          <h5>People you may know</h5>
          <hr className="my-1"></hr>
          {/* Friend Suggestions */}
          {suggestions.map((to) => (
            <FriendSuggestion
              onClick={clickHandler}
              sendRequest={sendFriendRequest}
              key={to._id}
              to={to}
            />
          ))}
        </div>
        <div className="row-span-1 col-span-5">
          {previewUser && <Profile userId={previewUser._id} showNav={false} />}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Friends);
