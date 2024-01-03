import React from "react";
import { Image, Wrapper } from "./Photo.components";
const Photo = ({ photo }) => {
  return (
    <Wrapper href={`/posts/${photo._id}`}>
      <Image width="100%" src={photo?.image?.url ?? null} />
    </Wrapper>
  );
};

export default Photo;
