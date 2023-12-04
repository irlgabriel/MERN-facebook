import React, { useState, useEffect } from "react";
import { Navbar } from "../../Components";
import { Container, Row, Col, Button } from "reactstrap";
import { Profile } from "..";
import {
  LoadingOverlay,
  FriendSuggestion,
  FriendRequest,
} from "../../Components";
import Axios from "axios";
import {
  Post,
  User,
  FriendRequest as FriendRequestType,
} from "../../Types/types";
import { useAppSelector } from "../../Hooks/utils";

const Friends = () => {
  const user = useAppSelector((state) => state.auth.user) as User;

  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequestType[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [previewUserPosts, setPreviewUserPosts] = useState<Post[]>([]);
  const [previewUser, setPreviewUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestType[]>(
    []
  );

  const clickHandler = (id: string) => {
    //e.stopPropagation();
    Axios.get(`/users/${id}`).then((res) => {
      setPreviewUser(res.data);
    });
  };

  /* Friend request logic functions */
  const sendRequest = (to) => {
    //const to = e.target.getAttribute('data-id');
    Axios.post<FriendRequestType>(`/friend_requests/${to}/send`, {}).then(
      (res) => {
        setSuggestions(
          //@ts-ignore
          suggestions.filter((suggestion) => suggestion._id !== res.data.to._id)
        );
        setRequests([...requests, res.data]);
      }
    );
  };

  const confirmFriend = (_id) => {
    //const _id = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${_id}/accept`).then((res) => {
      setRequests(requests.filter((request) => request._id !== res.data._id));
    });
  };

  const declineFriend = (_id) => {
    //const _id = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${_id}/decline`).then((res) => {
      setRequests(requests.filter((request) => request._id !== res.data._id));
    });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      Axios.get("/friend_requests/recommendations"),
      Axios.get("/friend_requests"),
      Axios.get("/posts"),
    ]).then((results) => {
      setSuggestions(results[0].data);
      setRequests(results[1].data);
      setPosts(results[2].data);
      setLoading(false);
    });
  }, []);

  // when previewUser changes we change the posts to match theirs
  useEffect(() => {
    if (previewUser) {
      setPreviewUserPosts(
        //@ts-ignore
        posts.filter((post) => post.user._id === previewUser._id)
      );
    }
  }, [previewUser]);

  // filter sent and received requests whenever the requests array changes
  useEffect(() => {
    setReceivedRequests(
      //@ts-ignore
      requests.filter((request) => request.to._id === user._id)
    );
  }, [requests]);

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
              sendRequest={sendRequest}
              key={to._id}
              to={to}
            />
          ))}
        </Col>
        <Col id="friends-profile" className="p-0">
          {previewUser && <Profile showNav={false} profileUser={previewUser} />}
        </Col>
      </Row>
    </Container>
  );
};

export default Friends;
