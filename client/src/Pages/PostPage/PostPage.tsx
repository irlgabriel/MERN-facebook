import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "reactstrap";
import { Post, Navbar, LoadingOverlay } from "../../Components";
import { CSSTransition } from "react-transition-group";
import axios from "axios";
import { Post as IPost, User } from "Types";

const PostPage = () => {
  const { post_id } = useParams<{ post_id: string }>();

  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<IPost | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    setLoading(true);
    // GET All posts
    axios.get<IPost[]>("/posts").then((res) => {
      setPosts(res.data);
    });
    // GET This post
    axios.get<IPost>("/posts/" + post_id).then((res) => {
      setPost(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Container fluid className="m-0 p-0">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <Navbar key="posts" />
      <Container className="mt-2">{post && <Post />}</Container>
    </Container>
  );
};

export default PostPage;
