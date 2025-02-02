import { useEffect, useRef, useState } from "react";
import apiClient from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";

const VideoUploader = ({
  postUrl,
  handleFileChange,
  getUrl,
  GetBunner,
  // urlDeleteCom,
}) => {
  const fileInputRef = useRef(null); // Ссылка на <input type="file">
  const [videoSrc, setVideoSrc] = useState(null); // Хранит URL выбранного видео
  const [error, setError] = useState("");
  // const [bannerId, setBannerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [renderVideo, setRenderVideo] = useState(false);
  // const [urlDelete, setUrlDelete] = useState(urlDeleteCom);
  // const navigate = useNavigate();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const deleteBunner = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await apiClient.delete(`${urlDelete}?id=${bannerId}`);
  //     console.log(res);
  //     // GetBunner(setVideoSrc, getUrl, setLoading, setBannerId);
  //     navigate(0)
  //     setLoading(false)
  //   } catch (e) {
  //     console.error(e);
  //     setLoading(false)
  //   }
  // };

  useEffect(() => {
    if (GetBunner && !setVideoSrc.length) {
      GetBunner(setVideoSrc, getUrl, setLoading);
    }
  }, [GetBunner]);

  useEffect(() => {
    GetBunner(setVideoSrc, getUrl, setLoading);
  }, []);

  // useEffect(() => {
  //   setUrlDelete(urlDeleteCom);
  // }, [urlDeleteCom]);
  useEffect(() => {
    setRenderVideo(false);
    if (videoSrc) {
      setRenderVideo(true);
    }
  }, [videoSrc]);

  // console.log("videoSrc", videoSrc);
  // console.log("renderVideo", renderVideo);

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="video/*"
        onChange={(event) =>
          handleFileChange(
            event.target.files[0],
            setVideoSrc,
            setError,
            postUrl,
            getUrl,
            setLoading,
            setRenderVideo,
            // setBannerId,
          )
        }
      />
      {renderVideo && (
        <div style={{ marginTop: "20px" }}>
          <video
            controls
            style={{ maxWidth: "300px", border: "1px solid #ddd" }}
          >
            <source src={videoSrc} type="video/mp4" />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
      )}
      {
        <button
          style={{ background: loading && "#d9d9d9", width: "200px" }}
          onClick={(e) => {
            if (!loading) {
              handleButtonClick(e);
            }
          }}
        >
          Загрузить видео
        </button>
      }
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VideoUploader;
