import React, { useEffect, useState } from "react";
import { Container, Col } from "reactstrap";
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
import { Photos } from "..";
import { CSSTransition } from "react-transition-group";

import { AiFillCamera } from "react-icons/ai";
import Axios from "axios";
import { FaCheck } from "react-icons/fa";
import async from "async";
import { useParams } from "react-router-dom";
import { User, FriendRequest, Post as IPost, Photo } from "Types";
import {
  useConfirmRequest,
  useDeclineRequest,
  useSendRequest,
  useUser,
  useCurrentUser,
  useFriendRequests,
  useUserPosts,
} from "Hooks";

interface Props {
  showNav: boolean;
  previewUser?: string;
}

const Profile = ({ showNav = true, previewUser }: Props) => {
  const { user_id } = useParams<{ user_id: string }>();

  const [subPage, setSubPage] = useState<string>("main");
  const user = useCurrentUser() as User;
  const [{ data: currentUser }] = useUser(previewUser ?? user_id ?? user._id);
  const [{ data: posts, loading: loadingPosts }, getUserPosts] = useUserPosts(
    previewUser ?? user_id ?? user._id
  );
  const [{ data: requests, loading: loadingUsers }, getFriendRequests] =
    useFriendRequests();

  const loading = loadingPosts || loadingUsers;

  const [coverPhotoForm, setCoverPhotoForm] = useState<boolean>(false);
  const [profilePhotoForm, setProfilePhotoForm] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean>(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Friendship status state
  const sameUser = currentUser!._id === user._id;
  const isFriends = currentUser!.friends.map((d) => d._id).includes(user._id);
  const [sentRequest, setSentRequest] = useState<FriendRequest | null>(null);
  const [receivedRequest, setReceivedRequest] = useState<FriendRequest | null>(
    null
  );

  const sendRequest = useSendRequest();
  const confirmRequest = useConfirmRequest();
  const declineRequest = useDeclineRequest();

  useEffect(() => {
    console.log("get user posts", currentUser?._id);
    getUserPosts(currentUser!._id);
    getFriendRequests();
  }, []);

  // prev had localStorage.getItem("token") && prepended to config initialization;
  const config = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };

  const deleteFriend = (user_id: string) => {
    Axios.delete(`/friend_requests/${user_id}/delete`, config).then((res) => {
      setSentRequest(null);
      setReceivedRequest(null);
    });
  };

  // filter sent and received requests whenever the requests array changes
  useEffect(() => {
    async.series<FriendRequest[]>(
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
        if (results && results[0] && results[1]) {
          const [sentRequests, receivedRequests] = results;
          const sentId = sentRequests.find(
            (req) => req.to._id === currentUser?._id
          );
          setSentRequest(sentId ?? null);

          const receivedId = receivedRequests.find(
            (req) => req.from._id === currentUser?._id
          );
          setReceivedRequest(receivedId ?? null);
        }
      }
    );
  }, [requests]);

  // Get posts with photos
  useEffect(() => {
    const photos = posts.filter((post) => post.image).map((d) => d.image);
    setPhotos(photos);
  }, [posts]);

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
            // resources={user}
            setImageForm={setProfilePhotoForm}
          />
        )}
        {coverPhotoForm && (
          <ImageForm
            path={`/users/${user._id}/cover_photo`}
            // resources={user}
            setImageForm={setCoverPhotoForm}
          />
        )}
        <div style={{ background: "white" }}>
          {showNav && <Navbar />}
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
                  <button
                    onClick={() => confirmRequest(receivedRequest._id)}
                    className="mr-2 primary-button"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => declineRequest(receivedRequest._id)}
                    className="secondary-button"
                  >
                    Delete
                  </button>
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
              <a href={currentUser?.profile_photo ?? ""}>
                <ProfilePhoto
                  src={currentUser?.profile_photo ?? ""}
                ></ProfilePhoto>
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
              {/**@ts-ignore */}
              <NavItem
                onClick={() => setSubPage("main")}
                active={subPage === "main"}
              >
                Posts
              </NavItem>
              {/**@ts-ignore */}
              <NavItem
                onClick={() => setSubPage("photos")}
                active={subPage === "photos"}
              >
                Photos
              </NavItem>
              {/**@ts-ignore */}
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
              <Photos /*user={currentUser}*/ photos={photos} />
            </Col>
            <Col className="pt-3">
              {currentUser._id === user._id && <PostForm />}
              {currentUser !== user && (
                <p className="font-weight-bold mb-0">Posts</p>
              )}
              {!posts ||
                (!posts?.length && (
                  <WhiteContainer className="mt-2">
                    <p>No Posts available</p>
                  </WhiteContainer>
                ))}
              {posts.map((post) => (
                <Post id={post._id} key={post._id} />
              ))}
            </Col>
          </Main>
        )}
        {subPage === "photos" && (
          <Photos /*user={currentUser} */ photos={photos} />
        )}
        {subPage === "friends" && (
          <FriendsProfile user={user} currentUser={currentUser} />
        )}
      </Container>
    )
  );
};

export default Profile;
