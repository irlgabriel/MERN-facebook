import Link from "next/link";
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 0.5rem;
`;

export const FriendsContainer = styled.div`
  background: white;
  margin: 0 auto;
  border-radius: 5px;
  width: min(100%, 950px);
`;

export const Friend = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  color: black;
  &:hover {
    text-decoration: none;
    color: black;
  }
`;

export const Image = styled.img`
  border-radius: 36px;
`;
