import { useEffect, useRef, useState } from "react";
import apiClient from "../../utils/apiClient";
import Trash from "../../assets/icon/Trash.svg";
import backProductsIcon from "../../assets/icon/backProductsIcon.svg";
import { useNavigate } from "react-router-dom";
import apiClientFiles from "../../utils/apiFileService";
// import getImageSrс from "../../utils/urlImage"
import ImageComponent from "./ImageComponent";
import loadingPhoto from "../../assets/icon/loadingPhoto.svg";

const getImageSrc = (imageName) =>
  import.meta.env.VITE_ENV_URL_FILE + `gallery?gallery=${imageName}`;

export default function PhotoGallery() {
  const [dataCollections, setDataCollections] = useState([]);
  const fileInputRef = useRef(null);
  const [formG, setFormG] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [image, setImage] = useState([]);
  const [page, setPage] = useState(0);
  const [edit, setEdit] = useState(false);
  const [loading, setLoadingt] = useState(false);
  const [dataSend, setDataSend] = useState({
    name: "",
    images: [],
  });
  const navigate = useNavigate();

  const addPhotoGallery = async () => {
    // console.log(dataSend?.images?.length || !dataSend?.name?.length);

    if (!dataSend?.images?.length || !dataSend?.name?.length) return;
    setLoadingt(true);
    if (!edit) {
      try {
        await apiClient.post("galleries", {
          ...dataSend,
          images: dataSend?.images?.map((el) => ({ source: el?.source })),
        });
        navigate(0);
        setLoadingt(false);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        await apiClient.put("galleries", dataSend);
        navigate(0);
        setEdit(false);
        setLoadingt(false);
      } catch (e) {
        console.error(e);
      }
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

  const addPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const [res, imgBase64] = await Promise.all([
        apiClientFiles.post("gallery/upload", formData),
        convertToBase64(file),
      ]);
      await Promise.all([
        apiClientFiles.post("gallery/submit", { source: res.data.source }),
      ]);

      return { source: res.data.source, sourceLoc: imgBase64 };
    } catch (e) {
      console.error("Ошибка при загрузке фото:", e);
    }
  };

  // const handleFileChange = async (event, color) => {
  //   const files = event.target.files;
  //   if (!files.length) return;

  //   let photos = [];

  //   const uploadPromises = Array.from(files).map(async (file) => {
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert("Размер файла не может превышать 5мб.");
  //       return;
  //     }
  //     let itemPhoto = await addPhoto(file, color);
  //     photos.push(itemPhoto);
  //   });
  //   await Promise.all(uploadPromises);
  //   setDataSend((prevState) => ({
  //     ...prevState,
  //     images: [...prevState.images, ...photos],
  //   }));
  // };
  const handleFileChange = async (event, color) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    // const prevState = allData.find((prev) => prev.color.hex === color);

    // if (!prevState) {
    //   console.error(`Цвет ${color} не найден в allData`);
    //   return;
    // }

    let photos = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не может превышать 5мб.");
        continue; // Пропускаем этот файл, но не прерываем цикл
      }

      let itemPhoto = await addPhoto(file, color);
      photos.push(itemPhoto);

      // if (edit) {
      //   await apiClient.put(import.meta.env.VITE_ENV_URL + "images", {
      //     productId: prevState?.selectedColor?.productId,
      //     imageSource: itemPhoto?.source,
      //   });
      // }
    }
    setDataSend((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...photos],
    }));

    // onChange("images", [...prevState.images, ...photos], color);
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
      images: prevState?.images?.filter((_, i) => i !== index),
    }));
  };
  const deleteGallery = async (id) => {
    try {
      await apiClient.delete(`/galleries`, {
        data: {
          id: id,
          forceDeleted: true,
        },
      });
      navigate(0);
    } catch (e) {
      console.error(e);
    }
  };
  const getGallery = async () => {
    try {
      const res = await apiClient.get(
        `/galleries/admin?limit=${24}&page=${page}`,
      );
      const newData = res?.data?.data?.map((el) => ({
        ...el,
        images: el?.images,
      }));

      setImage([...image, ...newData]);
      setPage(page + 1);
      setFetching(false);
    } catch (e) {
      console.error(e);
    }
  };

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
            <button
              style={{ background: loading && "#D9D9D9" }}
              onClick={() => {
                if (!loading) addPhotoGallery();
              }}
            >
              Сохранить альбом
            </button>
          )}
        </div>
      </div>
      {!formG ? (
        <div>
          <div className="com__box com__pars__for__gallery">
            {image.length
              ? image?.map((el, i) => (
                  <div key={i}>
                    <h1>{el?.name}</h1>
                    <div className="gallery__parsing">
                      {el?.images?.map((prev, i) => (
                        // <img
                        //   src={getImageSrc(prev.source)}
                        //   key={i}
                        //   alt="image-gallery"
                        // />
                        <ImageComponent
                          el={prev}
                          i={i}
                          loadingPhoto={loadingPhoto}
                          key={i}
                        />
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
              : ""}
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
                    name: el.target.value,
                  });
                }}
                value={dataSend?.name}
              >
                <option value="">Коллекция</option>
                {dataCollections?.map((el) => (
                  <option key={el.id} value={el.name}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>
            {!dataSend?.name?.length && (
              <p className="error">Коллекция обязателен.</p>
            )}
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
            {!dataSend?.images?.length && (
              <p className="error">
                Необходимо загрузить хотя бы одну фотографию.
              </p>
            )}
            <div
              className="arr__img__rodect"
              style={{ marginTop: "20px", minHeight: "200px" }}
            >
              {dataSend?.images?.map((el, i) => (
                <div key={i}>
                  {/* <img
                    src={el.sourceLoc ? el.sourceLoc : getImageSrc(el.source)}
                    alt="imgProduct"
                  /> */}
                  <ImageComponent el={el} i={i} loadingPhoto={loadingPhoto} />
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
