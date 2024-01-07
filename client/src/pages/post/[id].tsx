import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { Post, Navbar, LoadingOverlay } from "../../Components";
import { CSSTransition } from "react-transition-group";
import { useRouter } from "next/router";
import { fetchPost, selectPostById } from "../../store/posts";
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import { ProtectedRoute } from "../../Components/ProtectedRoute/ProtectedRoute";

const PostPage = () => {
  const {
    query: { id },
  } = useRouter();
  const postId = id as string;

  const dispatch = useAppDispatch();

  const post = useAppSelector((state) => selectPostById(state.posts, postId));
  const loading = useAppSelector((state) => state.posts.loading);

  useEffect(() => {
    dispatch(fetchPost(postId));
  }, []);

  return (
    <Container fluid className="m-0 p-0">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <Navbar key="posts" />
      <Container className="mt-2">{post && <Post post={post} />}</Container>
    </Container>
  );
};

export default ProtectedRoute(PostPage);
