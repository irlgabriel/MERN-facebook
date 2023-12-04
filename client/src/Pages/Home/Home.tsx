import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FaUserFriends } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

import {
  NavItem,
  RoundImage,
  NoPostsDiv,
  FakeLink,
  Column,
} from "./Home.components";
import { Navbar, PostForm, Post, LoadingOverlay } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import { fetchPosts } from "../../Store/posts";
import { User } from "../../Types/types";

const Home = () => {
  const { ref, inView } = useInView();
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const user = useAppSelector((state) => state.auth.user) as User;
  const loading = useAppSelector((state) => state.posts.loading);
  const hasMoreData = useAppSelector((state) => state.posts.hasMoreData);

  const postInput = document.querySelector(
    "#post_input_form"
  ) as HTMLInputElement;

  useEffect(() => {
    dispatch(fetchPosts({}));
  }, []);

  useEffect(() => {
    if (inView && !loading && hasMoreData) {
      dispatch(fetchPosts({}));
    }
  }, [inView, loading, hasMoreData]);

  console.log(posts);

  return (
    <Container fluid className="px-0">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <Navbar key="home" />
      <Row className="mx-0">
        <Col id="left-col" className="p-2 d-none d-lg-block" sm="3" lg="3">
          <NavItem to="/profile">
            <RoundImage src={user.profile_photo} />
            &nbsp;{user.display_name || user.first_name + " " + user.last_name}
          </NavItem>
          <NavItem to="/friends">
            <FaUserFriends size={36} fill="royalblue" />
            &nbsp;Friends
          </NavItem>
        </Col>
        <Col id="mid-col" sm="12" md="8" lg="6">
          <PostForm posts={[]} setPosts={() => undefined} user={user} />
          {posts.map((post) => (
            <Post post={post} />
          ))}
          {!posts.length && (
            <NoPostsDiv>
              <p style={{ display: "inline-block" }} className="mb-0">
                No posts yet. Find{" "}
                <Link style={{ color: "royalblue" }} to="/friends">
                  Friends
                </Link>{" "}
                or
              </p>
              <FakeLink onClick={() => postInput?.focus()}>
                &nbsp;create a post!
              </FakeLink>
            </NoPostsDiv>
          )}
          <div ref={ref} style={{ width: "10px", height: "2px" }} />
        </Col>
        <Column
          id="right-col"
          sm="5"
          md="4"
          lg="3"
          className="d-none d-md-block"
        >
          <h5 style={{ color: "darkgray" }}>Contacts</h5>
          <hr className="my-2" style={{ backgroundColor: "lightgray" }}></hr>
          {user.friends.map((friend) => (
            //@ts-ignore
            <NavItem key={friend._id} to={`/users/${friend._id}`}>
              {/*@ts-ignore*/}
              <RoundImage src={friend.profile_photo} />
              &nbsp;
              {/*@ts-ignore*/}
              {friend.display_name ||
                //@ts-ignore
                friend.first_name + " " + friend.last_name}
            </NavItem>
          ))}
        </Column>
      </Row>
    </Container>
  );
};

export default Home;
