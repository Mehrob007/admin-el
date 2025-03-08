import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Trash from "../../assets/icon/Trash.svg";
import apiClientFiles from "../../utils/apiFileService";

const VideoUploader = ({
  postUrl,
  handleFileChange,
  getUrl,
  GetBunner,
  urlDeleteCom,
}) => {
  const fileInputRef = useRef(null); // Ссылка на <input type="file">
  const [videoSrc, setVideoSrc] = useState(null); // Хранит URL выбранного видео
  const [error, setError] = useState("");
  // const [bannerId, setBannerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [renderVideo, setRenderVideo] = useState(false);
  const [valid, setValid] = useState(true);
  const [validVideo, setValidVideo] = useState(true);
  // const [urlDelete, setUrlDelete] = useState(urlDeleteCom);
  // const navigate = useNavigate();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const deleteBunner = async () => {
    try {
      setLoading(true);
      await apiClientFiles.delete(`${urlDeleteCom}`);
      GetBunner(setVideoSrc, getUrl, setLoading);
      // navigate(0)
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

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

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        // accept="video/*"
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
        <>
          <div style={{ marginTop: "20px" }}>
            {validVideo && (
              <video
                onError={() => setValidVideo(false)}
                controls
                style={{ maxWidth: "300px", border: "1px solid #ddd" }}
              >
                <source src={videoSrc} type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            )}
            {valid && (
              <img
                onError={() => setValid(false)}
                style={{ maxWidth: "300px", border: "1px solid #ddd" }}
                src={videoSrc}
                alt="img"
              />
            )}
          </div>
        </>
      )}
      <div className="button__bunner__delete__add">
        <button
          style={{ background: loading && "#d9d9d9", width: 252 }}
          onClick={(e) => {
            if (!loading) {
              handleButtonClick(e);
            }
          }}
        >
          Загрузить видео
        </button>
        <button
          style={{ width: 45, height: 45, background: loading && "#d9d9d9" }}
          className="button__delete__bunner"
          onClick={() => {
            if (!loading) {
              deleteBunner();
            }
          }}
        >
          <img src={Trash} alt="Trash" />
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VideoUploader;
