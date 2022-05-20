import React, {useEffect, useState} from "react";
import { AbsoluteContainer } from "./LoadingOverlay.components";
import { Spinner } from "reactstrap";

const LoadingOverlay = () => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setAnimating(false);
  }, [])

  return (
    <AbsoluteContainer>
      <div className="text-center">
        <h3>Loading...</h3>
        <Spinner size="128" style={{ zIndex: 5 }} color="royalblue" />
      </div>
    </AbsoluteContainer>
  );
};

export default LoadingOverlay;