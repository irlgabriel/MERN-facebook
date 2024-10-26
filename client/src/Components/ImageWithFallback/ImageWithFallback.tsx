import { useState } from "react";

export const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackSrc = "https://picsum.photos/900/600";

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      className={`w-8 h-8 object-cover ${className ? className : ""}`}
      style={{ display: isLoading ? "none" : "block" }} // Hide until loading is done
    />
  );
};
