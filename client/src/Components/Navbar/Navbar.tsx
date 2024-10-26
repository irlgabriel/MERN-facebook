import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Nav, Button, Col, Input } from "reactstrap";
import {
  NavMidItem,
  RoundWrapper,
  CollapsableDiv,
  RoundImage,
  GrayHover,
  LinkGreyHover,
  RoundedUserDiv,
  TopRightUserImg,
  RegularLink,
  NewNotifications,
  SearchContainer,
  SearchResult,
  SmallRoundImg,
  LockedOverlay,
  NewFriendsNotifications,
  FlexDiv,
  DeleteAccountDiv,
  Warning,
} from "./Navbar.components";
/* React Icons */
import {
  FaFacebook,
  FaUserFriends,
  FaFacebookMessenger,
  FaDoorOpen,
} from "react-icons/fa";
import {
  AiOutlineSearch,
  AiFillHome,
  AiFillBell,
  AiFillLock,
  AiFillDelete,
  AiFillWarning,
} from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { GoTriangleDown } from "react-icons/go";
import { BsArrowLeft } from "react-icons/bs";
import { CSSTransition } from "react-transition-group";
import { Notification } from "..";
import {
  FriendRequest,
  Notification as NotificationType,
} from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import { getUsers } from "../../store/users";
import {
  clearAllNotifications,
  getNotifications,
} from "../../store/notifications";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute";
import { getRequests } from "../../store/friendRequests";
import { IUser } from "../../../../server/models/users";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const { pathname, push } = useRouter();

  const user = useAppSelector((state) => state.auth.user) as IUser;
  const users = useAppSelector((state) => state.users.users) as IUser[];
  const requests = useAppSelector((state) => state.friendRequests.requests);
  const usersFetched = useAppSelector((state) => state.users.fetched);

  const receivedRequests = useMemo(() => {
    //@ts-ignore
    return requests.filter((req) => req.to._id === user._id);
  }, [requests]);

  const fullname = (user) => {
    return user.display_name || user.first_name + " " + user.last_name;
  };

  const [menu, setMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IUser[]>([]);
  const [userDropdown, setUserDropdown] = useState(false);
  const [warning, setWarning] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [newNotifications, setNewNotifications] = useState<NotificationType[]>(
    []
  );

  const clearNotifications = () => {
    dispatch(clearAllNotifications());
  };

  const deleteAccount = () => {
    window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone!"
    ) &&
      axios.delete("/users").then((res) => {
        typeof window !== undefined ? localStorage.removeItem("token") : "";
        // todo
        // logout
      });
  };

  const logoutHandler = () => {
    // delete the token
    // todo
    // logout
    // delete the cookie if there's any
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    push("/");
  };

  // MOUNT
  useEffect(() => {
    dispatch(getNotifications());

    if (!usersFetched) {
      dispatch(getUsers());
    }
  }, [usersFetched]);

  useEffect(() => {
    // Get new friend requests
    dispatch(getRequests());
  }, [user]);

  useEffect(() => {
    setNewNotifications(
      notifications.filter((notification) => notification.clicked !== true)
    );
  }, [notifications]);

  useEffect(() => {
    // search logic
    if (query.length) {
      setSearchDropdown(true);
      setResults(
        users.filter((user) =>
          fullname(user).toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setSearchDropdown(false);
    }
  }, [query, users]);

  return (
    <Nav className="fixed h-14 z-50 top-0 grid gap-5 w-full grid-cols-12 shadow-xl bg-slate-50">
      <div className="sm:hidden md:flex col-span-3 items-center flex relative">
        {!showSearch && (
          <Link className="sm:hidden md:block" href="/home">
            <FaFacebook className="mr-2" fill="royalblue" size={40} />
          </Link>
        )}
        {!showSearch && (
          <RoundWrapper onClick={() => setShowSearch(true)}>
            <AiOutlineSearch size={20} />
          </RoundWrapper>
        )}
        {showSearch && (
          <div className="flex items-center">
            <RoundWrapper
              className="mr-2 px-2"
              onClick={() => setShowSearch(false)}
            >
              <BsArrowLeft size={16} />
            </RoundWrapper>
            <Input
              style={{ borderRadius: "21px", width: "90%" }}
              type="text"
              className="py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Facebook"
            />
          </div>
        )}
        <CSSTransition
          in={searchDropdown && showSearch}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <SearchContainer>
            {results.map((result) => (
              <Link href={`/users/${result._id}`}>
                <SearchResult>
                  <SmallRoundImg
                    className="mr-2"
                    src={result.profile_photo}
                  ></SmallRoundImg>
                  <p className="mb-0">{fullname(result)}</p>
                </SearchResult>
              </Link>
            ))}
          </SearchContainer>
        </CSSTransition>
      </div>

      {/** >768px */}
      <Col className="sm:col-span-10 sm:col-start-2 sm:col-end-11 md:col-span-6 flex items-center">
        <NavMidItem
          href="/home"
          //@ts-ignore
          active={pathname === "/home"}
          className="mid-nav-item"
        >
          <AiFillHome
            size={32}
            fill={pathname === "/home" ? "royalblue" : "gray"}
            className="mr-2"
          />
        </NavMidItem>
        <NavMidItem
          href="/friends"
          //@ts-ignore
          active={pathname === "/friends"}
          className="mid-nav-item"
        >
          {receivedRequests.length ? (
            <NewFriendsNotifications count={receivedRequests.length} />
          ) : (
            ""
          )}
          <FaUserFriends
            fill={pathname === "/friends" ? "royalblue" : "gray"}
            size={32}
          />
        </NavMidItem>
      </Col>
      <div className="flex col-span-3 items-center">
        <RegularLink href={`/users/${user._id}`}>
          <RoundedUserDiv
            active={pathname === `/users/${user._id}`}
            className="mr-1"
          >
            <img
              src={user.profile_photo}
              className="w-7 h-7 rounded-2xl mr-2"
            />
            <p className="mb-0">
              {user.first_name
                ? user.first_name
                : user.display_name
                ? user.display_name.split(" ")[0]
                : ""}
            </p>
          </RoundedUserDiv>
        </RegularLink>
        <RoundWrapper className="d-xs-none d-md-flex mr-2">
          <LockedOverlay>
            <AiFillLock color="red" />
          </LockedOverlay>
          <GrAdd size={16} fill="black" />
        </RoundWrapper>
        <RoundWrapper className="d-xs-none d-md-flex mr-2">
          <LockedOverlay>
            <AiFillLock color="red" />
          </LockedOverlay>
          <FaFacebookMessenger size={16} fill="black" />
        </RoundWrapper>
        <RoundWrapper
          onClick={() => {
            setNotificationDropdown(!notificationDropdown);
            setUserDropdown(false);
            setMenu(false);
          }}
          className="mr-2"
        >
          <AiFillBell
            style={{
              transition: "all .5s ease-in-out",
              fill: notificationDropdown ? "royalblue" : "black",
            }}
            size={16}
            fill="black"
          />
          {newNotifications.length ? (
            <NewNotifications count={newNotifications.length.toString()} />
          ) : (
            ""
          )}
        </RoundWrapper>
        <RoundWrapper
          onClick={() => {
            setUserDropdown(!userDropdown);
            setMenu(false);
            setNotificationDropdown(false);
          }}
        >
          <GoTriangleDown
            style={{
              transition: ".3s ease-in-out",
              transform: userDropdown ? "rotate(180deg)" : "rotate(0deg)",
              fill: userDropdown ? "royalblue" : "black",
            }}
            size={16}
            fill="black"
          />
        </RoundWrapper>
      </div>

      {/** Collapsable div for user profile */}
      <CSSTransition
        in={userDropdown}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <CollapsableDiv>
          <LinkGreyHover href={`/users/${user._id}`}>
            <GrayHover>
              <RoundImage src={user.profile_photo} className="mr-2" />
              <div>
                <p
                  style={{ fontSize: "18px" }}
                  className="font-weight-bold mb-0"
                >
                  {user.display_name || user.first_name + " " + user.last_name}
                </p>
                <p className="text-muted mb-0">See your profile</p>
              </div>
            </GrayHover>
          </LinkGreyHover>
          <hr />
          <GrayHover onClick={() => logoutHandler()}>
            <RoundWrapper className="mr-2">
              <FaDoorOpen size={24} />
            </RoundWrapper>
            <p className="mb-0 font-weight-bold">Log Out</p>
          </GrayHover>
          <Warning
            onClick={() => setWarning(!warning)}
            style={{ userSelect: "none" }}
            className="flex justify-end items-center"
          >
            <AiFillWarning fill="orange" size={32} />
            <p style={{ color: "orange" }} className="mb-0">
              Warning
            </p>
          </Warning>
          <CSSTransition
            in={warning}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <DeleteAccountDiv onClick={() => deleteAccount()}>
              <AiFillDelete color="red" size={16} className="mr-1" />
              <p
                style={{
                  marginBottom: "0",
                  fontSize: "14px",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                Delete Account
              </p>
            </DeleteAccountDiv>
          </CSSTransition>
        </CollapsableDiv>
      </CSSTransition>

      {/* Collapsable div for notifications */}
      <CSSTransition
        in={notificationDropdown}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <CollapsableDiv>
          <h3>Notifications</h3>
          <FlexDiv className="mb-2 px-2">
            {notifications.length ? (
              <p className="mb-1">New</p>
            ) : (
              <p>No notifications</p>
            )}
            {notifications.length ? (
              <Button
                onClick={() => clearNotifications()}
                className="ml-auto"
                outline={true}
              >
                Clear all
              </Button>
            ) : (
              ""
            )}
          </FlexDiv>
          {notifications.map((notification) => (
            <Notification
              //@ts-ignore
              key={notification._id}
              notification={notification}
            />
          ))}
        </CollapsableDiv>
      </CSSTransition>
    </Nav>
  );
};

export default ProtectedRoute(Navbar);
