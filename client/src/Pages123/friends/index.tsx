import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "../../Components";
import { Container, Row, Col, Button } from "reactstrap";
// import { Profile } from "..";
import {
  LoadingOverlay,
  FriendSuggestion,
  FriendRequest,
} from "../../Components";
import Axios from "axios";
import { User } from "../../Types/types";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import {
  acceptRequest,
  declineRequest,
  getRecommendations,
  getRequests,
  sendRequest,
} from "../../Store/friendRequests";
import { fetchPosts } from "../../Store/posts";
import { ProtectedRoute } from "../../Components/ProtectedRoute/ProtectedRoute";
import { IUser } from "../../../../server/models/users";
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
    <Container fluid className="px-0">
      {/* Loading overlay */}
      {loading && <LoadingOverlay />}
      <Navbar key="friends" />
      <Row className="p-0 m-0" style={{ height: "auto" }}>
        <Col
          id="friends-col"
          className="d-none d-md-block box-shadow-right p-0 px-2"
          md="4"
          lg="3"
          style={{ background: "white" }}
        >
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
        </Col>
        {/* <Col id="friends-profile" className="p-0">
          {previewUser && <Profile showNav={false} />}
        </Col> */}
      </Row>
    </Container>
  );
};

export default ProtectedRoute(Friends);
