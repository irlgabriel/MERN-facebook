import React, { useState, useEffect } from "react";
import { Navbar } from "../../Components";
import { Container, Row, Col } from "reactstrap";
import { Profile } from "..";
import {
  FriendRequest,
  LoadingOverlay,
  FriendSuggestion,
} from "../../Components";
import Axios from "axios";
import { User, FriendRequest as IFriendRequest, Post } from "Types";
import {
  useLogin,
  useFriendRequests,
  useFriendSuggestions,
  useConfirmRequest,
  useDeclineRequest,
  useSendRequest,
  useReceivedRequests,
  useSentRequests,
  useCurrentUser,
} from "Hooks";

const Friends = () => {
  const [{ data: user }] = useLogin();
  const [{ data: requests, loading: loadingRequests }, getFriendRequests] =
    useFriendRequests();
  const [
    { data: suggestions, loading: loadingSuggestions },
    getFriendSuggestions,
  ] = useFriendSuggestions();
  //@ts-ignore cant be null!
  const sentRequests = useSentRequests(user._id);
  //@ts-ignore cant be null!
  const receivedRequests = useReceivedRequests(user._id);

  const sendRequest = useSendRequest();
  const confirmRequest = useConfirmRequest();
  const declineRequest = useDeclineRequest();

  const [loading, setLoading] = useState(loadingRequests || loadingSuggestions);

  const [posts, setPosts] = useState<Post[]>([]);
  const [previewUserPosts, setPreviewUserPosts] = useState<Post[]>([]);
  const [previewUser, setPreviewUser] = useState<User | null>(null);

  const clickHandler = (id: string) => {
    //e.stopPropagation();
    Axios.get(`/users/${id}`).then((res) => {
      setPreviewUser(res.data);
    });
  };

  // /* Friend request logic functions */
  // const sendRequest = (to: string) => {
  //   //const to = e.target.getAttribute('data-id');
  //   Axios.post(`/friend_requests/${to}/send`, {}, config).then((res) => {
  //     setSuggestions(
  //       suggestions.filter((suggestion) => suggestion._id !== res.data.to._id)
  //     );
  //     setRequests([...requests, res.data]);
  //   });
  // };

  // const confirmFriend = (_id: string) => {
  //   //const _id = e.target.getAttribute('data-id');
  //   Axios.post(`/friend_requests/${_id}/accept`).then((res) => {
  //     setRequests(requests.filter((request) => request._id !== res.data._id));
  //     reloadUser();
  //   });
  // };

  // const declineFriend = (_id: string) => {
  //   //const _id = e.target.getAttribute('data-id');
  //   Axios.post(`/friend_requests/${_id}/decline`).then((res) => {
  //     setRequests(requests.filter((request) => request._id !== res.data._id));
  //   });
  // };

  useEffect(() => {
    getFriendRequests();
    getFriendSuggestions();
  }, []);

  // when previewUser changes we change the posts to match theirs
  useEffect(() => {
    if (previewUser) {
      setPreviewUserPosts(
        posts.filter((post) => post.user._id === previewUser._id)
      );
    }
  }, [previewUser]);

  return (
    <Container fluid className="px-0">
      {/* Loading overlay */}
      {loading && <LoadingOverlay />}
      <Navbar />
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
              id={request._id}
              key={request._id}
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
              //@ts-ignore
              to={to}
            />
          ))}
        </Col>
        <Col id="friends-profile" className="p-0">
          {previewUser && (
            <Profile previewUser={previewUser._id} showNav={false} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Friends;
