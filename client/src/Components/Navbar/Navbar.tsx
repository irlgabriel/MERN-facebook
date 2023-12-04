import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useHistory } from "react-router-dom";
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
  MenuIcon,
  SearchContainer,
  SearchResult,
  SmallRoundImg,
  Menu,
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
  User,
} from "../../Types/types";
import { useAppSelector } from "../../Hooks/utils";

const Navbar = () => {
  const location = useLocation();
  const history = useHistory();

  const user = useAppSelector((state) => state.auth.user) as User;

  const fullname = (user) => {
    return user.display_name || user.first_name + " " + user.last_name;
  };

  const [users, setUsers] = useState([]);
  const [menu, setMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [userDropdown, setUserDropdown] = useState(false);
  const [warning, setWarning] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [newNotifications, setNewNotifications] = useState<NotificationType[]>(
    []
  );
  const [newRequests, setNewRequests] = useState<FriendRequest[]>([]);

  const clearNotifications = () => {
    axios.delete("/notifications").then((res) => {
      setNotifications([]);
    });
  };

  const deleteAccount = () => {
    window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone!"
    ) &&
      axios.delete("/users").then((res) => {
        localStorage.removeItem("token");
        // todo
        // logout
      });
  };

  const logoutHandler = () => {
    // delete the token
    // todo
    // logout
    // delete the cookie if there's any
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    history.push("/");
  };

  useEffect(() => {
    // Get Notification
    axios
      .get(`/notifications`)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => console.log(err));

    // Get Users
    axios.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    // Get new friend requests
    axios.get("/friend_requests").then((res) => {
      setNewRequests(res.data.filter((request) => request.to._id === user._id));
    });
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
    <Nav className="sticky-top px-1">
      <Col className="align-items-center d-flex position-relative">
        {!showSearch && (
          <Link className="d-none d-md-block" to="/home">
            <FaFacebook className="mr-2" fill="royalblue" size={40} />
          </Link>
        )}
        {!showSearch && (
          <RoundWrapper onClick={() => setShowSearch(true)}>
            <AiOutlineSearch size={20} />
          </RoundWrapper>
        )}
        {showSearch && (
          <div className="d-flex align-items-center">
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
              <Link to={`/users/${result._id}`}>
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
      </Col>

      {/** >768px */}
      <Col sm="5" id="nav-mid" className="d-flex align-items-center">
        <NavMidItem
          to="/home"
          active={location.pathname === "/home"}
          className="mid-nav-item"
        >
          <AiFillHome
            size={32}
            fill={location.pathname === "/home" ? "royalblue" : "gray"}
            className="mr-2"
          />
        </NavMidItem>
        <NavMidItem
          to="/friends"
          active={location.pathname === "/friends"}
          className="mid-nav-item"
        >
          {newRequests.length ? (
            <NewFriendsNotifications count={newRequests.length} />
          ) : (
            ""
          )}
          <FaUserFriends
            fill={location.pathname === "/friends" ? "royalblue" : "gray"}
            size={32}
          />
        </NavMidItem>
      </Col>
      {/** <768px */}
      <Col className="position-relative align-items-center d-flex d-md-none">
        <MenuIcon
          onClick={() => {
            setMenu(!menu);
            setNotificationDropdown(false);
            setUserDropdown(false);
          }}
        />
        <CSSTransition in={menu} timeout={300} classNames="fade" unmountOnExit>
          <Menu>
            <GrayHover>
              <LinkGreyHover to="/home">Home</LinkGreyHover>
            </GrayHover>
            <GrayHover>
              <LinkGreyHover to="/friends">Friends</LinkGreyHover>
            </GrayHover>
          </Menu>
        </CSSTransition>
      </Col>

      <Col className="d-flex justify-content-end align-items-center">
        <RegularLink to="/profile">
          <RoundedUserDiv
            active={location.pathname === "/profile"}
            className="mr-1"
          >
            <TopRightUserImg src={user.profile_photo} className="mr-2" />
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
      </Col>

      {/** Collapsable div for user profile */}
      <CSSTransition
        in={userDropdown}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <CollapsableDiv>
          <LinkGreyHover to="/profile">
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
            className="d-flex justify-content-end align-items-center"
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
              notifications={notifications}
              setNotifications={setNotifications}
            />
          ))}
        </CollapsableDiv>
      </CSSTransition>
    </Nav>
  );
};

export default Navbar;
