import React, { useEffect, useState, useRef } from "react";
import { Form, FormGroup } from "reactstrap";
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
import { User } from "Types";
import { useCurrentUser, useCreatePost } from "Hooks";

const PostForm = () => {
  const [{ loading }, createPost] = useCreatePost();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const user = useCurrentUser() as User;

  const [displayName, setDisplayName] = useState<string>(
    user?.display_name ?? ""
  );
  const [imageSrc, setImageSrc] = useState<string>("");
  const [expandForm, setExpandForm] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // NEED EDIT HOOK HERE !!!!!!!!! TO PROPERLY UPDATE ERDUX UPON SUBMITING;
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    file && formData.append("image", file);

    //@ts-ignore
    createPost(formData);

    // should be done after create is completed (need new hook for this usePrevious)
    setContent("");
    setImageSrc("");
    setFile(null);
    setExpandForm(false);
  };

  const handleImageFormClick = () => {
    if (imageInputRef?.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  useEffect(() => {
    if (file) {
      setImageSrc(window.URL.createObjectURL(file));
      setExpandForm(true);
    }
  }, [file]);

  useEffect(() => {
    setDisplayName(user?.first_name ?? user?.display_name?.split(" ")[0] ?? "");
  }, []);

  if (!user) return null;

  return (
    <Container>
      {loading && <LoadingOverlay />}
      <Form encType="multipart/form-data" onSubmit={(e) => submitHandler(e)}>
        <div className="d-flex align-items-center mb-2">
          <Link to="/profile">
            <RoundImage
              className="mr-2"
              src={user?.profile_photo ?? ""}
              // width="40px"
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
          <CSSTransition addEndListener={() => undefined}>
            <ImageWrapper
              className="py-2"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <CloseIcon onClick={() => setImageSrc("")} />
              <Image src={imageSrc} alt="selected-file" />
            </ImageWrapper>
          </CSSTransition>
        )}

        <CSSTransition
          in={expandForm}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <FormGroup
            style={{ justifyContent: "flex-end" }}
            className="d-flex w-100 py-2"
          >
            <button
              onClick={() => setExpandForm(false)}
              type="button"
              className="secondary-button"
            >
              Cancel
            </button>
            <button type="submit" className="ml-3 px-4 primary-button">
              Post!
            </button>
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
