import React, { PropsWithChildren } from "react";
import { Photo } from "../../Components";
import { PhotosContainer } from "./Photos.components";

type Props = PropsWithChildren<{
  photos: string[];
}>;

const Photos = ({ photos }) => {
  return (
    <PhotosContainer>
      {!photos.length && <p>No photos Available</p>}
      {photos.map((photo) => (
        <Photo key={photo._id} photo={photo}></Photo>
      ))}
    </PhotosContainer>
  );
};

export default Photos;
