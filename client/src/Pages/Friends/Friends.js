import { useState, useEffect } from "react";
import { Navbar } from "../../Components";
import { Container, Row, Col, Button } from "reactstrap";
import { Profile } from "../../Pages/";
import {
  FriendRequest,
  LoadingOverlay,
  FriendSuggestion,
} from "../../Components";
import Axios from "axios";

const Friends = ({ reloadUser, user, setUser }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [previewUserPosts, setPreviewUserPosts] = useState([]);
  const [previewUser, setPreviewUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const config = localStorage.getItem("token") && {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };

  const clickHandler = (id) => {
    //e.stopPropagation();
    Axios.get(`/users/${id}`).then((res) => {
      setPreviewUser(res.data);
    });
  };

  /* Friend request logic functions */
  const sendRequest = (to) => {
    //const to = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${to}/send`, {}, config).then((res) => {
      setSuggestions(
        suggestions.filter((suggestion) => suggestion._id !== res.data.to._id)
      );
      setRequests([...requests, res.data]);
    });
  };

  const confirmFriend = (_id) => {
    //const _id = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${_id}/accept`).then((res) => {
      setRequests(requests.filter((request) => request._id !== res.data._id));
      reloadUser();
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
      Axios.get("/friend_requests/recommendations", config),
      Axios.get("/friend_requests", config),
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
        posts.filter((post) => post.user._id === previewUser._id)
      );
    }
  }, [previewUser]);

  // filter sent and received requests whenever the requests array changes
  useEffect(() => {
    setSentRequests(
      requests.filter((request) => request.from._id === user._id)
    );
    setReceivedRequests(
      requests.filter((request) => request.to._id === user._id)
    );
  }, [requests]);

  return (
    <Container fluid className="px-0">
      {/* Loading overlay */}
      {loading && <LoadingOverlay />}
      <Navbar
        key="friends"
        setUser={setUser}
        reloadUser={reloadUser}
        user={user}
      />
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
          {previewUser && (
            <Profile
              showNav={false}
              user={user}
              posts={previewUserPosts}
              setPosts={setPreviewUserPosts}
              profileUser={previewUser}
              requests={requests}
              setRequests={setRequests}
              reloadUser={reloadUser}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Friends;
