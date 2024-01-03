import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { Form, FormGroup } from "reactstrap";
import {
  RoundImage,
  Container,
  CloseIcon,
  ImageWrapper,
  Image,
} from "./PostForm.components";
import { CSSTransition } from "react-transition-group";
import { LoadingOverlay } from "..";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import { addPost } from "../../Store/posts";
import { User } from "../../Types/types";
import Link from "next/link";
import { Button, Textarea } from "flowbite-react";

const PostForm = ({
  user,
  postInputRef,
}: {
  user: User;
  postInputRef?: MutableRefObject<HTMLTextAreaElement | null>;
}) => {
  const dispatch = useAppDispatch();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);

  const loading = useAppSelector((state) => state.posts.loading);

  const [displayName, setDisplayName] = useState(user.display_name);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [expandForm, setExpandForm] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<Blob | null>(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!content && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    //@ts-ignore
    formData.append("image", file);

    // formdata cannot be strongly typed
    dispatch(addPost(formData as any));
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

  const mergeRefs = (node: HTMLTextAreaElement | null) => {
    if (node) {
      textInputRef.current = node;
      if (postInputRef) postInputRef.current = node;
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
    <Container className={"shadow-2xl> mt-8"}>
      {loading && <LoadingOverlay />}
      <Form encType="multipart/form-data" onSubmit={(e) => submitHandler(e)}>
        <div className="w-full flex items-center mb-2">
          <Link href={`/users/${user._id}`}>
            <RoundImage
              className="mr-2"
              src={user.profile_photo}
              width="40px"
            />
          </Link>
          <div className="w-full">
            <Textarea
              className="w-full pl-3 pr-5"
              ref={mergeRefs}
              value={content}
              placeholder={`What's on your mind, ${displayName}?`}
              name="content"
              onFocus={() => setExpandForm(true)}
              onBlur={() => setExpandForm(false)}
              onChange={(e) => setContent(e.target.value)}
              style={{
                height: "32px",
                alignItems: "center",
                background: "rgb(240, 242, 245)",
                borderRadius: "24px",
              }}
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
            <Button type="submit" className="px-5">
              Post!
            </Button>
          </FormGroup>
        </CSSTransition>
        {/* <hr className="my-2" /> */}
        {/* <GrayHover onClick={handleImageFormClick}>
          <input
            onChange={handleImageSelect}
            style={{ display: "none" }}
            type="file"
            ref={imageInputRef}
          />
          <FcStackOfPhotos size={36} className="mr-2" />
          <p className="m-0">Photos</p>
        </GrayHover> */}
      </Form>
    </Container>
  );
};

export default PostForm;
