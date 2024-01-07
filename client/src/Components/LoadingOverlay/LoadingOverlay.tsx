import React from "react";
import { AbsoluteContainer } from "./LoadingOverlay.components";
import { Spinner } from "flowbite-react";

type Props = React.PropsWithChildren<{
  loading?: boolean;
}>;

const LoadingOverlay = ({ loading = true, children }: Props) => {
  if (!loading) return children;
  return (
    <AbsoluteContainer>
      <div className="text-center">
        <h3>Loading...</h3>
        <Spinner size="128" style={{ zIndex: "5" }} color="royalblue" />
      </div>
    </AbsoluteContainer>
  );
};

export default LoadingOverlay;
