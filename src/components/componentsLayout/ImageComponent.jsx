import { useState } from "react";

function ImageComponent({ el, i, loadingPhoto }) {
  const [src, setSrc] = useState(
    el?.source
      ? import.meta.env.VITE_ENV_URL_FILE + `gallery?gallery=${el?.source}`
      : loadingPhoto,
  );
  const handleError = () => {
    setSrc(loadingPhoto);
  };

  return (
    <img
      src={src}
      alt={`img-${i}`}
      className="image-item"
      onError={handleError}
    />
  );
}

export default ImageComponent;
