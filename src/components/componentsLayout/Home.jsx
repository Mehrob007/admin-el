import { useEffect, useState } from "react";
import Input from "../comElement/Input";
// import ImageUploader from "../comElement/ImageUploader";
import apiClient from "../../utils/apiClient";
import VideoUploader from "../comElement/VideoUploader";
import axios from "axios";

export default function Home() {
  localStorage.setItem(
    "refreshToken",
    "Sy1l1JmVbxUo4i5fp6/yQ+N87m0lfWr9o8BSfKMgItIvy8WpRG2DuFqc6T6c4AJFkqcah5oGx+KmxiYch6adBWzpLrKL+Ls4+lFIJMN0x4G2iy3pgkwIjydJ9bpFzqcMV/X5QUQ2A8Dsu0gS7VPDAIG41R/2vmpTg/v/8AUY8Oo=",
  );
  const [newCollection, setNewCollection] = useState("");
  const [localNewCollection, setLocalNewCollection] = useState("");
  const [dataCollections, setDataCollections] = useState([]);

  const GetBunner = async (setVideoSrc, getUrl, setLoading) => {
    try {
      setLoading(true);
      const response = await axios.get(getUrl, { responseType: "blob" });
      const videoUrl = URL.createObjectURL(response.data);
      setVideoSrc(videoUrl);
    } catch (error) {
      setVideoSrc(null);
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };
  const getCollections = async () => {
    try {
      const res = await apiClient.get("collections/admins");
      setDataCollections(res.data.data.collections);
    } catch (e) {
      console.error(e);
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
    getCollections();
  }, []);

  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };
  console.log(newCollection);

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
          {/* <Input
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
          /> */}
          <select
            className="select__com"
            value={newCollection?.name?.name}
            onChange={(e) => {
              setNewCollection(JSON.parse(e.target.value));
              // console.log(e.target);
              
            }}
          >
            <option value="">Коллекция</option>
            {dataCollections?.map((el) => (
              <option key={el.id} value={JSON.stringify(el)}>
                {el.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (newCollection?.id) {
                // onSendNewCollection({
                //   url: "collections",
                //   data: { name: newCollection },
                //   payload: (data) => {
                //     // setNewCollection("");
                //     patchCollections(data.id);
                //   },
                // });
                patchCollections(newCollection?.id);
                setTimeout(getNewCollection(), 1000);
                setTimeout(setNewCollection(""), 100);
              }
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
            getUrl={import.meta.env.VITE_ENV_URL_FILE + `banner/window`}
            postUrl={import.meta.env.VITE_ENV_URL_FILE + "banner/window"}
            handleFileChange={handleFileChange}
            urlDeleteCom={`banner/window/remove`}
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
            getUrl={import.meta.env.VITE_ENV_URL_FILE + `banner/mobile`}
            postUrl={import.meta.env.VITE_ENV_URL_FILE + "banner/mobile"}
            handleFileChange={handleFileChange}
            urlDeleteCom={`banner/mobile/remove`}
          />
        </div>
      </div>
    </div>
  );
}
