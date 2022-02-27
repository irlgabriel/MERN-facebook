import React from "react";
import {
  Container,
  Like,
  Overlay,
  Image,
  Paragraph,
  Header,
} from "./LikesModal.components";
import { User as ILike } from "Types";

interface Props {
  setLikesModal: (show: boolean) => void;
  likes: ILike[];
}

const LikesModal = ({ setLikesModal, likes }: Props) => {
  return (
    <Overlay onClick={() => setLikesModal(false)}>
      <Container className="p-2" onClick={(e) => e.stopPropagation()}>
        <Header>
          <Paragraph>Liked by {likes.length} people</Paragraph>
        </Header>
        {likes.map((like) => (
          <Like to={`/users/${like._id}`}>
            <Image width="24px" height="24px" src={like.profile_photo} />
            <Paragraph>
              {like.display_name || like.first_name + " " + like.last_name}
            </Paragraph>
          </Like>
        ))}
      </Container>
    </Overlay>
  );
};

export default LikesModal;
