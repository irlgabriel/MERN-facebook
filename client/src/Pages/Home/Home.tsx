import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  NavItem,
  RoundImage,
  NoPostsDiv,
  FakeLink,
  Column,
} from "./Home.components";
import { Navbar, PostForm, Post, LoadingOverlay } from "../../Components";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FaUserFriends } from "react-icons/fa";
import { Post as IPost } from "Types";
import { useCurrentUser, usePosts } from "Hooks";

const Home = () => {
  const user = useCurrentUser();
  const [_, setPosts] = useState<IPost[]>([]);

  const [{ data: posts, loading }, getPosts] = usePosts();

  useEffect(() => {
    try {
      getPosts();
    } catch (e: any) {
      console.log(e.message);
    }
  }, []);

  return (
    <Container fluid className="px-0">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <Navbar />
      <Row style={{ maxHeight: "calc( - 55px)" }} className="mx-0">
        <Col
          style={{ maxHeight: "calc(100vh - 55px)" }}
          id="left-col"
          className="p-2 d-none d-lg-block"
          sm="3"
          lg="3"
        >
          <NavItem to="/profile">
            <RoundImage src={user!.profile_photo ?? ""} />
            &nbsp;
            {user?.display_name ?? user?.first_name + " " + user?.last_name}
          </NavItem>
          <NavItem to="/friends">
            <FaUserFriends size={36} fill="royalblue" />
            &nbsp;Friends
          </NavItem>
        </Col>
        <Col
          style={{
            paddingBottom: 0,
            maxHeight: "calc(100vh - 55px)",
            overflowY: "scroll",
          }}
          id="mid-col"
          sm="12"
          md="8"
          lg="6"
        >
          <PostForm />
          {posts.map((post) =>
            post.user._id ? <Post id={post._id} key={post._id} /> : null
          )}
          {!posts.length && (
            <NoPostsDiv>
              <p style={{ display: "inline-block" }} className="mb-0">
                No posts yet. Find{" "}
                <Link style={{ color: "royalblue" }} to="/friends">
                  Friends
                </Link>{" "}
                or
              </p>
              <FakeLink
                onClick={() => undefined /**postInput && postInput.focus()*/}
              >
                &nbsp;create a post!
              </FakeLink>
            </NoPostsDiv>
          )}
        </Col>
        <Column
          style={{ maxHeight: "calc(100vh- 55px)" }}
          id="right-col"
          sm="5"
          md="4"
          lg="3"
          className="d-none d-md-block"
        >
          <h5 style={{ color: "darkgray" }}>Contacts</h5>
          <hr className="my-2" style={{ backgroundColor: "lightgray" }}></hr>
          {user &&
            user.friends.map((friend) => (
              <NavItem key={friend._id} to={`/users/${friend._id}`}>
                <RoundImage src={friend.profile_photo} />
                &nbsp;
                {friend.display_name ||
                  friend.first_name + " " + friend.last_name}
              </NavItem>
            ))}
        </Column>
      </Row>
    </Container>
  );
};

export default Home;
