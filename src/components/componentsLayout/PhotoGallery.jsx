import { useEffect, useRef, useState } from "react";
import apiClient from "../../utils/apiClient";
import Trash from "../../assets/icon/Trash.svg";
import backProductsIcon from "../../assets/icon/backProductsIcon.svg";
import { useNavigate } from "react-router-dom";
// import getImageSrс from "../../utils/urlImage"

const getImageSrc = (imageName) =>
  `https://backendeleven.ru/images/${imageName}`;

export default function PhotoGallery() {
  const [dataCollections, setDataCollections] = useState([]);
  const fileInputRef = useRef(null);
  const [formG, setFormG] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [image, setImage] = useState([]);
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(false);
  const [dataSend, setDataSend] = useState({
    nameCollection: "",
    photos: [],
  });
  const navigate = useNavigate();
  console.log("dataSend", dataSend);
  const addPhotoGallery = async () => {
    if (!edit) {
      try {
        await apiClient.post("/CollectionGallery/create-collection", dataSend);
        navigate(0);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await apiClient.put("/CollectionGallery/update-collection", dataSend);
        navigate(0);
        setEdit(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getCollections = async () => {
    try {
      const res = await apiClient.get("/collections");
      setDataCollections(res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files) return;

    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не может превышать 5мб.");
        continue;
      }

      const base64 = await convertToBase64(file);
      base64Images.push(base64);
    }

    setDataSend((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, ...base64Images],
    }));
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const removeImage = (index) => {
    setDataSend((prevState) => ({
      ...prevState,
      photos: prevState?.photos?.filter((_, i) => i !== index),
    }));
  };
  const deleteGallery = async (id) => {
    try {
      await apiClient.delete(
        `/CollectionGallery/delete-collection-gallery?collectionId=${id}`,
      );
      navigate(0);
    } catch (e) {
      console.error(e);
    }
  };
  const getGallery = async () => {
    try {
      const res = await apiClient.get(
        `/CollectionGallery/get-gallery-collection?limit=${50}&page=${page}`,
      );
      const newData = res?.data?.galleries[0]?.map((el) => ({
        ...el,
        photos: el?.photos?.map((prev) => getImageSrc(prev)),
      }));

      setImage([...image, ...newData]);
      setPage(page + 1);
      setFetching(false);
    } catch (e) {
      console.error(e);
    }
  };
  console.log("images", image);

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        setFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll); // Чистим обработчик при размонтировании
  }, []);

  useEffect(() => {
    if (fetching) {
      getGallery();
    }
  }, [fetching]);
  return (
    <div>
      <div className="com__box">
        <div className="content__photo__gallery">
          <div className="top__com">
            {formG && (
              <img
                onClick={() => {
                  setFormG(false);
                  setEdit(false);
                }}
                className="button__back"
                src={backProductsIcon}
                alt="backProductsIcon"
              />
            )}
            <h1>Фотогалерея</h1>
            <p>Добавляйте новые фотографии в галерею</p>
          </div>

          {!formG ? (
            <button onClick={() => setFormG(true)}>Добавить альбом</button>
          ) : (
            <button onClick={addPhotoGallery}>Сохранить альбом</button>
          )}
        </div>
      </div>
      {!formG ? (
        <div>
          <div className="com__box com__pars__for__gallery">
            {image.length
              ? image?.map((el, i) => (
                  <div key={i}>
                    <h1>{el?.nameCollection}</h1>
                    <div className="gallery__parsing">
                      {el?.photos?.map((prev, i) => (
                        <img src={prev} key={i} alt="image-gallery" />
                      ))}
                    </div>
                    <div className="active__gallery">
                      <button
                        onClick={() => {
                          setFormG(true);
                          setDataSend(el);
                          setEdit(true);
                        }}
                      >
                        Изменить
                      </button>
                      <button onClick={() => deleteGallery(el.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))
              : "Загрузка..."}
          </div>
        </div>
      ) : (
        <div className="box__photo">
          <div className="com__box">
            <div className="top__com">
              <h1 style={{ marginBottom: "20px" }}>Коллекция</h1>
              <select
                onChange={(el) => {
                  setDataSend({
                    ...dataSend,
                    nameCollection: el.target.value,
                  });
                }}
                value={dataSend?.nameCollection}
              >
                <option value="">Коллекция</option>
                {dataCollections?.map((el) => (
                  <option key={el.id} value={el.collectionName}>
                    {el.collectionName}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: "20px" }} className="top__com">
              <h1>Фотографии</h1>
              <p>Размер фото не может быть более 5мб.</p>
            </div>
            <button
              className="el__button"
              style={{ width: "250px" }}
              onClick={() => fileInputRef.current.click()}
            >
              Добавить
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />{" "}
            {!dataSend?.photos && (
              <p className="error">Поле обязательно для заполнения.</p>
            )}
            <div
              className="arr__img__rodect"
              style={{ marginTop: "20px", minHeight: "200px" }}
            >
              {dataSend?.photos?.map((el, i) => (
                <div key={i}>
                  <img src={el} alt="imgProduct" />
                  <span>
                    <button
                      style={{ width: 45 }}
                      onClick={() => removeImage(i)}
                    >
                      <img src={Trash} alt="Trash" />
                    </button>
                  </span>
                </div>
              ))}

              {/* PhotoGallery */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
