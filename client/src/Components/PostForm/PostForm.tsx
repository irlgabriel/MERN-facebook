import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Form, Input, FormGroup, Button } from "reactstrap";
import {
  RoundImage,
  GrayHover,
  Container,
  CloseIcon,
  ImageWrapper,
  Image,
} from "./PostForm.components";
import { FcStackOfPhotos } from "react-icons/fc";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { LoadingOverlay } from "..";

const PostForm = ({ user, setPosts, posts }) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [displayName, setDisplayName] = useState(user.display_name);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [expandForm, setExpandForm] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<Blob | null>(null);

  const submitHandler = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!content && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    //@ts-ignore
    formData.append("image", file);

    setLoading(true);
    axios
      .post("/posts", formData, {
        headers: {
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        setPosts([res.data, ...posts]);
        setContent("");
        setImageSrc(null);
        setFile(null);
        setExpandForm(false);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleImageFormClick = () => {
    if (imageInputRef) {
      imageInputRef?.current?.click();
    }
  };

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  useEffect(() => {
    if (file) {
      setImageSrc(window.URL.createObjectURL(file) as string);
      setExpandForm(true);
    }
  }, [file]);

  useEffect(() => {
    setDisplayName(user.first_name || user.display_name.split(" ")[0]);
  }, []);

  return (
    <Container>
      {loading && <LoadingOverlay />}
      <Form encType="multipart/form-data" onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex align-items-center mb-2">
          <Link to="/profile">
            <RoundImage
              className="mr-2"
              src={user.profile_photo}
              width="40px"
            />
          </Link>
          <div className="w-100">
            <textarea
              ref={textInputRef}
              id="post_input_form"
              onFocus={() => setExpandForm(true)}
              style={{
                height: "32px",
                alignItems: "center",
                background: "rgb(240, 242, 245)",
                borderRadius: "24px",
              }}
              value={content}
              className="w-100 pl-2 pr-5 d-flex"
              name="content"
              onChange={(e) => {
                setContent(e.target.value);
              }}
              placeholder={`What's on your mind, ${displayName}?`}
            />
          </div>
        </div>
        {imageSrc && (
          <ImageWrapper
            className="py-2"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <CloseIcon onClick={() => setImageSrc(null)} />
            <Image src={imageSrc} alt="selected-file" />
          </ImageWrapper>
        )}

        <CSSTransition
          in={expandForm}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <FormGroup
            style={{ justifyContent: "center" }}
            className="d-flex w-100 py-2"
          >
            <Button
              style={{ background: "lightblue" }}
              type="submit"
              className="px-5"
            >
              Post!
            </Button>
          </FormGroup>
        </CSSTransition>
        <hr className="my-2" />
        <GrayHover onClick={handleImageFormClick}>
          <input
            onChange={handleImageSelect}
            style={{ display: "none" }}
            type="file"
            ref={imageInputRef}
          />
          <FcStackOfPhotos size={36} className="mr-2" />
          <p className="m-0">Photos</p>
        </GrayHover>
      </Form>
    </Container>
  );
};

export default PostForm;
