import styled from "styled-components";
import { BsFillImageFill } from "react-icons/bs";

export const PhotoImage = styled(BsFillImageFill)`
  top: 4px;
  right: 14px;
  position: absolute;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
    opacity: 0.75;
    cursor: pointer;
  }
`;

export const UserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const TextArea = styled.textarea`
  border-radius: 16px;
  border: 1px solid gray;
  padding: 0.25rem;
`;
