import React from "react";
import { Photo } from "Types";
import { Image, Wrapper } from "./Photo.components";

interface Props {
  photo: Photo;
}

const photo = ({ photo }: Props) => {
  const len = photo.id.split(".").length;

  return (
    <Wrapper
      to={`/posts/${photo.id
        .split(".")
        .reduce((acc, curr, idx) => (idx < len - 1 ? acc + curr : acc), "")}`}
    >
      <Image width="100%" src={photo?.url ?? null} />
    </Wrapper>
  );
};

export default photo;
