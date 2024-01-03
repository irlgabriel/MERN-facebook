import React, { useEffect, useState } from "react";
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
} from "./style";
import {
  Post,
  PostForm,
  ImageForm,
  FriendsProfile,
  LoadingOverlay,
} from "../../Components";
import { CSSTransition } from "react-transition-group";
import { AiFillCamera } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { Post as PostType } from "../../Types/types";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import {
  acceptRequest,
  declineRequest,
  selectSentFriendRequest,
  selectReceivedFriendRequest,
  sendRequest,
} from "../../Store/friendRequests";
import { removeFriend, selectUserById } from "../../Store/users";
import { selectIsFriend } from "../../Store/auth";
import Photos from "../Photos/Photos";
import { useRouter } from "next/router";
import { ProtectedRoute } from "../../Components/ProtectedRoute/ProtectedRoute";
import Link from "next/link";
import { fetchUserPosts, selectPostsByUser } from "../../Store/posts";

const Profile = ({ showNav = true }) => {
  const dispatch = useAppDispatch();
  const {
    query: { id },
  } = useRouter();
  const userId = id as string;

  const profileUser = useAppSelector((state) =>
    selectUserById(state.users, userId)
  );

  const loading = useAppSelector((state) => state.users.loading);
  const userPosts = useAppSelector((state) =>
    selectPostsByUser(state.posts, userId)
  );

  const [subPage, setSubPage] = useState("main");
  const [coverPhotoForm, setCoverPhotoForm] = useState(false);
  const [profilePhotoForm, setProfilePhotoForm] = useState(false);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPosts({ userId }));
  }, []);

  // Friendship status state
  const sentRequest = useAppSelector((state) =>
    selectSentFriendRequest(state.friendRequests, userId)
  );
  const receivedRequest = useAppSelector((state) =>
    selectReceivedFriendRequest(state.friendRequests, userId)
  );
  const isFriends = useAppSelector((state) =>
    selectIsFriend(state.auth, userId)
  );

  /* Friend request logic functions */
  const sendFriendRequest = (_id: string) => {
    dispatch(sendRequest({ userId: _id }));
  };

  const confirmFriendRequest = (_id: string) => {
    dispatch(acceptRequest({ userId: _id }));
  };

  const declineFriendRequest = (_id: string) => {
    dispatch(declineRequest({ userId: _id }));
  };

  const deleteFriend = (_id: string) => {
    dispatch(removeFriend({ userId: _id }));
  };

  return profileUser ? (
    <Container fluid className="p-0">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      {profilePhotoForm && (
        <ImageForm
          path={`/users/${profileUser._id}/profile_photo`}
          setImageForm={setProfilePhotoForm}
          content={""}
        />
      )}
      {coverPhotoForm && (
        <ImageForm
          path={`/users/${profileUser._id}/cover_photo`}
          setImageForm={setCoverPhotoForm}
          content={""}
        />
      )}
      <div style={{ background: "white" }}>
        {showNav && <Navbar key="profile" />}
        <ProfileSection className="px-0">
          {profileUser.cover_photo ? (
            <Link href={"profileUser.cover_photo"}>
              <CoverPhoto src={profileUser.cover_photo}></CoverPhoto>
            </Link>
          ) : (
            <DefaultCoverPhoto />
          )}
          {/* {sameUser && (
            <GrayHoverDiv onClick={() => setCoverPhotoForm(true)}>
              <p className="mb-0">Change Cover Photo</p>
            </GrayHoverDiv>
          )} */}
          {isFriends && (
            <GrayHoverDiv
              data-id={profileUser._id}
              onClick={() => setCollapse(!collapse)}
            >
              <p className="mb-0">
                <FaCheck /> Friends
              </p>
              {/* Collapsed div for friend options */}
              {collapse && (
                <CollapseDiv>
                  <Option onClick={() => deleteFriend(profileUser._id)}>
                    Remove Friend
                  </Option>
                </CollapseDiv>
              )}
            </GrayHoverDiv>
          )}
          {receivedRequest && (
            <FlexDivGray>
              <p className="mb-1">
                {profileUser.display_name ||
                  profileUser.first_name + " " + profileUser.last_name}{" "}
                has sent you a friend request
              </p>
              <div className="d-block">
                <Button
                  //@ts-ignore
                  onClick={() => confirmFriendRequest(receivedRequest._id)}
                  className="mr-2"
                  color="success"
                >
                  Confirm
                </Button>
                <Button
                  //@ts-ignore
                  onClick={() => declineFriendRequest(receivedRequest._id)}
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
          {!sentRequest && !receivedRequest && !isFriends && (
            <GrayHoverDiv onClick={() => sendFriendRequest(profileUser._id)}>
              <p className="mb-0">Send Friend Request</p>
            </GrayHoverDiv>
          )}
          <ProfilePhotoWrapper>
            {profileUser?.profile_photo && (
              <Link href={"profileUser.profile_photo"}>
                <ProfilePhoto src={profileUser.profile_photo}></ProfilePhoto>
              </Link>
            )}
            {profileUser._id === profileUser._id && (
              <ChangeProfilePhoto onClick={() => setProfilePhotoForm(true)}>
                <AiFillCamera fill="black" size={24} />
              </ChangeProfilePhoto>
            )}
          </ProfilePhotoWrapper>
        </ProfileSection>
        <h1 className="text-center">
          {profileUser.display_name ||
            profileUser.first_name + " " + profileUser.last_name}
        </h1>
        {/* Small Description */}
        {profileUser.description.length && (
          <Description
            href="https://github.com/irlgabriel"
            dangerouslySetInnerHTML={{ __html: profileUser.description }}
          ></Description>
        )}
        <ProfileHeader>
          <hr className="my-2" />
          <ProfileNav>
            {/*@ts-ignore*/}
            <NavItem
              onClick={() => setSubPage("main")}
              active={subPage === "main"}
            >
              Posts
            </NavItem>
            {/*@ts-ignore*/}
            <NavItem
              onClick={() => setSubPage("photos")}
              active={subPage === "photos"}
            >
              Photos
            </NavItem>
            {/*@ts-ignore*/}
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
        <div className="grid grid-cols-12 gap-6 px-20">
          <div className="col-span-5">
            <p className="font-weight-bold mb-0">Photos</p>
            <Photos photos={[]} />
          </div>
          <div className="col-span-7">
            {profileUser._id === profileUser._id && (
              <PostForm user={profileUser} />
            )}
            {profileUser !== profileUser && (
              <p className="font-weight-bold mb-0">Posts</p>
            )}
            {}
            {!userPosts.length && (
              <WhiteContainer className="mt-2">
                <p>No Posts available</p>
              </WhiteContainer>
            )}
            {userPosts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
      {subPage === "photos" && <Photos photos={[]} />}
      {subPage === "friends" && <FriendsProfile user={profileUser} />}
    </Container>
  ) : null;
};

export default ProtectedRoute(Profile);
