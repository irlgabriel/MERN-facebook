import styled from "styled-components";
import { BsFillImageFill } from "react-icons/bs";

export const RoundImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const PhotoImage = styled(BsFillImageFill)`
  top: 6px;
  right: 14px;
  position: absolute;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
    opacity: 0.75;
    cursor: pointer;
  }
`;
