import React, { useEffect, useState } from "react";
import { Container, Col, Button } from "reactstrap";
import { Navbar } from "../../Components";
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
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import {
  acceptRequest,
  declineRequest,
  selectSentFriendRequest,
  selectReceivedFriendRequest,
  sendRequest,
} from "../../store/friendRequests";
import { removeFriend, selectUserById } from "../../store/users";
import { selectIsFriend } from "../../store/auth";
import Photos from "../../Components/Photos/Photos";
import { useRouter } from "next/router";
import { ProtectedRoute } from "../../Components/ProtectedRoute/ProtectedRoute";
import Link from "next/link";
import { fetchUserPosts, selectPostsByUser } from "../../store/posts";
import styled from "styled-components";

export const Profile = ({
  showNav = true,
  userId: previewUserId,
}: {
  showNav: boolean;
  userId?: string;
}) => {
  const dispatch = useAppDispatch();
  const {
    query: { id },
  } = useRouter();

  const userId = (id ?? previewUserId) as string;

  const profileUser = useAppSelector((state) =>
    selectUserById(state.users, userId)
  );

  const loggedInUserId = useAppSelector((state) => state.auth.user?._id);
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

  const onClickFriendDropdown = () => {
    const canCollapse = userId !== loggedInUserId;
    if (!canCollapse) return;
    setCollapse((state) => !state);
  };

  return profileUser ? (
    <div className="p-0">
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
        <div className="px-0 w-full my-0 mx-auto mb-7 rounded-t-md rounded-b-md relative">
          {profileUser.cover_photo ? (
            <Link href={"profileUser.cover_photo"}>
              <img
                className="w-full h-80 rounded-bl-md rounded-br-md"
                src={profileUser.cover_photo}
              />
            </Link>
          ) : (
            <div className="bg-slate-50 w-full h-80 rounded-bl-md rounded-br-md" />
          )}
          {isFriends ? (
            <div
              className="min-w-[120px] flex items-center justify-center absolute bottom-5 right-5 rounded-md bg-slate-200 py-2 px-1 cursor-pointer hover:bg-slate-300"
              data-id={profileUser._id}
              onClick={() => onClickFriendDropdown()}
            >
              <FaCheck />
              <p className="mb-0 ml-1">Friends</p>
              {/* Collapsed div for friend options */}
              {collapse && (
                <div className="absolute w-36 bg-white -bottom-11 right-0 rounded-md p-1 border">
                  <div
                    className="bg-white rounded-md p-1 cursor-pointer hover:bg-slate-100"
                    onClick={() => deleteFriend(profileUser._id)}
                  >
                    Remove Friend
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
          {receivedRequest ? (
            <div className="max-w-48 absolute bottom-5 right-5 rounded-md py2 px-1 cursor-pointer hover:opacity-75">
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
            </div>
          ) : (
            <></>
          )}
          {sentRequest ? (
            <div className="max-w-48 absolute bottom-5 right-5 rounded-md py2 px-1 cursor-pointer hover:opacity-75">
              <p className="mb-0">
                <FaCheck /> Sent Friend Request
              </p>
            </div>
          ) : (
            <></>
          )}
          {!sentRequest && !receivedRequest && !isFriends ? (
            <div
              className="max-w-48 absolute bottom-5 right-5 rounded-md py2 px-1 cursor-pointer hover:opacity-75"
              onClick={() => sendFriendRequest(profileUser._id)}
            >
              <p className="mb-0">Send Friend Request</p>
            </div>
          ) : (
            <></>
          )}
          <div className="absolute left-[calc(50%-96px)] -bottom-6">
            {profileUser?.profile_photo ? (
              <Link href={"profileUser.profile_photo"}>
                <img
                  className="!w-48 !h-48 z-50 rounded-full"
                  src={profileUser.profile_photo}
                />
              </Link>
            ) : (
              <></>
            )}
            {profileUser._id === profileUser._id ? (
              <div
                className="p-1 rounded-2xl w-9 h-9 flex items-center justify-center absolute bg-slate-100 right-2 bottom-4 z-6 hover:bg-slate-300 cursor-pointer"
                onClick={() => setProfilePhotoForm(true)}
              >
                <AiFillCamera fill="black" size={24} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <h1 className="text-center">
          {profileUser.display_name ||
            profileUser.first_name + " " + profileUser.last_name}
        </h1>
        {/* Small Description */}
        {profileUser.description.length ? (
          <Link
            className="min-w-36 max-w-64 block my-0 mx-auto bg-transparent text-black rounded-md text-center hover:bg-slate-100"
            href="https://github.com/irlgabriel"
            dangerouslySetInnerHTML={{ __html: profileUser.description }}
          ></Link>
        ) : (
          <></>
        )}
        <div className="w-full my-0 mx-auto">
          <hr className="my-2" />
          <div className="flex items-center">
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
          </div>
        </div>
      </div>
      {subPage === "main" ? (
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
            {!userPosts.length && (
              <div className="mt-2 flex p-2 rounded-md bg-white w-full">
                <p>No Posts available</p>
              </div>
            )}
            {userPosts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      {subPage === "photos" ? <Photos photos={[]} /> : <></>}
      {subPage === "friends" ? <FriendsProfile user={profileUser} /> : <></>}
    </div>
  ) : null;
};

const NavItem = styled.a<{ active?: boolean }>`
  padding: 1rem;
  background: white;
  transition: all 0.2s;
  font-weight: bold;
  color: black;
  border-radius: ${({ active }) => (active ? "0" : "6px")};
  border-bottom: ${({ active }) =>
    active ? "3px solid royalblue" : "3px solid transparent"};
  color: ${({ active }) => (active ? "royalblue" : "black")};
  &:hover {
    cursor: pointer;
    color: black;
    text-decoration: none;
    background: ${({ active }) => (active ? "white" : "#f0f2f5")};
  }
`;

export default ProtectedRoute(Profile);
