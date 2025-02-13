import { useEffect, useState } from "react";
import Input from "../comElement/Input";
// import ImageUploader from "../comElement/ImageUploader";
import apiClient from "../../utils/apiClient";
import VideoUploader from "../comElement/VideoUploader";
import axios from "axios";

export default function Home() {
  const [newCollection, setNewCollection] = useState("");
  const [localNewCollection, setLocalNewCollection] = useState("");

  const GetBunner = async (setVideoSrc, getUrl, setLoading) => {
    try {
      setLoading(true);
      const response = await axios.get(getUrl, { responseType: "blob" });
      const videoUrl = URL.createObjectURL(response.data);
      setVideoSrc(videoUrl);
      console.log("videoUrl", response.data);
    } catch (error) {
      setVideoSrc(null);
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSendNewCollection = async ({ url, data, payload = () => {} }) => {
    try {
      const response = await apiClient.post(url, data);
      // console.log(response.data);
      payload(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (
    file,
    setVideoSrc,
    setError,
    url,
    getUrl,
    setLoading,
    setRenderVideo,
  ) => {
    if (file.size < 30000048) {
      try {
        const formData = new FormData();
        formData.append("banner", file);
        const reader = new FileReader();
        setRenderVideo(false);
        reader.onloadend = () => {
          onSendNewCollection({
            url: url,
            data: formData,
            payload: () => {
              GetBunner(setVideoSrc, getUrl, setLoading);
            },
          });

          setError("");
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError("Ошибка при загрузке файла.", err);
      }
    } else {
      setError("Пожалуйста, выберите файл до 30МБ.");
    }
  };
  const getNewCollection = async () => {
    try {
      const res = await apiClient.get("/collections/admins?isPrimary=true");
      setLocalNewCollection(res.data.data.collections[0].name);
    } catch (e) {
      console.error(e);
    }
  };
  const patchCollections = async (el) => {
    try {
      await apiClient.patch("collections/primary", { id: el });
      getNewCollection();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getNewCollection();
  }, []);

  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };
  console.log("localNewCollection", localNewCollection);

  return (
    <div className="box__home">
      <div className="com__box">
        <div className="top__com">
          <h1>Название новой коллекции</h1>
          <p>
            Название коллекции которое будет отображаться на главном баннере
          </p>
        </div>
        <div className="top__com">
          <p>Текущий: {localNewCollection}</p>
        </div>
        <div className="bottom__com">
          <Input
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
          />
          <button
            onClick={() => {
              onSendNewCollection({
                url: "collections",
                data: { name: newCollection },
                payload: (data) => {
                  // setNewCollection("");
                  patchCollections(data.id);
                },
              });
              setTimeout(getNewCollection(), 1000);
              setTimeout(setNewCollection(""), 100);
            }}
          >
            Сохранить
          </button>{" "}
        </div>
      </div>
      <div className="com__box">
        <div className="top__com">
          <h1>Десктоп версия</h1>
          <p>Загрузите файл до 30мб</p>
        </div>
        <div className="bottom__com">
          {/* <ImageUploader handleFileChange={handleFileChange} /> */}
          <VideoUploader
            GetBunner={GetBunner}
            getUrl={`http://45.15.158.130:5238/banner/window`}
            postUrl={"http://45.15.158.130:5238/banner/window"}
            handleFileChange={handleFileChange}
            // urlDeleteCom={`/Banner/delete-banner`}
          />
        </div>
      </div>
      <div className="com__box">
        <div className="top__com">
          <h1>Мобильная версия</h1>
          <p>Загрузите файл до 30мб</p>
        </div>
        <div className="bottom__com">
          <VideoUploader
            GetBunner={GetBunner}
            getUrl={`http://45.15.158.130:5238/banner/mobile`}
            postUrl={"http://45.15.158.130:5238/banner/mobile"}
            handleFileChange={handleFileChange}
            // urlDeleteCom={`/Banner/delete-banner-mobile`}
          />
        </div>
      </div>
    </div>
  );
}
