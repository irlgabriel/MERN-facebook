import { Container, Col, Button } from "reactstrap";
import { Navbar } from "../../Components";
import {
  CoverPhoto,
  ProfilePhoto,
  ProfilePhotoWrapper,
  ProfileSection,
  ProfileHeader,
  ProfileNav,
  NavItem,
  Main,
  DefaultCoverPhoto,
  ChangeProfilePhoto,
  GrayHoverDiv,
  FlexDivGray,
  Option,
  CollapseDiv,
  WhiteContainer,
  Description,
} from "./Profile.components";
import {
  Post,
  PostForm,
  ImageForm,
  FriendsProfile,
  LoadingOverlay,
} from "../../Components";
import { Photos } from "../../Pages";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import Axios from "axios";
import { FaCheck } from "react-icons/fa";
import async from "async";
import { useParams } from "react-router-dom";

const Profile = ({
  profileUser = undefined,
  showNav = true,
  user,
  reloadUser,
  users,
  setUser,
}) => {
  const { user_id } = useParams();

  const [subPage, setSubPage] = useState("main");
  const [currentUser, setCurrentUser] = useState(profileUser || user);
  const [requests, setRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [coverPhotoForm, setCoverPhotoForm] = useState(false);
  const [profilePhotoForm, setProfilePhotoForm] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  // Friendship status state
  const [sameUser, setSameUser] = useState(false);
  const [isFriends, setIsFriends] = useState(false);
  const [sentRequest, setSentRequest] = useState(undefined);
  const [receivedRequest, setReceivedRequest] = useState(undefined);

  const config = localStorage.getItem("token") && {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };

  /* Friend request logic functions */
  const sendRequest = (to) => {
    //const to = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${to}/send`, {}, config).then((res) => {
      setRequests([...requests, res.data]);
      setSentRequest(res.data._id);
    });
  };

  const checkIsFriend = () => {
    const userFriendsIDs = user.friends.map((friend) => friend._id);
    return userFriendsIDs.includes(currentUser._id);
  };

  const confirmFriend = (_id) => {
    //const _id = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${_id}/accept`).then((res) => {
      reloadUser();
      const updatedUser = currentUser;
      updatedUser.friends.push(user);
      setCurrentUser(updatedUser);
      setReceivedRequest(undefined);
    });
  };

  const declineFriend = (_id) => {
    //const _id = e.target.getAttribute('data-id');
    Axios.post(`/friend_requests/${_id}/decline`).then((res) => {
      setRequests(requests.filter((request) => request._id !== res.data._id));
      setReceivedRequest(undefined);
    });
  };

  const deleteFriend = (user_id) => {
    Axios.delete(`/friend_requests/${user_id}/delete`, config).then((res) => {
      reloadUser();
      setIsFriends(false);
      setSentRequest(undefined);
      setReceivedRequest(undefined);
    });
  };

  // filter sent and received requests whenever the requests array changes
  useEffect(() => {
    async.series(
      [
        function (callback) {
          const sent = requests.filter(
            (request) => request.from._id === user._id
          );
          callback(null, sent);
        },
        function (callback) {
          const received = requests.filter(
            (request) => request.to._id === user._id
          );
          callback(null, received);
        },
      ],
      (err, results) => {
        setSentRequest(
          results[0].find((req) => req.to._id === currentUser._id)
        );
        setReceivedRequest(
          results[1].find((req) => req.from._id === currentUser._id)
        );
      }
    );
  }, [requests]);

  useEffect(() => {
    setLoading(true);
    // Set profile user
    if (user_id) {
      // Set current user based on url
      Axios.get(`/users/${user_id}`).then((res) => {
        if (currentUser._id !== res.data._id) setCurrentUser(res.data);
      });
    }

    // Fetch posts
    Axios.get("/posts").then((res) => {
      setPosts(res.data.filter((post) => post.user._id === currentUser._id));
      setLoading(false);
    });
    // Fetch requests
    Axios.get("/friend_requests", config)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    // Reload the page
    setSubPage("main");
  }, [currentUser]);

  useEffect(() => {
    setSameUser(currentUser._id === user._id);
    // Establish friendship status
    setIsFriends(checkIsFriend());
  }, [currentUser, user]);

  // Get posts with photos
  useEffect(() => {
    setPhotos(posts.map((post) => (post.image ? post : "")));
  }, [posts]);

  useEffect(() => {
    if (profileUser) setCurrentUser(profileUser);
  }, [profileUser]);

  return (
    currentUser && (
      <Container fluid className="p-0">
        <CSSTransition
          in={loading}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <LoadingOverlay />
        </CSSTransition>
        {profilePhotoForm && (
          <ImageForm
            path={`/users/${user._id}/profile_photo`}
            reloadUser={reloadUser}
            resources={user}
            setImageForm={setProfilePhotoForm}
          />
        )}
        {coverPhotoForm && (
          <ImageForm
            path={`/users/${user._id}/cover_photo`}
            reloadUser={reloadUser}
            resources={user}
            setImageForm={setCoverPhotoForm}
          />
        )}
        <div style={{ background: "white" }}>
          {showNav && (
            <Navbar
              key="profile"
              setUser={setUser}
              users={users}
              user={user}
              reloadUser={reloadUser}
            />
          )}
          <ProfileSection className="px-0">
            {currentUser.cover_photo ? (
              <a href={user.cover_photo}>
                <CoverPhoto src={currentUser.cover_photo}></CoverPhoto>
              </a>
            ) : (
              <DefaultCoverPhoto />
            )}
            {sameUser && (
              <GrayHoverDiv onClick={() => setCoverPhotoForm(true)}>
                <p className="mb-0">Change Cover Photo</p>
              </GrayHoverDiv>
            )}
            {isFriends && (
              <GrayHoverDiv
                data-id={currentUser._id}
                onClick={() => setCollapse(!collapse)}
              >
                <p className="mb-0">
                  <FaCheck /> Friends
                </p>
                {/* Collapsed div for friend options */}
                {collapse && (
                  <CollapseDiv>
                    <Option onClick={() => deleteFriend(currentUser._id)}>
                      Remove Friend
                    </Option>
                  </CollapseDiv>
                )}
              </GrayHoverDiv>
            )}
            {receivedRequest && (
              <FlexDivGray>
                <p className="mb-1">
                  {currentUser.display_name ||
                    currentUser.first_name + " " + currentUser.last_name}{" "}
                  has sent you a friend request
                </p>
                <div className="d-block">
                  <Button
                    onClick={() => confirmFriend(receivedRequest._id)}
                    className="mr-2"
                    color="success"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => declineFriend(receivedRequest._id)}
                    color="danger"
                  >
                    Delete
                  </Button>
                </div>
              </FlexDivGray>
            )}
            {sentRequest && (
              <GrayHoverDiv>
                <p className="mb-0">
                  <FaCheck /> Sent Friend Request
                </p>
              </GrayHoverDiv>
            )}
            {!sentRequest && !receivedRequest && !sameUser && !isFriends && (
              <GrayHoverDiv onClick={() => sendRequest(currentUser._id)}>
                <p className="mb-0">Send Friend Request</p>
              </GrayHoverDiv>
            )}
            <ProfilePhotoWrapper>
              <a href={currentUser.profile_photo}>
                <ProfilePhoto src={currentUser.profile_photo}></ProfilePhoto>
              </a>
              {currentUser._id === user._id && (
                <ChangeProfilePhoto onClick={() => setProfilePhotoForm(true)}>
                  <AiFillCamera fill="black" size={24} />
                </ChangeProfilePhoto>
              )}
            </ProfilePhotoWrapper>
          </ProfileSection>
          <h1 className="text-center">
            {currentUser.display_name ||
              currentUser.first_name + " " + currentUser.last_name}
          </h1>
          {/* Small Description */}
          {currentUser.description.length && (
            <Description
              href="https://github.com/irlgabriel"
              dangerouslySetInnerHTML={{ __html: currentUser.description }}
            ></Description>
          )}
          <ProfileHeader>
            <hr className="my-2" />
            <ProfileNav>
              <NavItem
                onClick={() => setSubPage("main")}
                active={subPage === "main"}
              >
                Posts
              </NavItem>
              <NavItem
                onClick={() => setSubPage("photos")}
                active={subPage === "photos"}
              >
                Photos
              </NavItem>
              <NavItem
                onClick={() => setSubPage("friends")}
                active={subPage === "friends"}
              >
                Friends
              </NavItem>
            </ProfileNav>
          </ProfileHeader>
        </div>
        {subPage === "main" && (
          <Main>
            <Col className="pt-3 d-none d-lg-block" sm="5">
              <p className="font-weight-bold mb-0">Photos</p>
              <Photos user={currentUser} photos={photos} />
            </Col>
            <Col className="pt-3">
              {currentUser._id === user._id && (
                <PostForm posts={posts} setPosts={setPosts} user={user} />
              )}
              {currentUser !== user && (
                <p className="font-weight-bold mb-0">Posts</p>
              )}
              {}
              {!posts.length && (
                <WhiteContainer className="mt-2">
                  <p>No Posts available</p>
                </WhiteContainer>
              )}
              {posts.map((post) => (
                <Post
                  key={post._id}
                  user={user}
                  posts={posts}
                  post={post}
                  setPosts={setPosts}
                />
              ))}
            </Col>
          </Main>
        )}
        {subPage === "photos" && <Photos user={currentUser} photos={photos} />}
        {subPage === "friends" && (
          <FriendsProfile user={user} currentUser={currentUser} />
        )}
      </Container>
    )
  );
};

export default Profile;
